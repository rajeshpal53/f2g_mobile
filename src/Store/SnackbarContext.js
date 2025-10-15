// SnackbarContext.js
import React, { createContext, useState, useContext, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Stack of snackbars
  const [current, setCurrent] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  // Show a new snackbar
  const showSnackbar = (message, severity = "success", duration = 3000) => {
    const id = Date.now();
    const newSnackbar = { id, message, severity, duration };
    setQueue(prev => [...prev, newSnackbar]);

    // If nothing is showing, start displaying
    if (!current) displayNextSnackbar();
  };

  // Display next snackbar in queue
  const displayNextSnackbar = () => {
    if (queue.length === 0) return;

    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: next.duration,
      useNativeDriver: false,
    }).start();

    // Auto-hide after duration
    timeoutRef.current = setTimeout(() => {
      hideSnackbar();
    }, next.duration);
  };

  // Hide current snackbar
  const hideSnackbar = () => {
    clearTimeout(timeoutRef.current);
    setCurrent(null);

    // Display next in queue if available
    if (queue.length > 0) {
      setTimeout(displayNextSnackbar, 200); // small delay
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {current && (
        <View style={styles.container}>
          <View
            style={[
              styles.snackbarBox,
              {
                backgroundColor:
                  current.severity === "error" ? "#FDECEC" : "#E7F9ED",
              },
            ]}
          >
            <MaterialIcons
              name={current.severity === "error" ? "error-outline" : "check-circle"}
              size={24}
              color={current.severity === "error" ? "#D93025" : "#34A853"}
            />
            <Text
              style={[
                styles.messageText,
                { color: current.severity === "error" ? "#D93025" : "#2E7D32" },
              ]}
            >
              {current.message}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: current.severity === "error" ? "#D93025" : "#34A853",
              },
            ]}
          />
        </View>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  snackbarBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

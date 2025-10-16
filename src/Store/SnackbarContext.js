import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  const showSnackbar = (message, severity = "success", duration = 3000) => {
    const id = Date.now();
    setQueue(prev => [...prev, { id, message, severity, duration }]);
  };

  const displayNextSnackbar = () => {
    if (queue.length === 0 || current) return;

    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: next.duration,
      useNativeDriver: false,
    }).start();

    timeoutRef.current = setTimeout(() => hideSnackbar(), next.duration);
  };

  const hideSnackbar = () => {
    clearTimeout(timeoutRef.current);
    setCurrent(null);
  };

  useEffect(() => {
    if (!current && queue.length > 0) {
      displayNextSnackbar();
    }
  }, [queue, current]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {current && (
        <View style={styles.wrapper}>
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
              size={22}
              color={current.severity === "error" ? "#D93025" : "#34A853"}
            />
            <Text
              style={[
                styles.messageText,
                { color: current.severity === "error" ? "#D93025" : "#2E7D32" },
              ]}
              numberOfLines={2}
            >
              {current.message}
            </Text>

            {/* Progress bar inside the snackbar box to align perfectly */}
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
        </View>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  snackbarBox: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    overflow: "hidden", // 🔥 makes progress bar match the border
  },
  messageText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
  },
});
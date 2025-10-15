// SnackbarContext.js
import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    severity: "success", // 'success' | 'error'
  });

  const progress = useRef(new Animated.Value(0)).current;
  const hideTimeoutRef = useRef(null);

  const showSnackbar = (message, severity = "success", duration = 2000) => {
    // Clear any previous timeout if snackbar is re-triggered
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setSnackbar({ visible: true, message, severity });

    // Reset and start progress animation
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();

    // Auto-hide after duration
    hideTimeoutRef.current = setTimeout(() => {
      hideSnackbar();
    }, duration);
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"], // Shrinks bar
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.visible && (
        <View style={styles.container}>
          {/* Snackbar box */}
          <View
            style={[
              styles.snackbarBox,
              {
                backgroundColor:
                  snackbar.severity === "error" ? "#FDECEC" : "#E7F9ED",
              },
            ]}
          >
            <MaterialIcons
              name={
                snackbar.severity === "error" ? "error-outline" : "check-circle"
              }
              size={24}
              color={snackbar.severity === "error" ? "#D93025" : "#34A853"}
            />
            <Text
              style={[
                styles.messageText,
                { color: snackbar.severity === "error" ? "#D93025" : "#2E7D32" },
              ]}
            >
              {snackbar.message}
            </Text>
          </View>

          {/* Animated Progress Bar (Top) */}
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor:
                  snackbar.severity === "error" ? "#D93025" : "#34A853",
                width: progressWidth,
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
    justifyContent: "flex-start",
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

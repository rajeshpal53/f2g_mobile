// src/Store/UserDataContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
        console.log("✅ Loaded from AsyncStorage:", parsed);
      } else {
        console.log("ℹ️ No userData in AsyncStorage");
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const saveUserData = async (data) => {
    if (data) {
      await AsyncStorage.setItem("userData", JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem("userData");
    }
    setUserData(data);
  };

  const clearUserData = async () => {
    await AsyncStorage.removeItem("userData");
    setUserData(null);
  };

  return (
    <UserDataContext.Provider
      value={{ userData, saveUserData, clearUserData, loadUserData, isLoading }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;

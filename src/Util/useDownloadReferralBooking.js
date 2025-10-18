import React, { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Notifications from "expo-notifications";
import * as IntentLauncher from "expo-intent-launcher";
import { StorageAccessFramework } from "expo-file-system";
import { useStorageLocationContext } from "../Store/StorageLocationContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useDownloadReferralBooking = () => {
  const { saveFolderUri, setSaveFolderUri, saveFileUri, setSaveFileUri } =
    useStorageLocationContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Notifications.setNotificationCategoryAsync("DOWNLOAD_CATEGORY", [
      {
        identifier: "OPEN_FILE",
        buttonTitle: "Open File",
        options: { opensAppToForeground: true },
      },
    ]);

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.actionIdentifier === "OPEN_FILE") {
          openFile();
        }
      }
    );

    return () => sub.remove();
  }, [saveFileUri]);

  const openFile = () => {
    try {
      if (Platform.OS === "android" && saveFileUri) {
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: saveFileUri,
          flags: 1,
        });
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  };

  const saveFile = async (uri, filename, mimetype) => {
    try {
      let directoryUri = saveFolderUri;
      if (!directoryUri) {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert("Permission Required", "Cannot save file without permission.");
          return;
        }
        directoryUri = permissions.directoryUri;
        await setSaveFolderUri(directoryUri);
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri,
        filename,
        mimetype
      );

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await setSaveFileUri(fileUri);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Complete",
          body: `${filename} has been saved successfully.`,
          categoryIdentifier: "DOWNLOAD_CATEGORY",
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Save Failed", "Error saving the file.");
    }
  };

  // 📄 Download PDF (Referral or Booking)
  const downloadPdfHandler = async (api, name, token) => {
    await checkNotificationPermission();
    try {
      if (!api || !api.startsWith("http")) {
        console.error("❌ Invalid API URL:", api);
        Alert.alert("Invalid URL", "The file URL is invalid or missing.");
        return;
      }

      setIsLoading(true);
      console.log("📥 Downloading PDF:", api);

      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `${name}.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      console.log("✅ PDF downloaded:", result.uri);
      await saveFile(result.uri, `${name}.pdf`, "application/pdf");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      Alert.alert("Download Failed", "Unable to download the PDF file.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 Download Excel (Referral or Booking)
  const downloadExcelHandler = async (api, name, token) => {
    await checkNotificationPermission();
    try {
      if (!api || !api.startsWith("http")) {
        console.error("❌ Invalid API URL:", api);
        Alert.alert("Invalid URL", "The file URL is invalid or missing.");
        return;
      }

      setIsLoading(true);
      console.log("📥 Downloading Excel:", api);

      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `${name}.xlsx`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      console.log("✅ Excel downloaded:", result.uri);
      await saveFile(
        result.uri,
        `${name}.xlsx`,
        "application/vnd.ms-excel"
      );
    } catch (error) {
      console.error("❌ Error downloading Excel:", error);
      Alert.alert("Download Failed", "Unable to download the Excel file.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    downloadPdfHandler,
    downloadExcelHandler,
  };
};

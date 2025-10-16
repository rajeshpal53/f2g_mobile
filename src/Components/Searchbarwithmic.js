import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Searchbar } from "react-native-paper";
import { fontSize } from "../Util/UtilApi";
import { useSnackbar } from "../Store/SnackbarContext";

const Searchbarwithmic = ({
  searchQuery,
  setSearchQuery,
  setsearchmodal,
  setTranscript,
  placeholderText,
  refuser,
  fetchData,
  searchData,
  showSearchedData = null,
}) => {
  const [recognizing, setRecognizing] = useState(false);
  const [SelectedPlaceholderText, setSelectedPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [stopPlaceHolder, setStopPlaceHolder] = useState(false);
  const { showSnackbar } = useSnackbar();
  const isArray = Array.isArray(placeholderText);

  // ✅ Request microphone permission
  const requestMicrophonePermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "This app needs access to your microphone for speech recognition.",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Microphone permission granted");
      } else {
        console.log("Microphone permission denied");
      }
    }
  };

  // ✅ Start speech recognition
  const handleStart = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        console.warn("Permissions not granted", result);
        return;
      }

      if (!recognizing) {
        setsearchmodal(true);
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          requiresOnDeviceRecognition: false,
          addsPunctuation: true,
        });

        console.log("Speech recognition started");
      }
    } catch (error) {
      console.error("Error during speech recognition setup:", error);
    }
  };

  const handleMicPress = () => {
    setsearchmodal(true);
    handleStart();
  };

  // ✅ Speech recognition event handlers
  useSpeechRecognitionEvent("start", () => {
    setTranscript("");
    setRecognizing(true);
    console.log("Recognition started");
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
    ExpoSpeechRecognitionModule.stop();
    setsearchmodal(false);
    console.log("Recognition ended");
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (event.results.length > 0) {
      const fullTranscript = event.results[0]?.transcript;
      setTranscript(fullTranscript);
      setSearchQuery(fullTranscript);
      searchData(fullTranscript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    showSnackbar(event.message, "error");
    console.log("error message:", event.message);
  });

  // ✅ Animated placeholder typing effect
  useEffect(() => {
    if (searchQuery !== "" || stopPlaceHolder) return;

    if (isArray) {
      const currentPlaceholder = placeholderText[placeholderIndex];

      if (charIndex < currentPlaceholder?.length) {
        const timeout = setTimeout(() => {
          setSelectedPlaceholderText(
            (prev) => prev + currentPlaceholder[charIndex]
          );
          setCharIndex((prev) => prev + 1);
        }, 50);

        return () => clearTimeout(timeout);
      } else {
        const waitBeforeNext = setTimeout(() => {
          setSelectedPlaceholderText("");
          setCharIndex(0);
          setPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholderText.length
          );
        }, 2000);

        return () => clearTimeout(waitBeforeNext);
      }
    } else {
      setSelectedPlaceholderText(placeholderText);
    }
  }, [charIndex, placeholderIndex, placeholderText, isArray, searchQuery]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Searchbar
          ref={refuser || null}
          style={styles.searchbar}
          numberOfLines={1}
          placeholder={SelectedPlaceholderText || "Search for ..."}
          onFocus={() => setStopPlaceHolder(true)}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (showSearchedData) {
              showSearchedData.current = true;
            }
            searchData(searchQuery);
          }}
          onIconPress={() => {
            if (searchQuery.length > 0) {
              searchData(searchQuery);
            } else {
              refuser.current?.focus();
            }
          }}
          inputStyle={styles.inputStyle}
          onChangeText={(query) => {
            setSearchQuery(query);
            if (query === "") {
              setSelectedPlaceholderText("");
              setCharIndex(0);
              fetchData?.();
            }
          }}
          value={searchQuery}
          right={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    if (searchQuery.trim() !== "") {
                      searchData(searchQuery);
                    } else {
                      refuser.current?.focus();
                    }
                  }}
                >
                  <MaterialIcons name="search" size={24} color="green" />
                </TouchableOpacity>
              )}

              {searchQuery === "" ? (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={handleMicPress}
                >
                  <MaterialIcons name="mic" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    setSearchQuery("");
                    fetchData?.();
                  }}
                >
                  <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  searchbar: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    marginVertical: 1,
    marginBottom: 10,
  },
  inputStyle: {
    paddingBottom: 19,
    fontWeight: "medium",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
});

export default Searchbarwithmic;

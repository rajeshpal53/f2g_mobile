import React, { useContext, useState, useEffect } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { NORM_URL } from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context"
export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = profileStyle(colors);
  const isFocused = useIsFocused();
  const { userData, clearUserData } = useContext(UserDataContext);
  console.log(userData, "userData in profile");

  const [imageUrl, setImageUrl] = useState(`${NORM_URL}assets/mobile/male.png`);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loginConfirmModalVisible, setLoginConfirmModalVisible] = useState(false);
  const [isFullImageModalVisible, setIsFullImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { icon: "send", label: "All Refral", value: "refral" },
    { label: "Need more help?", value: "needMoreHelp" },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const AdminOption = [
    {
      icon: "person",
      label: "Admin Section",
      value: "AdminSection",
    },
  ];
  

  useEffect(() => {
    const updatelist = () => {
      try {
        const baseItem = [
          ...(userData?.user?.roles === "admin" ? AdminOption : []),
          { icon: "policy", label: "Terms and Policy", value: "Policies" },
          ...(userData ? [{ icon: "logout", label: "Logout", value: "Logout" }] : []),
          { label: "Need more help?", value: "needMoreHelp" },
        ];
        setMenuItems(baseItem);
      } catch (error) {
        console.log("Unable to fetch data ", error);
      } finally {
        setIsLoading(true);
      }
    };
    updatelist();
  }, [isFocused]);

  useEffect(() => {
    if (userData) {
      if (userData?.user?.profilePicurl) {
        const newVar = `${NORM_URL}/${userData?.user?.profilePicurl}`;
        setImageUrl(newVar);
      } else if (userData?.user?.gender == null) {
        setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
      } else if (userData?.user?.gender === "Female") {
        setImageUrl("https://dailysabji.com/assets/mobile/female.png");
      } else if (
        userData?.user?.gender === "Male" ||
        userData?.user?.gender === "male"
      ) {
        setImageUrl("https://dailysabji.com/assets/mobile/male.png");
      } else {
        setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
      }
    } else {
      setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
    }
  }, [isFocused]);

  const loginClickHandler = () => {
    navigation.navigate("LoginScreen");
  };

  const logoutHandler = () => {
  clearUserData();
  setVisible(false);

  navigation.reset({
    index: 0,
    routes: [{ name: "LoginScreen" }],
  });
};

  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setIsFullImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsFullImageModalVisible(false);
  };

  const handleEditPress = () => {
    navigation.navigate("EditProfile");
  };

  const handlePress = (value) => {
    if (value === "needMoreHelp") {
      navigation.navigate("FeedbackandHelp", {
        webUri: `${NORM_URL}/helpandsupport?view=mobile`,
        headerTitle: "Help & Support",
      });
    } else if (value === "AdminSection") {
      navigation.navigate("AdminSection");
    } else if (value === "Logout") {
      setVisible(true);
    }
    else if (value==="Policies"){
      navigation.navigate("Policies", {
          webUri: "https://qwikbill.in/qapp/privacy-policy?view=desktop",
          headerTitle: "Privacy and Policies",
        })
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors?.primary]}
              progressBackgroundColor={colors?.surface}
            />
          }
        >
          <View>
            <Card style={styles.card}>
              <View
                style={{
                  justifyContent: "center",
                  marginBottom: 25,
                  alignItems: "center",
                  backgroundColor: colors?.surface,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (userData?.user?.profilePicurl) {
                      const freshUrl = `${NORM_URL}${userData.user.profilePicurl}?${new Date().getTime()}`;
                      openImageModal(freshUrl);
                    }
                  }}
                >
                  <Image
                    source={{
                      uri: `${imageUrl}?${new Date().getTime()}`,
                    }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>

                {userData ? (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Poppins-Bold",
                        color: colors?.text,
                      }}
                    >
                      {userData?.user?.name || userData?.user?.mobile}
                    </Text>
                    <TouchableOpacity
                      onPress={handleEditPress}
                      style={{
                        height: 50,
                        justifyContent: "center",
                        width: 150,
                        alignItems: "center",
                      }}
                    >
                      <Button
                        icon="pencil"
                        mode="contained"
                        buttonColor={colors?.accent}
                        style={styles.button}
                      >
                        Edit
                      </Button>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    onPress={loginClickHandler}
                    mode="contained"
                    buttonColor={colors?.primary}
                    style={styles.button}
                  >
                    Login
                  </Button>
                )}
              </View>

              <Card.Content style={{ backgroundColor: colors?.surface, marginHorizontal: 10 }}>
                {menuItems?.map((item, index) =>
                  item.value === "needMoreHelp" ? (
                    <Pressable
                      onPress={() => handlePress("needMoreHelp")}
                      key={index}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: "Poppins-Medium",
                            color: colors?.text,
                          }}
                        >
                          {item.label}
                        </Text>
                        <View style={styles.helpItem}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <MaterialIcons
                              name="support-agent"
                              size={24}
                              color={colors?.text}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontFamily: "Poppins-Medium",
                                  color: colors?.textSecondary,
                                }}
                              >
                                Feedback and Help
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color: colors?.textSecondary,
                                  fontSize: 12,
                                }}
                              >
                                Contact us for your query and support
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontFamily: "Poppins-Medium",
                                color: colors?.accent,
                              }}
                            >
                              Support
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePress(item.value)}
                      style={styles.item}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={colors?.secondary}
                        style={styles.icon}
                      />
                      <Text style={styles.label}>{item.label}</Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={colors?.text}
                        style={styles.chevron}
                      />
                    </TouchableOpacity>
                  )
                )}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ✅ Login Confirmation Modal */}
      {loginConfirmModalVisible && (
        <ConfirmModal
          visible={loginConfirmModalVisible}
          setVisible={setLoginConfirmModalVisible}
          handlePress={loginClickHandler}
          message="Please login to become a service provider"
          heading="Login"
          buttonTitle="Login"
        />
      )}

      {/* ✅ Logout Confirmation Modal */}
      {visible && (
        <ConfirmModal
          visible={visible}
          message="Are you sure you want to log out?"
          heading="Confirm Logout"
          setVisible={setVisible}
          handlePress={logoutHandler}
          buttonTitle="Logout"
        />
      )}

      {/* ✅ Full Image Modal */}
      {isFullImageModalVisible && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Image
              key={selectedImageUri}
              source={
                selectedImageUri
                  ? { uri: selectedImageUri, cache: "reload" }
                  : { uri: `${NORM_URL}assets/mobile/neutral.png` }
              }
              style={styles.fullImage}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const profileStyle = (colors) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors?.surface,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: { marginRight: 15 },
    container: {
      height: "100%",
      justifyContent: "center",
      backgroundColor: colors?.background,
    },
    label: {
      fontFamily: "Poppins-Regular",
      color: colors?.text,
    },
    card: {
      width: "100%",
      height: "100%",
      backgroundColor: colors?.surface,
      justifyContent: "flex-start",
      marginTop: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    avatar: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginVertical: 10,
      borderRadius: 55,
      backgroundColor: colors?.avatarBackground || "gray",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
    },
    chevron: { marginLeft: "auto" },
    button: {
      justifySelf: "center",
      width: "70%",
      borderRadius: 10,
    },
    helpItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors?.surface,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "#000000aa",
      justifyContent: "center",
      alignItems: "center",
    },
    fullImage: {
      width: "90%",
      height: "80%",
      resizeMode: "contain",
    },
    closeButton: {
      position: "absolute",
      top: 40,
      right: 20,
      backgroundColor: colors?.background,
      padding: 10,
      borderRadius: 20,
    },
    closeButtonText: {
      color: "#000",
      fontWeight: "bold",
    },
  });

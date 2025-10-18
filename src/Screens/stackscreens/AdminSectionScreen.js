import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { Card, Text } from "react-native-paper";
import UserDataContext from "../../Store/UserDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { useSnackbar } from "../../Store/SnackbarContext";
import { NORM_URL, createApi } from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme";

const AdminSectionScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { userData, clearUserData } = useContext(UserDataContext);
  const [imageUrl, setImageUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { colors } = useTheme();
  const styles = profileStyle(colors);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const [menuItems, setMenuItems] = useState([
    { icon: "receipt", label: "Admin Dashboard", value: "AdminDashbordScreen" },
    { icon: "receipt", label: "All Bookings", value: "AllBookings" },
    // { icon: "people", label: "All Users", value: "AllUsers" },
    { icon: "local-shipping", label: "All Referrals", value: "AllRefrals" },
    { icon: "support-agent", label: "All Queries", value: "AllQueries" },
    // { icon: "logout", label: "Logout", value: "Logout" },
  ]);

  const handlePress = (value) => {
    if (value === "AdminDashbordScreen") navigation.navigate("AdminDashbordScreen", { isAdmin: true });
    else if (value === "AllBookings") navigation.navigate("adminViewBooking", { isAdmin: true });
    else if (value === "AllUsers") navigation.navigate("AllUsers");
    else if (value === "AllQueries") navigation.navigate("AllQuerysAndSupport");
    else if (value === "AllRefrals") navigation.navigate("adminViewReferral", { isAdmin: true });
    else if (value === "Logout") setVisible(true);
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.clear();
      await clearUserData();

      const token = userData?.token || (await AsyncStorage.getItem("userToken"));
      if (!token) {
        showSnackbar("Session expired. Please log in again.", "error");
        navigation.replace("login");
        return;
      }

      const response = await createApi(
        "users/logout",
        { mobile: userData?.user?.mobile },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.success) showSnackbar("Logged out successfully", "success");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "login" }],
        })
      );
    } catch (error) {
      showSnackbar("Session expired. Please log in again.", "error");
      await AsyncStorage.clear();
      await clearUserData();
      navigation.replace("login");
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData?.user?.profilePicurl)
        setImageUrl(`${NORM_URL}/${userData?.user?.profilePicurl}?${new Date()}`);
      else if (userData?.user?.gender === "Female")
        setImageUrl(`https://servicediary.online/assets/mobile/female.png`);
      else if (userData?.user?.gender === "Male" || userData?.user?.gender === "male")
        setImageUrl(`https://servicediary.online/assets/mobile/male.png`);
      else setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
    } else {
      setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
    }
  }, [isFocused, userData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
      >
        <View>
          <Card style={styles.card}>
            <View style={styles.headerSection}>
              <Image source={{ uri: imageUrl }} style={styles.avatar} />
              {userData && (
                <Text style={styles.userName}>
                  {userData?.user?.name || userData?.user?.mobile}
                </Text>
              )}
            </View>

            <Card.Content style={{ backgroundColor: colors.surface, marginHorizontal: 10 }}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(item.value)}
                  style={styles.item}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={colors.secondary}
                    style={styles.icon}
                  />
                  <Text style={styles.label}>{item.label}</Text>
                  <Icon
                    name="chevron-right"
                    size={24}
                    color={colors.text}
                    style={styles.chevron}
                  />
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const profileStyle = (colors) =>
  StyleSheet.create({
    container: {
      height: "100%",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    card: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.surface,
      justifyContent: "flex-start",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    headerSection: {
      justifyContent: "center",
      marginBottom: 20,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      marginBottom: 10,
      backgroundColor: colors.avatarBackground || "gray",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
    },
    userName: {
      fontSize: 20,
      fontFamily: "Poppins-Bold",
      color: colors.text,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
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
    icon: {
      marginRight: 15,
    },
    label: {
      fontFamily: "Poppins-Regular",
      color: colors.text,
    },
    chevron: {
      marginLeft: "auto",
    },
  });

export default AdminSectionScreen;

// import {
//   StyleSheet,
//   Text,
//   View,
//   Modal,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import React from "react";
// import { Entypo } from "@expo/vector-icons";
// import { fontSize, NORM_URL } from "../../../../Util/UtilApi";
// import { Divider } from "react-native-paper";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { Dimensions } from "react-native";
// const ViewQueryDetailModal = ({
//   item,
//   queryDetailModalVisible,
//   toggleModal,
// }) => {
//     const {height} = Dimensions.get("window");
//   return (
//     <View style={{ paddingHorizontal: 10 }}>
//       <Modal
//         animationType="slide"
//         isVisible={queryDetailModalVisible}
//         onRequestClose={toggleModal}
//         // style={{ flex: 1 }}
//       >
//         <View style={styles.modalContent}>
//           <View style={{maxHeight:height}}>
//             <TouchableOpacity
//               onPress={toggleModal}
//               style={{

//                 marginRight: 12,
//                 marginTop: 12,
//                 alignSelf: "flex-end",
//                 backgroundColor: "rgba(0, 0, 0, 0.3)",
//                 borderRadius: 10,
//                 padding: 2,
//               }}
//             >
//               <Entypo name="cross" size={30} color="rgba(0, 0, 0, 0.7)" />
//             </TouchableOpacity> 

//             <ScrollView
//               contentContainerStyle={{ flexGrow: 1 }}
//               style={{ marginTop: 5 }}
//             >
//               <View style={styles.contentStyle}>
//                 {/* <Text>Hello modal</Text> */}

//                 <View style={styles.textContainer}>
//                   <Text style={[styles.name, styles.textColor]}>
//                     {item?.name}
//                   </Text>
//                   <View style={styles.infoRow}>
//                     <MaterialCommunityIcons
//                       name="phone"
//                       size={18}
//                       color="#555"
//                       style={{ marginBottom: 3 }}
//                     />
//                     <Text style={[styles.textStyle, styles.textColor]}>
//                       {item?.mobile}
//                     </Text>
//                   </View>
//                   <View style={styles.infoRow}>
//                     <MaterialCommunityIcons
//                       name="email"
//                       size={18}
//                       color="#555"
//                       style={{ marginBottom: 3 }}
//                     />
//                     <Text style={[styles.textStyle, styles.textColor]}>
//                       {item?.email}
//                     </Text>
//                   </View>

//                   <Text style={[styles.textStyle, styles.textColor]}>
//                     {item?.description}
//                   </Text>

//                   <Text style={styles.feedbackType}>{item?.feedbackType}</Text>

//                   {item?.isResolved ? (
//                     <Text style={styles.queryTagStyle}>Query Resolved</Text>
//                   ) : (
//                     <Text style={styles.queryTagStyle}>Query Pending</Text>
//                   )}
//                 </View>

//                 <View>
//                   <Divider style={styles.dividerStyle} />
//                   <Text
//                     style={[
//                       { fontFamily: "Poppins-Medium", marginBottom: 10 },
//                       styles.textColor,
//                     ]}
//                   >
//                     ScreenShot:
//                   </Text>
//                   <Image
//                     source={{ uri: `${NORM_URL}${item?.screenShotUrl}` }}
//                     style={{ width: 300, height: 500 }}
//                     resizeMode="contain"
//                   />
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ViewQueryDetailModal;

// const styles = StyleSheet.create({
//   modalHeaderStyle: {
//     // flexDirection: "row",
//     marginTop: 10,
//     // justifyContent:"center"
//   },
//   modalContent: {
//     flex: 1,
//     // justifyContent: "flex-end",
//     // marginBottom: 10,
//     // maxHeight:600,

//     // paddingBottom:10
//   },
//   contentStyle: {
//     alignItems:"flex-start",
//     marginLeft:1
//   },
//   name: {
//     fontFamily: "Poppins-Bold",
//     fontSize: fontSize.headingSmall,
//   },
//   textStyle: {
//     fontFamily: "Poppins-Medium",
//   },
//   textContainer: {
//     gap: 10,
//   },
//   textColor: {
//     color: "rgba(0, 0, 0, 0.7)",
//   },
//   dividerStyle: {
//     marginVertical: 10,
//     height: 1,
//     // width:"100%"
//   },
//   queryTagStyle: {
//     fontFamily: "Poppins-Bold",
//     fontSize: fontSize.labelMedium,
//     color: "#0a6846",
//   },
//   feedbackType: {
//     color: "rgba(255, 0, 0, 0.7)",
//     fontFamily: "Poppins-Bold",
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     // marginTop: 4,
//   },
// });







import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React ,{useEffect, useState} from "react";
import { Entypo } from "@expo/vector-icons";
import { API_BASE_URL, fontSize, NORM_URL } from "../../../Util/UtilApi";
import { Divider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions } from "react-native";
//import ImageFullScreenModal from "../../../../Modals/ImageFullScreenModal";
import { t } from "i18next";

const ViewQueryDetailModal = ({ item, queryDetailModalVisible, toggleModal }) => {
  const { height } = Dimensions.get("window");
  const [fullScreenImageUri, setFullScreenImageUri] = useState([]);
  const [imageFullScreenModalVisible, setImageFullScreenModalVisible] =
      useState(false);

  console.log(" query detailed modal is open")
     
   const url = `${API_BASE_URL}/${item?.screenShotUrl}`

   console.log("full image url is ",url)

  const closeImageModal = () => {
    setImageFullScreenModalVisible(false);
    // setFullScreenImageUri(null);
  };


  const openImageModal = () => {
    if (item?.screenShotUrl) {
      setFullScreenImageUri([{ url: `${API_BASE_URL}/${item.screenShotUrl}` }]); // ✅ Correct format
      setImageFullScreenModalVisible(true);
    } else {
      showSnackbar("Image is not available", "error");
    }
  };
  
 
  return (
    <Modal animationType="fade" visible={queryDetailModalVisible} onRequestClose={toggleModal} transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: height * 0.85 }]}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Entypo name="cross" size={25} color="#fff" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.contentWrapper}>
              <Text style={styles.name}>{item?.name}</Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone" size={18} color="#555" />
                <Text style={styles.text}>{item?.mobile}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="email" size={18} color="#555" />
                <Text style={styles.text}>{item?.email}</Text>
              </View>

              <Text style={styles.description}>{item?.description}</Text>

              <Text style={styles.feedbackType}>{item?.feedbackType}</Text>

              <Text style={[styles.statusTag, item?.isResolved ? styles.resolved : styles.pending]}>
                {item?.isResolved ? t("Query Resolved") : t("Query Pending")}
              </Text>

              <Divider style={styles.divider} />

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Text style={styles.screenshotLabel}>{t("Screenshot")}:</Text>
                <TouchableOpacity onPress={openImageModal}>
                  <Text style={[styles.fullImage]}>{t("Tap to View")}</Text>
                </TouchableOpacity>
              </View>
 
              
              <Image
                source={{ uri: `${API_BASE_URL}/${item?.screenShotUrl}` }}
                style={styles.screenshot}
                resizeMode="contain"
              />

              {imageFullScreenModalVisible && (
                <ImageFullScreenModal
                  isVisible={imageFullScreenModalVisible}
                  onClose={closeImageModal}
                  imageUri={fullScreenImageUri}
                  closeText="Close"
                
                />
              )}


            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ViewQueryDetailModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#f5f5f5", // Softer background color
    borderRadius: 15, // Rounded corners
    padding: 20, // More padding for better spacing
    elevation: 7, // Subtle shadow
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent black
    borderRadius: 20, // Rounded close button
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    alignItems: "flex-start",
    paddingHorizontal: 15, // More spacing
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: fontSize.headingSmall,
    color: "#2c3e50", // Darker text color
    marginBottom: 10, // More spacing
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // More gap
    marginVertical: 5, // More margin
  },
  text: {
    fontFamily: "Poppins-Medium",
    fontSize: 15, // Slightly larger text
    color: "#34495e", // Darker text color
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#7f8c8d", // Softer text color
    marginVertical: 10, // More margin
    lineHeight: 22, // Improved line height
  },
  feedbackType: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#e74c3c", // Slightly darker red
  },
  statusTag: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    paddingVertical: 8, // More padding
    paddingHorizontal: 14, // More padding
    borderRadius: 8, // More rounded corners
    alignSelf: "flex-start",
    marginTop: 10, // More margin
  },
  resolved: {
    backgroundColor: "#d4edda", // Softer green background
    color: "#155724", // Darker green text
  },
  pending: {
    backgroundColor: "#f8d7da", // Softer red background
    color: "#721c24", // Darker red text
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc", // Softer color
    width: "100%",
    marginVertical: 18, // More margin
  },
  screenshotLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    marginBottom: 8, // More margin
    color: "#34495e", // Darker text color
  },
  fullImage: {
    fontFamily: "Poppins-Medium",
    fontSize: 13, // Slightly larger text
    marginBottom: 8, // More margin
    color: "#3498db", // Brighter blue
  },
  screenshot: {
    width: "100%",
    height: 400,
    borderRadius: 10, // More rounded corners
  },
});

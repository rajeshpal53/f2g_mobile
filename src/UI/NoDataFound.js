import React from 'react'
import { View,Image } from 'react-native';
import { Button,Text,  } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Constants/Theme';

function NoDataFound({textString,}) {
    const navigation=useNavigation()
    const {colors}=useTheme()
  return (
    <View
    style={{
      alignItems: "center",
      justifyContent: "center",
    }}
    >
    <Image
      source={require("../../assets/noDataFound.jpg")}
      style={{ width: 300, height: 230 }}
    />
    <Text
      style={{
        fontSize: 20,
        color: colors?.textSecondary,
        fontStyle: "bold",
        textAlign:"center"
      }}
    >
      {textString}
    </Text>
    </View>
  )
}

export default NoDataFound;
//f3f7f9
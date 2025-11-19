// CustomBackButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomBackButton = ({ marginTop = 0, screen = null }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (screen) {
      navigation.navigate(screen);
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginLeft: 10,
        justifyContent: 'center',
        width: 48,
        height: 48,
        marginTop: marginTop,
      }}
    >
      <Icon name="chevron-left" size={40} color="black" />
    </TouchableOpacity>
  );
};

export default CustomBackButton;

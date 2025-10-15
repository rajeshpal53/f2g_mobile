import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GenericDropdown = ({
  label,
  dropDownlabelStyle,
  options,
  selectedValue,
  onValueChange,
  containerStyle,
  pickerContainerStyle,
  pickerStyle,
  fontStyles,
  placeholder = "Select an option",
}) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, dropDownlabelStyle]}>
          {typeof label === 'string' && label.includes('*') ? (
            <>
              {label.replace('*', '')}
              <Text style={{ color: 'gray' }}>*</Text>
            </>
          ) : (
            label
          )}
        </Text>
      )}

      <View style={[styles.outlineContainer, pickerContainerStyle]}>
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={[styles.picker, pickerStyle]}
          dropdownIconColor={pickerStyle?.color || "black"}
          itemStyle={Platform.OS === "android" ? { height: 55, fontSize: 16 } : {}}
        >
          {/* Placeholder option */}
          <Picker.Item
            label={placeholder}
            value=""
            style={[fontStyles, { color: '#999' }]}
          />
          {options.map((option, index) => (
            <Picker.Item
              style={[fontStyles, { color: 'black' }]}
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outlineContainer: {
    height: 55, // matches TextInput height
    width: '100%',
    borderWidth: 1,
    borderColor: 'black', // black border
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  picker: {
    height: '100%',
    width: '100%',
    color: 'black',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    top: -10,
    left: 10,
    zIndex: 1,
    paddingHorizontal: 4,
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
});

export default GenericDropdown;

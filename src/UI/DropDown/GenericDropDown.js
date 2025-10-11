import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  placeholder = "Select an option", // added placeholder prop
}) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, dropDownlabelStyle]}>
          {typeof label === 'string' && label.includes('*') ? (
            <>
              {label.replace('*', '')}
              <Text>*</Text>
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
          onValueChange={(itemValue) => {
            console.log("setItem , ", itemValue);
            onValueChange(itemValue);
          }}
          style={[styles.picker, pickerStyle]}
          dropdownIconColor={pickerStyle?.color || "black"}
        >
          {/* Placeholder option */}
          <Picker.Item label={placeholder} value="" style={fontStyles} />
          {options.map((option, index) => (
            <Picker.Item
              style={fontStyles}
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
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000', // outline border
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: 'transparent', // remove flat fill
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    top: -12,
    left: 10,
    zIndex: 1,
    paddingHorizontal: 4,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});

export default GenericDropdown;

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../Constants/Theme";

const GenericDropdown = ({
  label,
  dropDownlabelStyle,
  options = [],
  selectedValue,
  onValueChange,
  containerStyle,
  pickerContainerStyle,
  pickerStyle,
  fontStyles,
  placeholder = "Select an option",
  EditMode = false,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text
          style={[
            styles.label,
            { backgroundColor: colors.surface, color: colors.textSecondary },
            dropDownlabelStyle,
          ]}
        >
          {typeof label === "string" && label.includes("*") ? (
            <>
              {label.replace("*", "")}
              <Text style={{ color: colors.danger }}> *</Text>
            </>
          ) : (
            label
          )}
        </Text>
      )}

      {/* Dropdown */}
      <View
        style={[
          styles.outlineContainer,
          {
            borderColor: colors.border,
            backgroundColor: colors.itemBackground,
            shadowColor: colors.shadow,
          },
          pickerContainerStyle,
        ]}
      >
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={[
            styles.picker,
            { color: colors.text, backgroundColor: "transparent" },
            pickerStyle,
          ]}
          dropdownIconColor={pickerStyle?.color || colors.text}
          itemStyle={
            Platform.OS === "android"
              ? { height: 55, fontSize: 16, color: colors.text }
              : { color: colors.text }
          }
        >
          {/* Placeholder */}
          {!EditMode && (
            <Picker.Item
              label={placeholder}
              value=""
              style={[fontStyles, { color: colors.textSecondary }]}
            />
          )}

          {/* Options */}
          {options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
              style={[fontStyles, { color: colors.text }]}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  outlineContainer: {
    height: 55,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
    elevation: Platform.OS === "android" ? 2 : 0,
  },
  picker: {
    height: "100%",
    width: "100%",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 14,
    zIndex: 2,
    paddingHorizontal: 6,
    fontSize: 13,
    fontWeight: "500",
  },
});

export default GenericDropdown;

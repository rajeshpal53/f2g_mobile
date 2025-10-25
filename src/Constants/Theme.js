import { useColorScheme } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// 🎨 Custom Light Colors
const LightColors = {
  muted: "#666",
  background: "#fff",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6C757D",
  border: "#EBEBEB",
  shadow: "rgba(0, 0, 0, 0.1)",
  primary: "#0C3B73",
  secondary: "#26A0DF",
  accent: "#007BFF",
  overlay: "rgba(0,0,0,0.05)",
  selected: "#E8F5E9",
  itemBackground: "#FFFFFF",
  helpBackground: "#FFFFFF",
  avatarBackground: "#B3ECFF",
  modalBackground: "rgba(0,0,0,0.8)",
  success: "#2E7D32",
  danger: "#D32F2F",
  warning: "#ED6C02",
  info: "#0288D1",
  xyz: "#FF00FF",
  main: "#304FFF",
  fab: "#26a0df",
};

// 🌙 Custom Dark Colors
const DarkColors = {
  muted: "#bbb",
  background: "#0D1117",
  surface: "#161B22",
  card: "#161B22",
  text: "#EBEBEB",
  textSecondary: "#8B949E",
  border: "#30363D",
  shadow: "rgba(255, 255, 255, 0.05)",
  primary: "#58A6FF",
  secondary: "#0C3B73",
  accent: "#339CFF",
  main: "#304FFF",
  fab: "#26a0df",
  overlay: "rgba(255,255,255,0.08)",
  selected: "rgba(38,160,223,0.15)",
  itemBackground: "#161B22",
  helpBackground: "#161B22",
  avatarBackground: "#213955",
  modalBackground: "rgba(0,0,0,0.9)",
  success: "#81C784",
  danger: "#EF9A9A",
  warning: "#FFB74D",
  info: "#4FC3F7",
  xyz: "#FF00FF",
};

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const customColors = isDark ? DarkColors : LightColors;

  // ✅ Merge custom colors into Paper theme
  const mergedTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      ...customColors,
      onSurface: customColors.text,
      onSurfaceVariant: customColors.textSecondary,
      onBackground: customColors.text,
      outline: customColors.border,
    },
  };

  return { ...mergedTheme, colors: mergedTheme.colors };
}

import { useColorScheme } from 'react-native';


// Light theme
const LightColors = {

  muted: "#666",
  background: "#F4F7F9",  // Very light background
  surface: "#FFFFFF", // Pure white for cards/items
  card: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6C757D",
  border: "#EBEBEB",
  shadow: "rgba(0, 0, 0, 0.1)", // Added shadow for a modern look

  // accents
  primary: "#0C3B73",// Deep Navy Blue (Primary Brand)
  secondary: "#26A0DF",// Light Sky Blue
  accent: "#007BFF",  // Bright Blue (Action)

  // states
  overlay: "rgba(0,0,0,0.05)",
  selected: "#E8F5E9", // Light Greenish

  // custom additions
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

};

const DarkColors = {

  muted: "#bbb",
  background: "#0D1117", // Deep Dark Background (Github Dark)
  surface: "#161B22", // Slightly lighter for cards
  card: "#161B22",
  text: "#EBEBEB",  // Off-white for readability
  textSecondary: "#8B949E", // Muted gray
  border: "#30363D",
  shadow: "rgba(255, 255, 255, 0.05)", // Subtle white shadow

  // accents
  primary: "#58A6FF", // Lighter blue for primary actions on dark mode
  secondary: "#0C3B73", // Deep accent blue
  accent: "#339CFF", // Brighter button color
  main: "#304FFF",

  // states
  overlay: "rgba(255,255,255,0.08)",
  selected: "rgba(38,160,223,0.15)",

  // custom additions
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
  const scheme = useColorScheme(); // 'light' or 'dark'
  console.log(scheme, "scheme")
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  const isDark = scheme === 'dark';
  return { colors, isDark };
}
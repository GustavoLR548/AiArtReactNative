import { ColorSchemeName } from "react-native";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemePalette {
  background: string;
  surface: string;
  border: string;
  text: string;
  mutedText: string;
  primary: string;
  onPrimary: string;
  inputBackground: string;
  drawerActiveTint: string;
  drawerInactiveTint: string;
  drawerActiveBackground: string;
  bannerBackground: string;
  bannerText: string;
}

const lightPalette: ThemePalette = {
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  mutedText: "#4b5563",
  primary: "#111827",
  onPrimary: "#ffffff",
  inputBackground: "#ffffff",
  drawerActiveTint: "#111827",
  drawerInactiveTint: "#4b5563",
  drawerActiveBackground: "#f3f4f6",
  bannerBackground: "#111827",
  bannerText: "#ffffff",
};

const darkPalette: ThemePalette = {
  background: "#020617",
  surface: "#0f172a",
  border: "#1e293b",
  text: "#e2e8f0",
  mutedText: "#94a3b8",
  primary: "#e2e8f0",
  onPrimary: "#0f172a",
  inputBackground: "#0b1220",
  drawerActiveTint: "#e2e8f0",
  drawerInactiveTint: "#94a3b8",
  drawerActiveBackground: "#1e293b",
  bannerBackground: "#e2e8f0",
  bannerText: "#0f172a",
};

export const resolveTheme = (
  mode: ThemeMode,
  systemScheme: ColorSchemeName
): ResolvedTheme => {
  if (mode === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }

  return mode;
};

export const getPalette = (theme: ResolvedTheme): ThemePalette => {
  return theme === "dark" ? darkPalette : lightPalette;
};

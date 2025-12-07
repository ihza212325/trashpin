import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ColorScheme = "light" | "dark" | "system";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  preference: ColorScheme;
  setPreference: (preference: ColorScheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_PREFERENCE_KEY = "@theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ColorScheme>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference from storage
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (
          saved &&
          (saved === "light" || saved === "dark" || saved === "system")
        ) {
          setPreferenceState(saved);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreference();
  }, []);

  // Save preference to storage
  const setPreference = async (newPreference: ColorScheme) => {
    try {
      setPreferenceState(newPreference);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newPreference);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Determine actual color scheme based on preference
  const colorScheme: "light" | "dark" =
    preference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  if (!isLoaded) {
    // Return system default while loading
    return (
      <ThemeContext.Provider
        value={{
          colorScheme: systemColorScheme === "dark" ? "dark" : "light",
          preference: "system",
          setPreference,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        preference,
        setPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface CurrentLocationButtonProps {
  onPress: () => void;
}

export function CurrentLocationButton({ onPress }: CurrentLocationButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(28, 28, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="locate" size={24} color={isDark ? "#fff" : "#000"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 100,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

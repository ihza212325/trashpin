import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InfoPanelProps {
  markerCount: number;
}

export function InfoPanel({ markerCount }: InfoPanelProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(28, 28, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        },
      ]}
    >
      <ThemedText type="defaultSemiBold" style={styles.text}>
        {markerCount} marker{markerCount !== 1 ? "s" : ""} visible
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 12,
    opacity: 0.8,
  },
});

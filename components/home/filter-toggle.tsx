import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FilterToggleProps {
  showOnlyUserReports: boolean;
  onToggle: () => void;
}

export function FilterToggle({
  showOnlyUserReports,
  onToggle,
}: FilterToggleProps) {
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
        showOnlyUserReports && styles.active,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Ionicons
        name={showOnlyUserReports ? "person" : "people"}
        size={18}
        color={showOnlyUserReports ? "#0a7ea4" : isDark ? "#fff" : "#000"}
      />
      <ThemedText
        style={[styles.text, showOnlyUserReports && styles.textActive]}
      >
        {showOnlyUserReports ? "My Reports" : "All Reports"}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 130,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  active: {
    borderWidth: 2,
    borderColor: "#0a7ea4",
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
  },
  textActive: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
});

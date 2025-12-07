import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StatsCardProps {
  totalReports: number;
  userReports: number;
}

export function StatsCard({ totalReports, userReports }: StatsCardProps) {
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
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Total Reports
      </ThemedText>
      <ThemedText type="title" style={styles.number}>
        {totalReports}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {userReports} your reports
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 130,
    right: 15,
    padding: 15,
    borderRadius: 12,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    opacity: 0.6,
  },
});

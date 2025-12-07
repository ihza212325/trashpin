import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export function LoadingModal({
  visible,
  message = "Loading...",
}: LoadingModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
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
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#667eea"} />
          <ThemedText style={styles.message}>{message}</ThemedText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getConfirmColor = () => {
    switch (type) {
      case "danger":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#667eea";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name={
                type === "danger"
                  ? "warning"
                  : type === "warning"
                  ? "alert-circle"
                  : "information-circle"
              }
              size={32}
              color={getConfirmColor()}
            />
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
          </View>

          <ThemedText style={styles.message}>{message}</ThemedText>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelButtonText}>
                {cancelText}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: getConfirmColor() },
              ]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.confirmButtonText}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
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
    padding: 20,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    marginTop: 12,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {},
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

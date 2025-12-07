import { useColorScheme } from "@/hooks/use-color-scheme";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/api/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { LoadingModal } from "../ui/loading-modal";

interface EditProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  }) => void;
  isLoading?: boolean;
}

export function EditProfileModal({
  visible,
  user,
  onClose,
  onSave,
  isLoading = false,
}: EditProfileModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showError, ToastComponent } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user, visible]);

  const handleSave = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !username.trim()
    ) {
      showError("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      showError("Please enter a valid email address");
      return;
    }

    onSave({ firstName, lastName, email, username });
  };

  return (
    <>
      <LoadingModal visible={isLoading} message="Saving profile..." />
      <ToastComponent />
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <ThemedView style={[styles.modalContent, { paddingBottom: bottom }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <ThemedText type="title">Edit Profile</ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  First Name
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? "#fff" : "#000",
                      borderColor: isDark ? "#444" : "#ccc",
                      backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    },
                  ]}
                  placeholder="First Name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Last Name
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? "#fff" : "#000",
                      borderColor: isDark ? "#444" : "#ccc",
                      backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    },
                  ]}
                  placeholder="Last Name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Email
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? "#fff" : "#000",
                      borderColor: isDark ? "#444" : "#ccc",
                      backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    },
                  ]}
                  placeholder="Email"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Username
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? "#fff" : "#000",
                      borderColor: isDark ? "#444" : "#ccc",
                      backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    },
                  ]}
                  placeholder="Username"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#667eea",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

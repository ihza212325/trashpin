import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { LoadingModal } from "@/components/ui/loading-modal";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/hooks/use-toast";
import {
  useCurrentUser,
  useDeleteUser,
  useLogout,
  useUpdateUser,
} from "../../lib/hooks/use-auth";

export default function ProfileScreen() {
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const { showSuccess, showError, ToastComponent } = useToast();
  const { colorScheme, preference, setPreference } = useTheme();

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    logoutMutation.mutate();
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = (data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  }) => {
    if (!user) return;

    updateUserMutation.mutate(
      {
        id: user.id,
        data,
      },
      {
        onSuccess: () => {
          setIsEditModalVisible(false);
          showSuccess("Profile updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update profile");
        },
      }
    );
  };

  const handleDeleteProfile = () => {
    if (!user) return;
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (!user) return;
    setIsDeleteModalVisible(false);
    deleteUserMutation.mutate(user.id, {
      onError: (error) => {
        showError(error.message || "Failed to delete account");
      },
    });
  };

  return (
    <>
      <LoadingModal visible={isLoading} message="Loading profile..." />
      <LoadingModal
        visible={updateUserMutation.isPending}
        message="Updating profile..."
      />
      <LoadingModal
        visible={deleteUserMutation.isPending}
        message="Deleting account..."
      />
      <LoadingModal
        visible={logoutMutation.isPending}
        message="Logging out..."
      />

      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000)}
            style={styles.headerContent}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
            <ThemedText style={styles.name}>
              {user?.firstName} {user?.lastName}
            </ThemedText>
            <ThemedText style={styles.username}>@{user?.username}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </Animated.View>
        </LinearGradient>

        <ThemedView style={styles.content}>
          <Animated.View entering={FadeInDown.delay(400).duration(1000)}>
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Account Information
              </ThemedText>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                  <View style={styles.infoContent}>
                    <ThemedText style={styles.infoLabel}>Email</ThemedText>
                    <ThemedText style={styles.infoValue}>
                      {user?.email}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color="#667eea" />
                  <View style={styles.infoContent}>
                    <ThemedText style={styles.infoLabel}>Username</ThemedText>
                    <ThemedText style={styles.infoValue}>
                      {user?.username}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons name="id-card-outline" size={20} color="#667eea" />
                  <View style={styles.infoContent}>
                    <ThemedText style={styles.infoLabel}>User ID</ThemedText>
                    <ThemedText style={styles.infoValue}>{user?.id}</ThemedText>
                  </View>
                </View>

                {user?.gender && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                      <Ionicons
                        name={
                          user.gender === "female"
                            ? "woman-outline"
                            : "man-outline"
                        }
                        size={20}
                        color="#667eea"
                      />
                      <View style={styles.infoContent}>
                        <ThemedText style={styles.infoLabel}>Gender</ThemedText>
                        <ThemedText style={styles.infoValue}>
                          {user.gender.charAt(0).toUpperCase() +
                            user.gender.slice(1)}
                        </ThemedText>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Appearance
              </ThemedText>

              <View style={styles.themeCard}>
                <View style={styles.themeRow}>
                  <View style={styles.themeContent}>
                    <Ionicons
                      name={
                        colorScheme === "dark"
                          ? "moon-outline"
                          : "sunny-outline"
                      }
                      size={24}
                      color="#667eea"
                    />
                    <View style={styles.themeInfo}>
                      <ThemedText style={styles.themeLabel}>
                        Dark Mode
                      </ThemedText>
                      <ThemedText style={styles.themeDescription}>
                        {preference === "system"
                          ? "Follow system settings"
                          : preference === "dark"
                          ? "Enabled"
                          : "Disabled"}
                      </ThemedText>
                    </View>
                  </View>
                  <Switch
                    value={preference === "dark"}
                    onValueChange={(value) => {
                      setPreference(value ? "dark" : "light");
                    }}
                    trackColor={{ false: "#e0e0e0", true: "#667eea" }}
                    thumbColor="#fff"
                    ios_backgroundColor="#e0e0e0"
                  />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => setPreference("system")}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeRow}>
                    <View style={styles.themeContent}>
                      <Ionicons
                        name="phone-portrait-outline"
                        size={24}
                        color="#667eea"
                      />
                      <View style={styles.themeInfo}>
                        <ThemedText style={styles.themeLabel}>
                          Use System Settings
                        </ThemedText>
                        <ThemedText style={styles.themeDescription}>
                          Follow device theme
                        </ThemedText>
                      </View>
                    </View>
                    {preference === "system" && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#667eea"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </ThemedView>

            <ThemedView style={styles.section}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEditProfile}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="create-outline" size={24} color="#fff" />
                  <ThemedText style={styles.actionButtonText}>
                    Edit Profile
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeleteProfile}
                disabled={deleteUserMutation.isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <ThemedText style={styles.actionButtonText}>
                    Delete Account
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={logoutMutation.isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.logoutButtonGradient}
                >
                  <Ionicons name="log-out-outline" size={24} color="#fff" />
                  <ThemedText style={styles.logoutButtonText}>
                    Logout
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </ThemedView>
          </Animated.View>
        </ThemedView>

        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={isEditModalVisible}
          user={user || null}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveProfile}
          isLoading={updateUserMutation.isPending}
        />

        {/* Confirmation Modals */}
        <ConfirmationModal
          visible={isLogoutModalVisible}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          type="info"
          onConfirm={confirmLogout}
          onCancel={() => setIsLogoutModalVisible(false)}
        />

        <ConfirmationModal
          visible={isDeleteModalVisible}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
        />

        {/* Toast */}
        <ToastComponent />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 16,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#f5576c",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonGradient: {
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  themeCard: {
    borderRadius: 16,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
    padding: 16,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  themeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  themeOption: {
    paddingVertical: 4,
  },
});

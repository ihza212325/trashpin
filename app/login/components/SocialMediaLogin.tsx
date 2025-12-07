import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SocialMediaLogin() {
  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={24} color="#DB4437" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-apple" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-facebook" size={24} color="#4267B2" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});

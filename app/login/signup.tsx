import { ThemedText } from "@/components/themed-text";
import { LoadingModal } from "@/components/ui/loading-modal";
import { useToast } from "@/hooks/use-toast";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSignup } from "../../lib/hooks/use-auth";

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const router = useRouter();

  // Signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showError, showSuccess, ToastComponent } = useToast();

  const signupMutation = useSignup();

  const handleSignup = async () => {
    // Form validation
    if (!firstName.trim()) {
      showError("Please enter your first name");
      return;
    }

    if (!lastName.trim()) {
      showError("Please enter your last name");
      return;
    }

    if (!email.trim()) {
      showError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      showError("Please enter a valid email address");
      return;
    }

    if (!username.trim()) {
      showError("Please enter a username");
      return;
    }

    if (username.length < 3) {
      showError("Username must be at least 3 characters");
      return;
    }

    if (!password.trim()) {
      showError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    // Call the signup mutation
    signupMutation.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
      },
      {
        onSuccess: () => {
          showSuccess("Account created successfully! Welcome!");
        },
        onError: (error) => {
          showError(
            error.message || "Failed to create account. Please try again."
          );
        },
      }
    );
  };

  return (
    <>
      <LoadingModal
        visible={signupMutation.isPending}
        message="Creating account..."
      />
      <ToastComponent />
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="light" />

        {/* Background Gradient */}
        <LinearGradient
          colors={["#667eea", "#764ba2", "#f093fb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Animated Background Circles */}
        <View style={styles.circleContainer}>
          <Animated.View
            entering={FadeInUp.delay(400).duration(1000)}
            style={[styles.circle, styles.circle2]}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo/Title Section */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000)}
              style={styles.headerContainer}
            >
              <View style={styles.logoContainer}>
                <Ionicons name="map" size={64} color="#fff" />
              </View>
              <ThemedText type="title">Report Maps</ThemedText>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Create your account to get started
              </ThemedText>
            </Animated.View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000)}
              style={styles.formContainer}
            >
              {/* First Name Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                />
              </View>

              {/* Last Name Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                />
              </View>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="at-outline" size={20} color="#667eea" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#667eea"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  autoCorrect={false}
                  editable={true}
                  keyboardType="default"
                  returnKeyType="next"
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="rgba(0,0,0,0.4)"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#667eea"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  autoCorrect={false}
                  editable={true}
                  keyboardType="default"
                  returnKeyType="done"
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="rgba(0,0,0,0.4)"
                  />
                </TouchableOpacity>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={signupMutation.isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signupButtonGradient}
                >
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <ThemedText style={styles.loginText}>
                  Already have an account?{" "}
                </ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText type="link" style={styles.loginLink}>
                    Login
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  circleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.1,
    backgroundColor: "#fff",
  },
  circle2: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.3,
    right: -width * 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "transparent",
    pointerEvents: "box-none",
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  signupButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonGradient: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
  },
  loginLink: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "bold",
  },
});

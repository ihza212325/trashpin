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
import { useLogin } from "../../lib/hooks/use-auth";
import SocialMediaLogin from "./components/SocialMediaLogin";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const { showError, ToastComponent } = useToast();

  const loginMutation = useLogin();

  const handleLogin = async () => {
    // Form validation
    if (!username.trim()) {
      showError("Please enter your username");
      return;
    }

    if (!password.trim()) {
      showError("Please enter your password");
      return;
    }

    // Call the login mutation
    loginMutation.mutate(
      {
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 30,
      },
      {
        onError: (error) => {
          showError(
            error.message || "Invalid username or password. Please try again."
          );
        },
      }
    );
  };

  return (
    <>
      <LoadingModal visible={loginMutation.isPending} message="Logging in..." />
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
              <ThemedText type="title" style={styles.title}>
                TrashPin
              </ThemedText>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Welcome back! Please login to continue
              </ThemedText>
            </Animated.View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000)}
              style={styles.formContainer}
            >
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
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
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="rgba(0,0,0,0.4)"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loginMutation.isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              {/* Social Login Buttons */}
              <SocialMediaLogin />

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <ThemedText style={styles.signupText}>
                  Don't have an account?{" "}
                </ThemedText>
                <TouchableOpacity onPress={() => router.push("/login/signup")}>
                  <ThemedText type="link" style={styles.signupLink}>
                    Sign Up
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
  circle1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.4,
    left: -width * 0.2,
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
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
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
  loginButtonGradient: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
  },
  signupLink: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "bold",
  },
});

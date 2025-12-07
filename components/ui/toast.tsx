import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../themed-text";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onHide?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      default:
        return "information-circle";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return isDark ? "rgba(34, 197, 94, 0.95)" : "rgba(34, 197, 94, 0.95)";
      case "error":
        return isDark ? "rgba(239, 68, 68, 0.95)" : "rgba(239, 68, 68, 0.95)";
      case "warning":
        return isDark ? "rgba(245, 158, 11, 0.95)" : "rgba(245, 158, 11, 0.95)";
      default:
        return isDark ? "rgba(28, 28, 30, 0.95)" : "rgba(255, 255, 255, 0.95)";
    }
  };

  const getIconColor = () => {
    return "#fff";
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.toast,
          {
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <Ionicons
          name={getIconName()}
          size={24}
          color={getIconColor()}
          style={styles.icon}
        />
        <ThemedText style={styles.message}>{message}</ThemedText>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={getIconColor()} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});

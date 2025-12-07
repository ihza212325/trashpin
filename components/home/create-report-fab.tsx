import { useColorScheme } from "@/hooks/use-color-scheme";
import { useToast } from "@/hooks/use-toast";
import { useReportsStore } from "@/lib/stores/reports-store";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  Camera,
  MapView,
  PointAnnotation,
} from "@maplibre/maplibre-react-native";
import { Image } from "expo-image";
import {
  launchCameraAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import mapstyle from "../../assets/mapstyle/mapstyle.json";
import mapstyleDark from "../../assets/mapstyle/mapstyleDark.json";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { LoadingModal } from "../ui/loading-modal";

interface CreateReportFabProps {
  onReportCreated?: (coordinates: [number, number]) => void;
}

export function CreateReportFab({ onReportCreated }: CreateReportFabProps) {
  const addReport = useReportsStore((state) => state.addReport);
  const { showSuccess, showError, showWarning, ToastComponent } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // BottomSheet snap points
  const snapPoints = useMemo(() => ["90%"], []);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        showError(
          "Location services are disabled. Please enable them in your device settings."
        );
        setLoadingLocation(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showWarning("Permission to access location was denied");
        setLoadingLocation(false);
        return;
      }

      // Try to get last known position first (faster)
      let location = await Location.getLastKnownPositionAsync({
        maxAge: 300000, // Use location if less than 5 minutes old
      });
      console.log(location, "ini lokasi");

      // If no recent location, get current position
      if (!location) {
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          });
        } catch (currentError: any) {
          console.error("Error getting current position:", currentError);
          // If current position fails, try again with lower accuracy
          try {
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Lowest,
              timeInterval: 10000,
            });
          } catch (lowAccuracyError) {
            console.error("Error with low accuracy:", lowAccuracyError);
            throw currentError; // Throw original error
          }
        }
      }

      setLocation(location);
    } catch (error: any) {
      console.error("Location Error:", error);
      const errorMessage = error?.message || "Unknown error";
      if (
        errorMessage.includes("location services") ||
        errorMessage.includes("unavailable")
      ) {
        showError(
          "Location services are unavailable. Please enable GPS in your device settings."
        );
      } else {
        // Final fallback: try last known position with longer maxAge
        try {
          const lastLocation = await Location.getLastKnownPositionAsync({
            maxAge: 3600000, // Use location if less than 1 hour old
          });
          if (lastLocation) {
            setLocation(lastLocation);
            showWarning("Using last known location. GPS may be unavailable.");
          } else {
            showError(
              "Unable to get your location. Please enable location services and GPS."
            );
          }
        } catch (fallbackError) {
          console.error("Fallback location error:", fallbackError);
          showError(
            "Unable to get your location. Please check your device settings."
          );
        }
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    getLocation();
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    // Reset form when closing
    setTitle("");
    setDescription("");
    setLocation(null);
    setPhotos([]);
  }, []);

  const pickImage = async () => {
    // Request permission
    const { status } = await requestCameraPermissionsAsync();
    if (status !== "granted") {
      showWarning(
        "Camera permission denied. Please enable camera access in settings."
      );
      return;
    }

    let result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleCreateReport = () => {
    if (!title || !description || !location) {
      showError("Please fill all fields and wait for location.");
      return;
    }

    const coordinates: [number, number] = [
      location.coords.longitude,
      location.coords.latitude,
    ];

    // Tambahkan report ke Zustand store
    addReport({
      coordinates,
      title,
      description,
      photos: photos,
    });

    console.log("Report saved successfully");

    showSuccess("Report submitted successfully!");

    // Reset form
    handleCloseSheet();

    // Navigate ke lokasi report baru
    onReportCreated?.(coordinates);
  };

  return (
    <>
      <LoadingModal visible={loadingLocation} message="Getting location..." />
      <ToastComponent />
      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenSheet}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create Report BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={[
          styles.bottomSheetBackground,
          { backgroundColor: isDark ? "#1c1c1e" : "#fff" },
        ]}
        handleIndicatorStyle={[
          styles.bottomSheetIndicator,
          { backgroundColor: isDark ? "#48484a" : "#ccc" },
        ]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <ThemedView style={styles.bottomSheetContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText type="title">New Report</ThemedText>
            <TouchableOpacity
              onPress={handleCloseSheet}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <BottomSheetScrollView style={styles.formContainer}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Title
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
                placeholder="What happened?"
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Description
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    color: isDark ? "#fff" : "#000",
                    borderColor: isDark ? "#444" : "#ccc",
                    backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                  },
                ]}
                placeholder="Describe the details..."
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Location Display */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Location
              </ThemedText>
              <View
                style={[
                  styles.locationContainer,
                  {
                    backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    borderColor: isDark ? "#444" : "#ccc",
                    overflow: "hidden",
                    padding: 0,
                  },
                ]}
              >
                {location ? (
                  <View style={{ width: "100%", height: 150 }}>
                    <MapView
                      style={{ flex: 1 }}
                      mapStyle={isDark ? mapstyleDark : mapstyle}
                      scrollEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      zoomEnabled={false}
                      attributionEnabled={false}
                    >
                      <Camera
                        defaultSettings={{
                          centerCoordinate: [
                            location.coords.longitude,
                            location.coords.latitude,
                          ],
                          zoomLevel: 14,
                        }}
                      />
                      <PointAnnotation
                        id="current-location"
                        coordinate={[
                          location.coords.longitude,
                          location.coords.latitude,
                        ]}
                      >
                        <View style={styles.marker} />
                      </PointAnnotation>
                    </MapView>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={getLocation}
                    >
                      <Ionicons name="refresh" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={getLocation}
                    style={styles.retryContainer}
                  >
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color="#0a7ea4"
                    />
                    <ThemedText style={{ color: "#0a7ea4", marginTop: 5 }}>
                      Tap to get location
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Photos Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Photos
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photosScroll}
              >
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={[
                    styles.photoPlaceholder,
                    {
                      borderColor: isDark ? "#444" : "#ccc",
                      backgroundColor: isDark ? "#2c2c2e" : "#f9f9f9",
                    },
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons
                    name="camera-outline"
                    size={30}
                    color={isDark ? "#888" : "#999"}
                  />
                  <ThemedText
                    style={{
                      color: isDark ? "#888" : "#999",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    Add Photo
                  </ThemedText>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!location || loadingLocation) && styles.disabledButton,
              ]}
              onPress={handleCreateReport}
              disabled={!location || loadingLocation}
            >
              <ThemedText style={styles.submitButtonText}>
                Submit Report
              </ThemedText>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </ThemedView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 0,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetIndicator: {
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
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
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  locationContainer: {
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  retryContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0a7ea4",
    borderWidth: 2,
    borderColor: "#fff",
  },
  retryButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  photosScroll: {
    flexDirection: "row",
  },
  photoContainer: {
    position: "relative",
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 100,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import {
  FilterToggle,
  InfoPanel,
  SearchBar,
  StatsCard,
} from "@/components/home";
import { CreateReportFab } from "@/components/home/create-report-fab";
import {
  MarkerBottomSheet,
  MarkerBottomSheetRef,
} from "@/components/home/marker-bottom-sheet";
import { useToast } from "@/hooks/use-toast";
import { useReportsStore, type MarkerData } from "@/lib/stores/reports-store";
import { Ionicons } from "@expo/vector-icons";
import {
  Camera,
  MapView,
  PointAnnotation,
} from "@maplibre/maplibre-react-native";
import {
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import markersData from "../../assets/data/markers.json";
import mapstyle from "../../assets/mapstyle/mapstyle.json";
import mapstyleDark from "../../assets/mapstyle/mapstyleDark.json";

const defaultMarkers = markersData as MarkerData[];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bottomSheetRef = useRef<MarkerBottomSheetRef>(null);
  const userReports = useReportsStore((state) => state.userReports);
  const { showError, showWarning, ToastComponent } = useToast();

  // State untuk filter dan search
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUserReports, setShowOnlyUserReports] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Map style yang reactive terhadap colorScheme
  const mapStyle = useMemo<"light" | "dark">(
    () => (isDark ? "dark" : "light"),
    [isDark]
  );

  // Request location permissions on mount
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await getForegroundPermissionsAsync();
        if (status === "granted") {
          setHasLocationPermission(true);
        } else {
          // Try to request permission
          const { status: requestStatus } =
            await requestForegroundPermissionsAsync();
          setHasLocationPermission(requestStatus === "granted");
        }
      } catch (error) {
        console.error("Error checking location permission:", error);
        setHasLocationPermission(false);
      }
    };

    checkLocationPermission();
  }, []);

  // Gabungkan data JSON dengan data dari Zustand store
  const allMarkers = useMemo(
    () => [...defaultMarkers, ...userReports],
    [userReports]
  );

  // Filter markers berdasarkan search dan filter
  const markers = useMemo(() => {
    let filtered = showOnlyUserReports ? userReports : allMarkers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (marker) =>
          marker.title.toLowerCase().includes(query) ||
          marker.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allMarkers, userReports, showOnlyUserReports, searchQuery]);

  // State untuk mengontrol kamera
  const [cameraSettings, setCameraSettings] = useState({
    centerCoordinate: [106.8456, -6.2088], // Center of Jakarta
    zoomLevel: 10, // Zoom level for city view
    animationDuration: 0,
  });

  const handleMarkerPress = (marker: MarkerData) => {
    // Open bottom sheet
    bottomSheetRef.current?.open(marker);

    // Update state kamera untuk memicu animasi pindah
    setCameraSettings({
      centerCoordinate: marker.coordinates,
      zoomLevel: 15,
      animationDuration: 1000,
    });
  };

  const handleReportCreated = (coordinates: [number, number]) => {
    // Navigate ke lokasi report baru
    setCameraSettings({
      centerCoordinate: coordinates,
      zoomLevel: 15,
      animationDuration: 1000,
    });

    // Cari marker yang baru dibuat dan buka bottom sheet
    const matchingMarkers = userReports.filter(
      (m) =>
        Math.abs(m.coordinates[0] - coordinates[0]) < 0.0001 &&
        Math.abs(m.coordinates[1] - coordinates[1]) < 0.0001
    );

    const newMarker =
      matchingMarkers.length > 0
        ? matchingMarkers.sort((a, b) => b.id - a.id)[0]
        : null;

    if (newMarker) {
      setTimeout(() => {
        bottomSheetRef.current?.open(newMarker);
      }, 500);
    }
  };

  const handleCurrentLocation = async () => {
    try {
      // Request location permissions
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showError("Permission to access location was denied");
        setHasLocationPermission(false);
        return;
      }

      setHasLocationPermission(true);

      // Get current location
      let location = await getCurrentPositionAsync({});

      // Update camera to center on current location
      setCameraSettings({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    } catch (error) {
      showError("Failed to get current location");
      console.error("Error getting location:", error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <MapView
        key={mapStyle} // Force re-render when mapStyle changes
        style={styles.map}
        mapStyle={mapStyle === "dark" ? mapstyleDark : mapstyle}
        attributionEnabled={false}
        // compassEnabled={true}
      >
        {/* {hasLocationPermission && (
          <UserLocation
            onUpdate={(res) => {
              console.log(res);
            }}
            renderMode="normal"
            visible={true}
          />
        )} */}
        <Camera
          centerCoordinate={cameraSettings.centerCoordinate}
          zoomLevel={cameraSettings.zoomLevel}
          animationDuration={cameraSettings.animationDuration}
        />
        {markers.map((marker) => (
          <PointAnnotation
            key={marker.id}
            id={`marker-${marker.id}`}
            coordinate={marker.coordinates}
            onSelected={() => handleMarkerPress(marker)}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="trash" size={20} color="#FF5733" />
            </View>
          </PointAnnotation>
        ))}
      </MapView>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={clearSearch}
      />

      {/* Stats Card */}
      <StatsCard
        totalReports={markers.length}
        userReports={userReports.length}
      />

      {/* Filter Toggle */}
      <FilterToggle
        showOnlyUserReports={showOnlyUserReports}
        onToggle={() => setShowOnlyUserReports(!showOnlyUserReports)}
      />

      {/* Current Location Button */}
      {/* <CurrentLocationButton onPress={handleCurrentLocation} /> */}

      {/* Info Panel */}
      <InfoPanel markerCount={markers.length} />

      {/* FAB Create Report */}
      <CreateReportFab onReportCreated={handleReportCreated} />

      {/* Marker Details BottomSheet */}
      <MarkerBottomSheet ref={bottomSheetRef} />

      {/* Toast */}
      <ToastComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
  },
});

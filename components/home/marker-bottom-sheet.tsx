import { useColorScheme } from "@/hooks/use-color-scheme";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface MarkerData {
  id: number;
  coordinates: [number, number];
  title: string;
  description: string;
  photos: string[];
}

export interface MarkerBottomSheetRef {
  open: (marker: MarkerData) => void;
  close: () => void;
}

export const MarkerBottomSheet = forwardRef<MarkerBottomSheetRef, {}>(
  (props, ref) => {
    const [selectedMarker, setSelectedMarker] =
      React.useState<MarkerData | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const colorScheme = useColorScheme();

    const isDark = colorScheme === "dark";

    // BottomSheet snap points
    const snapPoints = useMemo(() => ["20%", "50%"], []);

    useImperativeHandle(ref, () => ({
      open: (marker: MarkerData) => {
        setSelectedMarker(marker);
        // bottomSheetRef.current?.close();
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        bottomSheetRef.current?.close();
        setSelectedMarker(null);
      },
    }));

    const handleSheetClose = useCallback(() => {
      bottomSheetRef.current?.close();
      setSelectedMarker(null);
    }, []);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
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
      >
        {selectedMarker && (
          <BottomSheetScrollView style={styles.bottomSheetContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                {selectedMarker.title}
              </ThemedText>
              <TouchableOpacity
                onPress={handleSheetClose}
                style={styles.closeButton}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.description}>
              {selectedMarker.description}
            </ThemedText>

            <ThemedText type="subtitle" style={styles.photosTitle}>
              Photos
            </ThemedText>

            <BottomSheetScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosContainer}
            >
              {selectedMarker.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.photo}
                  contentFit="cover"
                />
              ))}
            </BottomSheetScrollView>

            <View style={styles.infoSection}>
              <ThemedText type="defaultSemiBold">Coordinates</ThemedText>
              <ThemedText style={styles.infoText}>
                Lat: {selectedMarker.coordinates[1].toFixed(4)}, Lng:{" "}
                {selectedMarker.coordinates[0].toFixed(4)}
              </ThemedText>
            </View>
          </BottomSheetScrollView>
        )}
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetIndicator: {
    width: 40,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  photosTitle: {
    marginBottom: 10,
    fontSize: 18,
    paddingHorizontal: 4,
  },
  photosContainer: {
    marginBottom: 20,
  },
  photo: {
    width: 250,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  infoSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  infoText: {
    marginTop: 5,
    opacity: 0.7,
  },
});

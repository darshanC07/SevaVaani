import { Stack, useRouter } from "expo-router";
import * as Location from "expo-location";
import { Alert, Platform } from "react-native";
import '../i18n';
import "../tasks/LocationTask";
import { getUserId } from "../utils/AsyncStorageUtils";
import { GlobalStatesProvider } from "../contexts/GlobalContext";

const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

export async function checkAndRequestLocationPermission() {
  console.log("Requesting location permissions...");
  const fg = await Location.requestForegroundPermissionsAsync();
  if (!fg.granted) {
    console.log("Foreground location permission denied");
    Alert.alert(
      "Location Permission Required",
      "Please allow location access to use live tracking features.",
      [{ text: "OK" }]
    );
    return;
  }

  const bg = await Location.requestBackgroundPermissionsAsync();
  if (!bg.granted) {
    console.log(
      "Please allow background location from Settings for live tracking."
    );
    Alert.alert(
      "Background Location Permission Required",
      "Please allow background location access from Settings to use live tracking features.",
      [{ text: "OK" }]
    );
    return;
  }
  console.log("Location permissions granted");
}


// this is for background location update in db
export const startBackgroundLocation = async () => {
  await checkAndRequestLocationPermission();

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK
  );
  console.log("Has location tracking started:", hasStarted);
  if (hasStarted) {
    stopBackgroundLocation();
  };

  console.log("Starting background location tracking...");

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 120000,
    distanceInterval: 10,
    pausesUpdatesAutomatically: false,
    activityType:
      Platform.OS === "android"
        ? Location.LocationActivityType.OtherNavigation
        : undefined,
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Tracking your location in background",
    },
  });

  console.log("Background location tracking started");
};

const stopBackgroundLocation = async () => {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK
  );
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    console.log("Background location tracking stopped");
  }
};


export default function Layout() {
  return (
    <GlobalStatesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="OnBoarding1" options={{ headerShown: false }} />
        <Stack.Screen name="OnBoarding2" options={{ headerShown: false }} />
        <Stack.Screen name="OnBoarding3" options={{ headerShown: false }} />
        <Stack.Screen name="temp" options={{ headerShown: false }} />
        <Stack.Screen
          name="registration"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="worker"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="call"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
      </Stack>
    </GlobalStatesProvider>
  );
}

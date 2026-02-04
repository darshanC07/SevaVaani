import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UpdateWorkerLoc } from "../services/GlobalAPIs";


const WORKER_ID = "darshan";

const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async (task: any) => {
  const { data, error } = task;
  if (error) {
    console.error("Location task error:", error);
    return;
  }

  if (!data || !data.locations || data.locations.length === 0) {
    return;
  }

  const { latitude, longitude } = data.locations[0].coords;

  try {
    UpdateWorkerLoc(WORKER_ID, latitude, longitude).then((res) => {
      console.log("Location updated successfully:", res);
    }).catch((err) => {
      console.error("Error updating location:", err);
    });
  } catch (err) {
    console.error("Failed to send location:", err);
  }
});

export default function Index() {
  // const fetchUser = async () => {
  //   const user = await AsyncStorage.getItem("uid");
  //   return user;
  // };

  // useEffect(() => {
  //   const user = fetchUser();
  //   if (user) {
  //     startBackgroundLocation();
  //   } else {
  //     stopBackgroundLocation();
  //   }

  //   return () => {
  //     stopBackgroundLocation();
  //   };
  // }, []);

  // const startBackgroundLocation = async () => {
  //   const fg = await Location.requestForegroundPermissionsAsync();
  //   if (!fg.granted) {
  //     console.log("Foreground location permission denied");
  //     return;
  //   }

  //   const bg = await Location.requestBackgroundPermissionsAsync();
  //   if (!bg.granted) {
  //     console.log("Background location permission denied");
  //     return;
  //   }

  //   const hasStarted = await Location.hasStartedLocationUpdatesAsync(
  //     LOCATION_TASK
  //   );
  //   if (hasStarted) return;

  //   await Location.startLocationUpdatesAsync(LOCATION_TASK, {
  //     accuracy: Location.Accuracy.High,
  //     timeInterval: 5000,
  //     distanceInterval: 10,
  //     pausesUpdatesAutomatically: false,
  //     activityType:
  //       Platform.OS === "android"
  //         ? Location.LocationActivityType.OtherNavigation
  //         : undefined,
  //     foregroundService: {
  //       notificationTitle: "Location Tracking",
  //       notificationBody: "Tracking your location in background",
  //     },
  //   });

  //   console.log("Background location tracking started");
  // };

  // const stopBackgroundLocation = async () => {
  //   const hasStarted = await Location.hasStartedLocationUpdatesAsync(
  //     LOCATION_TASK
  //   );
  //   if (hasStarted) {
  //     await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  //     console.log("Background location tracking stopped");
  //   }
  // };

  return <Redirect href="/worker/Profile" />;
}

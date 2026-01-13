import { Redirect } from "expo-router";
import { useState, useEffect, use } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
export default function Index() {
  const BASE_URL = "https://30vkdstn-5000.inc1.devtunnels.ms/";
  useEffect(() => {
    requestLocationPermission();
    updateForeground();
    Notification();
    // startTracking();
    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);
  let watchId: number | null = null;
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
      }
      const backgroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "Background Location Permission",
          message: "We need access to your location for background tracking.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Background location permission granted");
      } else {
        console.log("Background location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const updateForeground = () => {
    ReactNativeForegroundService.add_task(() => startTracking(), {
      delay: 100,
      onLoop: true,
      taskId: "taskid",
      onError: (e) => console.log(`Error logging:`, e),

    });
  };
  const Notification = () => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: "Location Tracking",
      message: "Location Tracking",
      icon: "ic_launcher",
      button: false,
      button2: false,
      setOnlyAlertOnce: "true",
      color: "#000000",
    });
  };

  const startTracking = async () => {
    watchId = Geolocation.watchPosition(
      async (position) => {
        let x = [position.coords.longitude, position.coords.latitude];
        console.warn("darshan", Platform.OS, x[1], x[0]);
        let res = await fetch(BASE_URL + "/update_loc/worker/darshan", {
          method: "POST",
          body: JSON.stringify({
            lat: x[1],
            long: x[0],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json();

        console.log(
          responseData["message"]
            ? responseData["message"]
            : responseData["error"]
        );
      },
      (error) => {
        console.log("maperror in getting location", error.code, error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 0 }
    );
  };
  
  return <Redirect href="/registration/EmailScreen" />;
  // return <Redirect href="/worker" />;
  // return <Redirect href="/AppWriteOTP" />;
}

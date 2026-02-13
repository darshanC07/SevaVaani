import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ConfirmRequest = () => {
  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.replace("/worker");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView
      style={{
        height,
        backgroundColor: "#FFF9F6",
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Request sent Successfully</Text>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryText}>View Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/worker")}
        >
          <Text style={styles.primaryText}>Home Page</Text>
        </TouchableOpacity>

        {/* Redirect Text */}
        <Text style={styles.redirectText}>
          Redirecting to Home Page in {seconds}s
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  checkCircle: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  check: {
    fontSize: 60,
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center",
  },

  primaryBtn: {
    width: "80%",
    backgroundColor: "#4F63FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  primaryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  redirectText: {
    marginTop: 80,
    fontSize: 16,
    color: "#444",
  },
});
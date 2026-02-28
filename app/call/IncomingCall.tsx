import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { useRouter, useSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const IncomingCallScreen: React.FC = () => {
  const router = useRouter();
  const { name: callerName } = useSearchParams();
  const ringtone = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/ringtone.mp3"),
          { shouldPlay: true, isLooping: true, volume: 1 }
        );
        ringtone.current = sound;
      } catch (e) {
        console.warn("failed to load ringtone", e);
      }
    })();

    return () => {
      if (ringtone.current) {
        ringtone.current.stopAsync().catch(() => {});
        ringtone.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const stopTone = async () => {
    if (ringtone.current) {
      await ringtone.current.stopAsync();
    }
  };

  const onAccept = async () => {
    await stopTone();
    router.push("/worker/CallScreen");
  };

  const onReject = async () => {
    await stopTone();
    Alert.alert("Call ended", undefined, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incoming Call</Text>
        <Text style={styles.caller}>{callerName ?? "Unknown"}</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.accept]}
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.reject]}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#bbb",
    marginBottom: 8,
  },
  caller: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
  },
  avatarContainer: {
    flex: 1,
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingBottom: Platform.select({ ios: 40, android: 20 }),
  },
  button: {
    width: 140,
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  accept: {
    backgroundColor: "#4CAF50",
  },
  reject: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
});

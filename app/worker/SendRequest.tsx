import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SendRequest = () => {
    const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  return (
    <SafeAreaView
      style={{
        height,
        backgroundColor: "#FFF9F6",
        flex: 1,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Send Job request</Text>
        <View style={styles.employerCard}>
          <Text style={styles.sectionHeading}>Employer Information</Text>
          <View style={styles.employerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RS</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Rajesh Singh</Text>
              <Text style={styles.jobs}>• 8 Jobs Posted</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>4.3</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.callText}>📞 Call User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.msgBtn}>
              <Text style={styles.msgText}>💬 Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Job Details</Text>
          {[
            ["Service", "Plumbing"],
            ["Job", "Bathroom pipe leak repair"],
            ["Duration", "4 Hrs"],
            ["Location", "Baner"],
            ["Budget Range", "₹300-₹500"],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Client Message</Text>
          <View style={styles.messageBox}>
            <Text>Need urgent plumbing work for bathroom leak</Text>
          </View>
          <View style={styles.voiceBox}>
            <Text>
              Voice message available{"\n"}
              Tap to listen to client’s description
            </Text>
            <View style={styles.playBtn}>
              <Text style={{ color: "white", fontWeight: "bold" }}>▶</Text>
            </View>
          </View>
        </View>
        <Text style={styles.posted}>Posted 10 mins ago</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Enter Your Price</Text>
            <View style={styles.inputBox}>
              <Text>₹300</Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Estimated Time</Text>
            <View style={styles.inputBoxRow}>
              <Text>1</Text>
              <Text style={{ marginLeft: 6 }}>h</Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Message (optional)</Text>
            <TextInput style={styles.textInput} />
          </View>
        </View>
      
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backText}>Go back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => router.push("/ConfirmRequest")}
          >
              <Text style={styles.sendText}>Send Request</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendRequest;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "500",
    margin: 20,
  },

  employerCard: {
    backgroundColor: "#E4E7FF",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000",
  },

  sectionHeading: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },

  employerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "#2F4BE3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "white",
    fontWeight: "bold",
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
  },

  jobs: {
    fontSize: 12,
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    color: "#FFD700",
    fontSize: 18,
  },

  rating: {
    fontSize: 16,
    marginLeft: 4,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },

  callBtn: {
    flex: 1,
    backgroundColor: "#4560F4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  callText: {
    color: "white",
    fontWeight: "500",
  },

  msgBtn: {
    flex: 1,
    backgroundColor: "#9FD0DC",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  msgText: {
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#F4F6FF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 15,
    fontWeight: "500",
  },

  messageBox: {
    backgroundColor: "#9FD0DC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  voiceBox: {
    backgroundColor: "#9FD0DC",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  playBtn: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
  },

  posted: {
    textAlign: "center",
    marginTop: 10,
  },

  inputRow: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 15,
    marginBottom: 6,
  },

  inputBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },

  inputBoxRow: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
  },

  textInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },

  footer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },

  backBtn: {
    flex: 1,
    backgroundColor: "#9FD0DC",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  backText: {
    fontSize: 16,
    color: "white",
  },

  sendBtn: {
    flex: 1,
    backgroundColor: "#4F63FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  sendText: {
    fontSize: 16,
    color: "white",
  },
});
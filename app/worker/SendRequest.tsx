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
  Alert,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { timeAgo } from "@/components/WorkerJobCard";
import { callUser, fetchClientDetails } from "@/services/GlobalAPIs";
import { getUserId, getUserName } from "@/utils/AsyncStorageUtils";

const SendRequest = () => {
  const { jobData } = useLocalSearchParams();
  const [workerId, setWorkerId] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [client, setClient] = useState({
    name: "User",
    jobs_count: 0
  });
  const job = jobData ? JSON.parse(jobData) : {};
  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  useEffect(() => {
    console.log("Received job data in SendRequest:", job);
  }, []);

  async function getUserDetails(uid) {
    try {
      console.log("Fetching details for user ID:", uid);
      const clientData = await fetchClientDetails(uid);
      console.log("Client details response:", clientData);
      setClient(clientData.client);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  const handleCall = async () => {
    const clientId = job?.user_id;
    const response = await callUser(workerId, workerName, clientId);
    console.log("Call User Response:", response);

    if (response["code"] == -1) {
      Alert.alert('User offline', 'The recipient is offline, please try again after some time', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    } else {
      router.push({
        pathname: '/call/CallingScreen',
        params: {
          callee_uid: clientId,
          callee_name: client?.name || "Client"
        }
      });
    }
  }

  useEffect(() => {
    const startFunction = async () => {
      if (job && job.user_id) {
        console.log("Job data received in SendRequest:", job);
        getUserDetails(job.user_id);
        const userId = await getUserId();
        if (userId) {
          setWorkerId(userId);
          const userName = await getUserName();
          setWorkerName(userName || '');
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      }
    }
    startFunction();
  }, []);

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
              <Text style={styles.avatarText}>{client?.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{client?.name}</Text>
              {client?.jobs_count === 0 ? <Text style={styles.jobs}>No Jobs Posted</Text> : <Text style={styles.jobs}>• {client?.jobs_count} Jobs Posted</Text>}
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>4.3</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
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
            ["Service", job.service_type],
            ["Job", job.job_details],
            ["Description", job.description],
            ["Duration", job.duration],
            ["Location", job.location],
            ["Budget Range", "₹" + job.budget_min + "-₹" + job.budget_max],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              {label === "Description" ? <Text style={{
                fontSize: 15,
                fontWeight: "500",
                width: 200,
                textAlign: 'right'
              }}>{value}</Text> : <Text style={styles.value}>{value}</Text>}
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
        <Text style={styles.posted}>Posted {timeAgo(job.posted_at)}</Text>
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Go back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => router.push("/worker/ConfirmRequest")}
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
    fontWeight: '500'
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
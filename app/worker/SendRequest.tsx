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
  KeyboardAvoidingView
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { timeAgo } from "@/components/WorkerJobCard";
import { callUser, fetchClientDetails, sendAcceptJobRequest, sendProposal } from "@/services/GlobalAPIs";
import { getDataAvailableStatus, getOfflineData, getUserId, getUserName, setDataAvailableStatus, setOfflineData } from "@/utils/AsyncStorageUtils";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { useTranslation } from "react-i18next";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import CompletionQRModal from "../../components/CompletionQRModal";

const SendRequest = () => {
  const { jobData } = useLocalSearchParams();
  const [workerId, setWorkerId] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [client, setClient] = useState({
    name: "User",
    jobs_count: 0
  });

  // Handle jobData potentially being string | string[]
  const jobStr = Array.isArray(jobData) ? jobData[0] : jobData;
  const job = jobStr ? JSON.parse(jobStr) : {};

  const [toSendRequest, setToSendRequest] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [time, setTime] = useState(0);
  const [selectedTime, setSelectedTime] = useState("Hours");
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");

  const [isSuccessModal, setSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase();

  const contextObj = useContext(GlobalStatesContext);

  useEffect(() => {
    console.log("Received job data in SendRequest:", job);
  }, []);

  async function getUserDetails(uid: string, lang: string) {
    try {
      console.log("Fetching details for user ID:", uid);
      const clientData = await fetchClientDetails(uid, lang);
      console.log("Client details response:", clientData);
      setClient(clientData.client);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }


  const handleSendProposal = async () => {
    try {
      if (price === 0 || time === 0) {
        Alert.alert("Invalid input", "Please enter a valid price and time estimate for your proposal.", [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ]);
        return;
      }

      if (contextObj.isOnline) {
        const res = await sendProposal(
          workerId, workerName, job.job_id,
          {
            price: price,
            time_estimate: time,
            time_format: selectedTime,
            message: message
          });
        if (res) {
          setSuccessMsg("Your proposal is sent successfully.");
          setSuccessModal(true);
        } else {
          console.error("Failed to send proposal:", res);
          setErrorMsg("Failed to send your proposal. Please try again after sometime.");
          setShowErrorAlert(true);
        }
      } else {
        const earliarDataAvailableStatus = await getDataAvailableStatus();
        await setDataAvailableStatus(true);
        let offlineData;
        if (earliarDataAvailableStatus) {
          offlineData = await getOfflineData();
          offlineData = offlineData ? JSON.parse(offlineData) : {
            newProfileData: 0,
            newAcceptanceRequests: 0,
            newProposals: 0,
            newChats: 0,
            acceptanceRequests: [],
            proposals: [],
            chats: []
          };
        } else {
          offlineData = {
            newProfileData: 0,
            newAcceptanceRequests: 0,
            newProposals: 0,
            newChats: 0,
            acceptanceRequests: [],
            proposals: [],
            chats: []
          };
        }
        offlineData.newProposals = 1;
        offlineData.proposals.push({
          workerId: workerId,
          workerName: workerName,
          jobId: job.job_id,
          proposal: {
            price: price,
            time_estimate: time,
            time_format: selectedTime,
            message: message
          }
        })
        await setOfflineData(JSON.stringify(offlineData));
        setSuccessMsg("Your proposal is saved offline. It will be sent automatically when you are online.");
        setSuccessModal(true);
      };
    } catch (error) {
      console.error("Error sending proposal:", error);
      setShowErrorAlert(true);
    }
    // router.push("/worker/ConfirmRequest")
  }

  const handleAcceptJobReq = async () => {
    try {
      if (contextObj.isOnline) {
        const res = await sendAcceptJobRequest(workerId, workerName, job.job_id);
        if (res) {
          setSuccessMsg("Your request to accept job is sent successfully.");
          setSuccessModal(true);
        } else {
          console.error("Failed to send acceptance request:", res);
          setErrorMsg("Failed to send acceptance request. Please try again after sometime.");
          setShowErrorAlert(true);
        }
      } else {
        const earliarDataAvailableStatus = await getDataAvailableStatus();
        await setDataAvailableStatus(true);
        let offlineData;
        if (earliarDataAvailableStatus) {
          offlineData = await getOfflineData();
          offlineData = offlineData ? JSON.parse(offlineData) : {
            newProfileData: 0,
            newAcceptanceRequests: 0,
            newProposals: 0,
            newChats: 0,
            acceptanceRequests: [],
            proposals: [],
            chats: []
          };
        } else {
          offlineData = {
            newProfileData: 0,
            newAcceptanceRequests: 0,
            newProposals: 0,
            newChats: 0,
            acceptanceRequests: [],
            proposals: [],
            chats: []
          };
        }
        offlineData.newAcceptanceRequests = 1;
        offlineData.acceptanceRequests.push({
          workerId: workerId,
          workerName: workerName,
          jobId: job.job_id,
        })
        await setOfflineData(JSON.stringify(offlineData));
        setSuccessMsg("Your request to accept job is saved offline. It will be sent automatically when you are online.");
        setSuccessModal(true);
      };
    } catch (error) {
      console.error(`Error sending acceptance req for status : ${contextObj.isOnline}:`, error);
      setShowErrorAlert(true);
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
        getUserDetails(job.user_id, currentLanguage);
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
  }, [currentLanguage]);


  return (
    <SafeAreaView
      style={{
        height,
        backgroundColor: "#FFF9F6",
        flex: 1,
      }}
    >
      <NavBar />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
          <Text style={styles.title}>{job.showCompleteOption ? "My Job" : "Send Job request"}</Text>
          <View style={styles.employerCard}>
            <Text style={styles.sectionHeading}>Employer Information</Text>
            <View style={styles.employerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{client?.name ? client?.name[0] : 'U'}</Text>
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
              <TouchableOpacity style={styles.msgBtn} onPress={() => {
                router.push({
                  pathname: '/worker/ChatScreen',
                  params: { clientId: job?.user_id, clientName: client?.name }
                });
              }}>
                <Text style={styles.msgText}>💬 Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, justifyContent: 'space-between', marginBottom: 10, }}>
              <Text style={styles.cardTitle}>Job Details</Text>
              <Text style={styles.posted}>Posted {timeAgo(job.posted_at)}</Text>
            </View>

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
          {
            !toSendRequest && (
              <View style={styles.footer}>
                {job.showCompleteOption ? (
                  <TouchableOpacity 
                    style={[styles.acceptBtn, { backgroundColor: '#4560F4' }]} 
                    onPress={() => setIsQRModalVisible(true)}
                  >
                    <Text style={styles.acceptText}>Complete</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptJobReq}>
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sendBtn}
                      onPress={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                        setToSendRequest(true);
                      }}
                    >
                      <Text style={styles.sendText}>Send Request</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )
          }

          {
            toSendRequest && (
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { marginBottom: 10, textAlign: 'center' }]}>Your Proposal</Text>

                <View style={styles.horizontalLine} />
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Enter Your Price</Text>
                  <TextInput style={styles.textInput} keyboardType="number-pad" value={price ? price.toString() : ''} onChangeText={(e) => setPrice(parseInt(e) || 0)} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Estimated Time</Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TextInput style={[styles.textInput, {
                      width: '72%'
                    }]}
                      value={time ? time.toString() + " " + selectedTime : ''}
                      onChangeText={(e) => setTime(parseInt(e) || 0)}
                      keyboardType="number-pad" />
                    <TouchableOpacity style={{ width: 40, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectedTime("Days")}><Text>Day</Text></TouchableOpacity>
                    <TouchableOpacity style={{ width: 40, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectedTime("Hours")}><Text>Hrs</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Message (optional)</Text>
                  <TextInput style={styles.textInput} value={message} onChangeText={setMessage} />
                </View>
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={handleSendProposal}
                >
                  <Text style={styles.sendText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )
          }
          <View style={{ height: 40 }} />
        </ScrollView>
        <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message={successMsg} handleOk={() => setSuccessModal(false)} />
        <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Error" message={errorMsg} />
      </KeyboardAvoidingView>
      <CompletionQRModal 
        isVisible={isQRModalVisible} 
        onClose={() => setIsQRModalVisible(false)}
        workerId={workerId}
        workerName={workerName}
      />
      <BottomNavBar />
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
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "grey",
    marginBottom: 10,
    alignSelf: "center",
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
    marginBottom: 5
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
    fontWeight: '400',
    fontSize: 13,
    color: 'grey'
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
    color: "black",
  },

  footer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: "#0ca45b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  acceptText: {
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
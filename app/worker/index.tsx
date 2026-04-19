import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Platform,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
import { setStatusBarTranslucent } from "expo-status-bar";
import BottomNavBar from "../../components/BottomNavBar";
import WorkerJobCard from "../../components/WorkerJobCard";
import { getDataAvailableStatus, getOfflineData, getUserId, setDataAvailableStatus } from "../../utils/AsyncStorageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllJobs, sendAcceptJobRequest, sendMessage, sendProposal, syncData } from "@/services/GlobalAPIs";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import { useTranslation } from "react-i18next";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { LoaderKitView } from "react-native-loader-kit";
const index = () => {
  console.log("HOME SCREEN RENDERED");
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase();
  console.log("Current language:", currentLanguage);

  const [showProcessingSyncData, setShowProcessingSyncData] = useState(false);

  const contextObj = useContext(GlobalStatesContext)
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [isSuccessModal, setSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [user, setUser] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');

  const [isJobDataLoading, setIsJobDataLoading] = useState(false);

  const prevOnlineStatus = useRef(false);
  const isSyncingRef = useRef(false);

  const slideAnim = useRef(new Animated.Value(0)).current;


  const [showLoading, setShowLoading] = useState(false);

  const toggleStatus = () => {
    Animated.timing(slideAnim, {
      toValue: contextObj.isOnline ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    contextObj.setIsOnline(!contextObj.isOnline);
  };

  const iconTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 75],
  });

  const textTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  async function getJobs(lang) {
    setIsJobDataLoading(true);
    try {
      if(contextObj.jobs?.[lang]) {
        console.log("Jobs already fetched for language:", lang);
        setIsJobDataLoading(false);
        return;
      }

      const data = await fetchAllJobs(lang);
      console.log("Raw job data response:", data);
      if (data.code === 1) {
        let existingJobs = contextObj.jobs || {};
        existingJobs[lang] = data.jobs;
        contextObj.setJobs({ ...existingJobs });
        setJobsData(data.jobs);
      } else {
        console.error("Failed to fetch job data - data.length:", data.jobs.length);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setIsJobDataLoading(false);
    }
  }


  useEffect(() => {
    if (!contextObj.isIemodelLoaded) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [contextObj.isIemodelLoaded])

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      console.log("Fetched User ID:", userId);
      if (!userId) {
        router.replace("/login");
      }
      const uname = await AsyncStorage.getItem("name");
      const uemail = await AsyncStorage.getItem("email");
      setUser(userId);
      setName(uname);
      setEmail(uemail);
      // getJobs(currentLanguage);
    }
    fetchUserId();
  }, [])

  // useEffect(() => {
  //   console.log("fetching jobs ", performance.now());
  //   const lang = currentLanguage.toLocaleLowerCase();
  //   if (fetchedJobsLanguages.has(lang)) {
  //     console.log("Skipping fetch — already fetched for:", lang);
  //     return;
  //   }
  //   fetchedJobsLanguages.add(lang);
  //   hasFetchedJobsRef.current = true;
  //   lastJobsLangRef.current = lang;
  //   getJobs(lang);
  // }, [currentLanguage])

  // useEffect(() => {
  //   if(previousLanguage.current !== currentLanguage) {
  //     getJobs(currentLanguage.toLocaleLowerCase());
  //     previousLanguage.current = currentLanguage;
  //   }
  // },[currentLanguage])

  useEffect(() => {
    getJobs(currentLanguage.toLocaleLowerCase());
  }, [currentLanguage])

  useEffect(() => {
    if (!contextObj.isOnline) return;
    // if (hasSyncedRef.current) return;

    // hasSyncedRef.current = true;

    async function handleSyncingData() {
      setShowProcessingSyncData(true);
      isSyncingRef.current = false;
      prevOnlineStatus.current = false;
      try {
        const isDataAvailable = await getDataAvailableStatus();
        if (!isDataAvailable) return;

        let offlineData = await getOfflineData();
        offlineData = offlineData ? JSON.parse(offlineData) : null;

        if (!offlineData) return;

        let allSuccess = true;

        if (offlineData.newAcceptanceRequests) {
          for (const request of offlineData.acceptanceRequests) {
            const response = await sendAcceptJobRequest(
              request.workerId,
              request.workerName,
              request.jobId
            );
            if (!response) allSuccess = false;
          }
        }

        if (offlineData.newProposals) {
          for (const proposal of offlineData.proposals) {
            const response = await sendProposal(
              proposal.workerId,
              proposal.workerName,
              proposal.jobId,
              proposal.proposal
            );
            if (!response) allSuccess = false;
          }
        }

        if (offlineData.newChats) {
          for (const chat of offlineData.chats) {
            const response = await sendMessage(
              chat.chatId,
              chat.from,
              chat.to,
              chat.msg
            );
            if (!response) allSuccess = false;
          }
        }

        if (allSuccess) {
          await AsyncStorage.removeItem("offlineData");
          await setDataAvailableStatus(false);
          setSuccessMsg("Your offline data has been successfully synced!");
          setSuccessModal(true);
        } else {
          setErrorMsg("Failed to sync your offline data.");
          setShowErrorAlert(true);
        }

      } catch (error) {
        setErrorMsg("Unexpected error during sync.");
        setShowErrorAlert(true);
      } finally {
        setShowProcessingSyncData(false);
      }
    }
    if (!prevOnlineStatus.current && contextObj.isOnline && contextObj.isIemodelLoaded) {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      handleSyncingData().finally(() => {
        isSyncingRef.current = false;
        prevOnlineStatus.current = false
      });
    }

    prevOnlineStatus.current = contextObj.isOnline;
  }, [contextObj.isOnline])

  const lang = currentLanguage.toLocaleLowerCase();
  const [jobsData,setJobsData] = useState(contextObj.jobs?.[lang] ?? []);

  function searchJob(query) {
    if (!query.trim() || contextObj.jobs?.[lang].length === 0) {
      setJobsData(contextObj.jobs?.[lang] ?? []);
      return;
    }
    try{
      console.log("Searching jobs for query:", query);
      const filteredJobs = contextObj.jobs?.[lang].filter(job => job?.job_details?.toLowerCase().includes(query.toLowerCase()) || job?.job_title?.toLowerCase().includes(query.toLowerCase()) || job?.location?.toLowerCase().includes(query.toLowerCase()));
      setJobsData(filteredJobs);
      console.log("Filtered jobs:", filteredJobs.length);
    } catch(error) {
      console.error("Error searching jobs:", error);
    }
  }

  return (
    <SafeAreaView
      style={{
        height: height,
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <Modal
        transparent={true}
        visible={showLoading}
        animationType="fade"
        onRequestClose={() => {
          // console.log("attempt to close modal") 
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            //  console.log("attempt to close modal")
          }}
        >
          <View style={styles.modalView}>
            <Text style={{ color: 'black', fontSize: 16 }}>Loading Assistant</Text>
            <LoaderKitView
              style={{ width: 50, height: 50 }}
              name={"BallSpinFadeLoader"}
              animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
              color={"blue"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
            />
          </View>
        </Pressable>
      </Modal>
      <Modal
        transparent={true}
        visible={showProcessingSyncData}
        animationType="fade"
        onRequestClose={() => {
          // console.log("attempt to close modal") 
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            //  console.log("attempt to close modal")
          }}
        >
          <View style={styles.modalView}>
            <Text style={{ color: 'black', fontSize: 16 }}>Looking for data to sync</Text>
            <LoaderKitView
              style={{ width: 50, height: 50 }}
              name={"BallClipRotatePulse"}
              animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
              color={"blue"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
            />
          </View>
        </Pressable>
      </Modal>
      <NavBar />
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.horizontalLine} />
          {/* <View style={styles.statusButton}>
            <Text style={styles.statusText}>Online</Text>
            <View style={styles.statusIcon}>
              <Image
                source={require("../../assets/tools.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View> */}
          <TouchableOpacity onPress={toggleStatus} activeOpacity={0.8}>
            <View
              style={[
                styles.statusButton,
                { backgroundColor: contextObj.isOnline ? "#58EE74" : "#FF6B6B" },
              ]}
            >
              <Animated.View
                style={[
                  styles.statusIcon,
                  { transform: [{ translateX: iconTranslate }] },
                ]}
              >
                <Image
                  source={contextObj.isOnline ? require("../../assets/tools.png") : require("../../assets/offline.png")}
                  style={{ width: 20, height: 20 }}
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.statusText,
                  { transform: [{ translateX: textTranslate }] },
                ]}
              >
                {contextObj.isOnline ? "Online" : "Offline"}
              </Animated.Text>
            </View>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              Good morning {name}
            </Text>
            <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
              Find Jobs Near You
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <TextInput
              style={styles.searchBar}
              placeholder="Search Jobs..."
              placeholderTextColor={"grey"}
              onChangeText={(text) => searchJob(text)}
            />
            <View style={styles.searchIconBox}>
              <Image
                source={require("../../assets/worker/Search.png")}
                style={{ height: 30, width: 30 }}
              />
            </View>
          </View>
        </View>
        <View
          id="available-jobs-container"
          style={styles.contentContainer}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Available Jobs near You</Text>
          <ScrollView contentContainerStyle={{ marginVertical: 10, }}>
            {
              isJobDataLoading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading jobs...</Text>
              ) : (
                jobsData.length > 0 ? (
                  jobsData.map((job) => (
                    <WorkerJobCard key={job.job_id} jobData={job} />
                  ))
                ) : (
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ textAlign: 'center', marginTop: 20 }}>No jobs found.</Text></View>
                )
              )
            }

            {/* <WorkerJobCard />
            <WorkerJobCard />
            <WorkerJobCard />
            <WorkerJobCard /> */}
          </ScrollView>
        </View>
      </View>
      <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message={successMsg} handleOk={() => setSuccessModal(false)} />
      <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Error" message={errorMsg} />
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    height: 160,
    // alignItems: "center",
    backgroundColor: "#4560F4",
  },
  horizontalLine: {
    height: 1,
    width: "94%",
    backgroundColor: "white",
    marginBottom: 10,
    alignSelf: "center",
  },
  // statusButton: {
  //   alignSelf: "center",
  //   borderBlockColor: "black",
  //   backgroundColor: "#58EE74",
  //   borderRadius: 30,
  //   flexDirection: "row",
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   paddingLeft: 15,
  // },
  // statusText: {
  //   color: "black",
  //   fontWeight: "bold",
  //   fontSize: 19,
  //   marginRight: 5,
  // },
  // statusIcon: {
  //   borderRadius: "50%",
  //   backgroundColor: "white",
  //   padding: 3,
  //   borderBlockColor: "black",
  //   width: 32,
  //   height: 32,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  // },
  statusButton: {
    alignSelf: "center",
    borderRadius: 30,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  statusText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginHorizontal: 8,
  },
  statusIcon: {
    borderRadius: 50, // IMPORTANT (not "50%")
    backgroundColor: "white",
    padding: 3,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  searchBar: {
    width: "90%",
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    color: "black",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchIconBox: {
    height: 45,
    width: 45,
    backgroundColor: "#2781E2",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    gap: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    width: "94%",
    height: "67%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 20,
    alignSelf: "center",
    position: "relative",
    top: 40,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 10,
  },
});

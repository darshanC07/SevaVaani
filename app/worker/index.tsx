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
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
import { setStatusBarTranslucent } from "expo-status-bar";
import BottomNavBar from "../../components/BottomNavBar";
import WorkerJobCard from "../../components/WorkerJobCard";
import { getUserId } from "../../utils/AsyncStorageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllJobs } from "@/services/GlobalAPIs";
import { GlobalStatesContext } from "@/contexts/GlobalContext";

const index = () => {
  const router = useRouter();
  const contextObj = useContext(GlobalStatesContext)
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [user, setUser] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');

  const [isJobDataLoading, setIsJobDataLoading] = useState(false);

  async function getJobs() {
    setIsJobDataLoading(true);
    try {
      const data = await fetchAllJobs();
      console.log("Raw job data response:", data);
      if (data.code === 1) {
        contextObj.setJobs(data.jobs);
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
      getJobs();
    }
    fetchUserId();
  }, [])
  return (
    <SafeAreaView
      style={{
        height: height,
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <NavBar />
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.horizontalLine} />
          <View style={styles.statusButton}>
            <Text style={styles.statusText}>Online</Text>
            <View style={styles.statusIcon}>
              <Image
                source={require("../../assets/tools.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
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
          <ScrollView contentContainerStyle={{ marginVertical: 10,}}>
            {
              isJobDataLoading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading jobs...</Text>
              ) : (
                contextObj.jobs.length > 0 ? (
                  contextObj.jobs.map((job) => (
                    <WorkerJobCard key={job.job_id} jobData={job}/>
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
  statusButton: {
    alignSelf: "center",
    borderBlockColor: "black",
    backgroundColor: "#58EE74",
    borderRadius: 30,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    paddingLeft: 15,
  },
  statusText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginRight: 5,
  },
  statusIcon: {
    borderRadius: "50%",
    backgroundColor: "white",
    padding: 3,
    borderBlockColor: "black",
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
    paddingBottom :10,
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

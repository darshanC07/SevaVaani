import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import { fetchOngoingJobs } from "../../services/GlobalAPIs";
import { getUserId } from "../../utils/AsyncStorageUtils";
import { GlobalStatesContext } from "../../contexts/GlobalContext";
import { useTranslation } from "react-i18next";
import { timeAgo } from "../../components/WorkerJobCard";
import { TextInput } from "react-native";

const MyWorks = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase();
  const contextObj = useContext(GlobalStatesContext);
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [isLoading, setIsLoading] = useState(true);
  const [works, setWorks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorks, setFilteredWorks] = useState<any[]>([]);

  useEffect(() => {
    const loadWorks = async () => {
      try {
        const userId = await getUserId();
        console.log("Current Logged-in User ID:", userId);
        if (userId) {
          const response = await fetchOngoingJobs(userId, currentLanguage);
          console.log("Raw API Response for ongoing_jobs:", response);
          
          if (response && response.ongoing_jobs) {
            console.log("Total jobs received from backend:", response.ongoing_jobs.length);
            
            const filteredJobs = response.ongoing_jobs.filter(
              (job: any) => {
                const isStatusMatch = job.status === "assigned";
                const isWorkerMatch = job.acceptedWorker === userId;
                
                if (!isStatusMatch || !isWorkerMatch) {
                  console.log(`Job ${job.job_id} filtered out:`, {
                    status: job.status,
                    expectedStatus: "assigned",
                    acceptedWorker: job.acceptedWorker,
                    currentUserId: userId,
                    isStatusMatch,
                    isWorkerMatch
                  });
                }
                return isStatusMatch && isWorkerMatch;
              }
            );
            
            console.log("Jobs after filtering:", filteredJobs.length);
            
            if (filteredJobs.length === 0 && response.ongoing_jobs.length > 0) {
              console.warn("Ongoing jobs exist but none matched the current User ID and assigned status.");
            }

            setWorks(filteredJobs);
          } else {
            console.log("Response is missing ongoing_jobs or is empty.");
            setWorks([]);
          }
        } else {
          console.error("No User ID found, cannot fetch works.");
        }
      } catch (error) {
        console.error("Error loading works in MyWorks.tsx:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorks();
  }, [currentLanguage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorks(works);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = works.filter((job) => 
        job.job_details?.toLowerCase().includes(query) || 
        job.location?.toLowerCase().includes(query)
      );
      setFilteredWorks(filtered);
    }
  }, [searchQuery, works]);

  return (
    <SafeAreaView style={{ height, backgroundColor: "white", flex: 1 }}>
      <NavBar />
      <View style={styles.header}>
        <View style={styles.horizontalLine} />
        <Text style={styles.title}>My Works</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search Ongoing Works"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ marginLeft: 10, flex: 1, color: "black", fontSize: 15 }}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
          {isLoading ? (
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={styles.infoText}>Loading your works...</Text>
            </View>
          ) : filteredWorks.length > 0 ? (
            filteredWorks.map((job: any) => (
              <View key={job.job_id} style={styles.cardWrapper}>
                <View style={[styles.sideBar, { backgroundColor: "#4F86D9" }]} />
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/worker/SendRequest",
                      params: { 
                        jobData: JSON.stringify({
                          ...job,
                          showCompleteOption: true
                        }) 
                      },
                    })
                  }
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.jobTitle}>{job.job_details}</Text>
                    <Text style={styles.timeText}>{timeAgo(job.posted_at)}</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={18} color="#444" />
                    <Text style={styles.locationText}>{job.location}</Text>
                  </View>
                  <Text style={styles.postedBy}>
                    Service : {job.service_type}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={require("../../assets/Profile/Choice.png")}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>{searchQuery ? "No matches found" : "No ongoing works yet"}</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default MyWorks;

const styles = StyleSheet.create({
  horizontalLine: {
    height: 1,
    width: "105%",
    backgroundColor: "white",
    marginBottom: 10,
    alignSelf: "center",
  },
  header: {
    backgroundColor: "#4560F4",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  searchRow: { marginTop: 15 },
  searchBox: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 15,
  },
  cardWrapper: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sideBar: {
    width: 10,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobTitle: { fontSize: 18, fontWeight: "700", flex: 1 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  locationText: { marginLeft: 5, color: "#555" },
  postedBy: { fontWeight: "600", marginTop: 5, color: "#333" },
  timeText: {
    fontSize: 12,
    color: "#777",
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "500",
  },
});

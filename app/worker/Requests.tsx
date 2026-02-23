import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRequestsOfWorker } from "@/services/GlobalAPIs";
import BottomNavBar from "@/components/BottomNavBar";
import Entypo from '@expo/vector-icons/Entypo';
import NavBar from "@/components/NavBar";
import { useTranslation } from "react-i18next";
const Requests = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [openedProposalIndex, setOpenedProposalIndex] = useState([]);

  const fetchRequests = async (lang) => {
    try {
      setLoading(true);
      const workerId = await AsyncStorage.getItem("userId");

      if (!workerId) {
        console.log("Worker ID not found");
        return;
      }
      const response = await fetchRequestsOfWorker(workerId, lang);
      console.log("Raw requests response:", response);
      if (response?.requests) {
        const formattedData = response.requests.map(
          (item: any, index: number) => {
            return {
              id: item.req_id || index.toString(),
              client_name: item.client_name,
              job_details: item.job_details,
              location: item.location || "Location not provided",
              description: item.req_data?.message || "",
              price: item.req_data?.revisedPrice || "",
              type:
                item.req_data?.type === "revised_proposal"
                  ? "proposal"
                  : "acceptance",
              status:
                item.req_data?.status
                  ? item.req_data.status.charAt(0).toUpperCase() +
                  item.req_data.status.slice(1)
                  : "Pending",
              full_data: item,
            };
          },
        );
        setRequests(formattedData);
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchRequests(currentLanguage);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests(currentLanguage);
  }, []);

  useEffect(() => {
    fetchRequests(currentLanguage);
  }, [currentLanguage])

  const renderStatus = (status: string) => {
    let bgColor = "#4F63FF";

    if (status === "Accepted") bgColor = "green";
    if (status === "Open") bgColor = "#F4A000";
    if (status === "Rejected") bgColor = "red";
    return (
      <View style={[styles.statusBtn, { backgroundColor: bgColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const handleOpen = (item: any) => {
    setSelectedRequest(item.full_data);
    setModalVisible(true);
  };

  const showProposalDetails = (index: number) => {
    if (!openedProposalIndex.includes(index)) {
      setOpenedProposalIndex([...openedProposalIndex, index]);
    } else {
      setOpenedProposalIndex(openedProposalIndex.filter(i => i !== index));
    }
  }

  return (
    <SafeAreaView style={{
      height: height,
      backgroundColor: "white",
      flex: 1,
    }}>
      <NavBar />
      <View style={styles.header}>
        <View style={styles.horizontalLine} />
        <Text style={styles.title}>Requests</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search Requests"
              placeholderTextColor="#999"
              style={{ marginLeft: 10, flex: 1, color: "black", fontSize: 15 }}
            />
          </View>
        </View>
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#4F86D9" }]} />
          <Text>Acceptance Request</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#F4A000" }]} />
          <Text>Revised Proposal</Text>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4F63FF" />
      ) : (

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 90 }}

            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {requests.map((item, index) => (
              <View key={item.id} style={styles.cardWrapper}>
                <View
                  style={[
                    styles.sideBar,
                    {
                      backgroundColor:
                        item.type === "proposal" ? "#F4A000" : "#4F86D9",
                    },
                  ]}
                />
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.jobTitle}>{item.job_details}</Text>
                    {renderStatus(item.status)}
                  </View>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={18} color="#444" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  {item.type === "acceptance" ? (
                    <Text style={styles.postedBy}>
                      Job Posted By : {item.client_name}
                    </Text>
                  ) : (
                    <View>
                      {/* <Text style={styles.desc}>{item.description}</Text> */}
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        {/* <Text style={styles.price}>₹ {item.price}</Text> */}
                        <Text style={styles.postedBy}>
                          Job Posted By : {item.client_name}
                        </Text>
                        <TouchableOpacity
                          // style={styles.openBtn}
                          onPress={() => showProposalDetails(index)}
                        >{openedProposalIndex.includes(index) ? <Entypo name="chevron-up" size={24} color="black" /> : <Entypo name="chevron-down" size={24} color="black" />}</TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {openedProposalIndex.includes(index) && item.type === "proposal" && (
                    <View style={{ marginTop: 15, borderTopWidth: 1, borderColor: "#eee" }}>
                      {/* <Text style={styles.detailLabel}>Client Name</Text>
                    <Text>{item.client_name}</Text>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text>{item.status}</Text> */}
                      {item.description && (
                        <>
                          <Text style={styles.detailLabel}>Message</Text>
                          <Text>{item.description}</Text>
                        </>
                      )}
                      {item.price && (
                        <>
                          <Text style={styles.detailLabel}>Revised Price</Text>
                          <Text>₹ {item.price}</Text>
                        </>
                      )}
                    </View>
                  )}
                  {/* {item.type === "proposal" && (
                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => handleOpen(item)}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      Open
                    </Text>
                  </TouchableOpacity>
                )} */}
                </View>
              </View>
            ))}
          </ScrollView></View>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ color: "#4F63FF", fontWeight: "700" }}>Back</Text>
          </TouchableOpacity>

          {selectedRequest && (
            <>
              <Text style={styles.detailTitle}>
                {selectedRequest.job_details}
              </Text>
              <Text style={styles.detailLabel}>Client Name</Text>
              <Text>{selectedRequest.client_name}</Text>
              <Text style={styles.detailLabel}>Status</Text>
              <Text>{selectedRequest.req_data?.status}</Text>
              {selectedRequest.req_data?.message && (
                <>
                  <Text style={styles.detailLabel}>Message</Text>
                  <Text>{selectedRequest.req_data?.message}</Text>
                </>
              )}
              {selectedRequest.req_data?.revisedPrice && (
                <>
                  <Text style={styles.detailLabel}>Revised Price</Text>
                  <Text>₹ {selectedRequest.req_data?.revisedPrice}</Text>
                </>
              )}
            </>
          )}
        </SafeAreaView>
      </Modal>
      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default Requests;
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
    // paddingVertical : 5,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: { fontSize: 24, fontWeight: "700", color: "white" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    // marginTop: 10,
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
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  contentContainer: {
    width: "94%",
    height: "67%",

    // marginHorizontal: 20,
    alignSelf: "center",
    position: "relative",
    top: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendBox: { width: 20, height: 20 },
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobTitle: { fontSize: 18, fontWeight: "700", flex: 1 },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: { color: "white", fontWeight: "600" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  locationText: { marginLeft: 5 },
  postedBy: { fontWeight: "600", marginTop: 5 },
  desc: { marginTop: 5 },
  price: { marginTop: 5, fontWeight: "600" },
  openBtn: {
    marginTop: 10,
    backgroundColor: "#4F63FF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  detailTitle: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  detailLabel: { marginTop: 15, fontWeight: "700" },
});

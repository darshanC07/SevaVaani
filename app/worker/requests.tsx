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
import { BASE_URL } from "@/services/GlobalAPIs";

const Requests = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/worker/requests/ORyIgEqXblNggj1iW8cONvfdGb32`
      );

      const data = await response.json();

      if (data?.requests) {
        const formatted = data.requests.map((item: any, index: number) => ({
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
            item.req_data?.status?.charAt(0).toUpperCase() +
            item.req_data?.status?.slice(1),
          full_data: item,
        }));

        setRequests(formatted);
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, []);

  const renderStatus = (status: string) => {
    let bg = "#4F63FF";

    if (status === "Accepted") bg = "green";
    if (status === "Open") bg = "#F4A000";
    if (status === "Rejected") bg = "red";
    if (status === "Pending") bg = "#4F63FF";

    return (
      <View style={[styles.statusBtn, { backgroundColor: bg }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const handleOpen = (item: any) => {
    setSelectedRequest(item.full_data);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>SevaVaani</Text>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>

        <Text style={styles.title}>Requests</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search Job"
              placeholderTextColor="#999"
              style={{ marginLeft: 10, flex: 1 }}
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {requests.map((item) => (
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
                  <>
                    <Text style={styles.desc}>{item.description}</Text>
                    <Text style={styles.price}>₹ {item.price}</Text>
                  </>
                )}

                {item.status === "Open" && (
                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => handleOpen(item)}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      Open
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
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
    </SafeAreaView>
  );
};

export default Requests;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4F63FF",
    padding: 20,
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
    marginTop: 10,
  },
  searchRow: { marginTop: 15 },
  searchBox: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
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
  locationRow: { flexDirection: "row", alignItems: "center" },
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
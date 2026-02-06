import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";
import WorkerJobCard from "../../components/WorkerJobCard";

const index = () => {
  const router = useRouter();

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const handleSendRequest = () => {
    router.push("/SendRequest");
  };

  return (
    <SafeAreaView
      style={{
        height,
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <NavBar />

      <View style={styles.mainContainer}>
        {/* TOP SECTION */}
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
              Good morning Ramesh
            </Text>
            <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
              Find Jobs Near You
            </Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Jobs..."
              placeholderTextColor="grey"
            />
            <View style={styles.searchIconBox}>
              <Image
                source={require("../../assets/worker/Search.png")}
                style={{ height: 30, width: 30 }}
              />
            </View>
          </View>
        </View>

        {/* JOB LIST */}
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            Available Jobs near You
          </Text>

          <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
            <WorkerJobCard onSendRequest={handleSendRequest} />
            <WorkerJobCard onSendRequest={handleSendRequest} />
            <WorkerJobCard onSendRequest={handleSendRequest} />
            <WorkerJobCard onSendRequest={handleSendRequest} />
            <WorkerJobCard onSendRequest={handleSendRequest} />
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
    backgroundColor: "#58EE74",
    borderRadius: 30,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
    borderWidth: 1,
  },

  statusText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginRight: 5,
  },

  statusIcon: {
    borderRadius: 16,
    backgroundColor: "white",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    gap: 5,
  },

  searchBar: {
    width: "90%",
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
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
    borderColor: "black",
    marginHorizontal: 20,
    alignSelf: "center",
    position: "relative",
    top: 40,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    elevation: 10,
  },
});
import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const WorkerJobCard = () => {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobDetailTopContainer}>
        <Image
          source={require("../assets/worker/Plumbing.png")}
          style={styles.jobIcon}
        />
        <View style={{ gap: 3 }}>
          <Text style={{ fontSize: 17, fontWeight: "700" }}>Plumbing Work</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Image
              source={require("../assets/worker/Location.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text>123, MG Road, Bangalore</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", flex: 1, height: "100%" }}>
          <Text>2 mins ago</Text>
        </View>
      </View>
      <View style={styles.jobContent}>
        <Text style={{ flex: 8 / 10, marginRight: 10 }}>
          The tap is leaking and A..............
        </Text>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "black",
            paddingLeft: 10,
            flex: 2 / 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>₹ 500</Text>
        </View>
      </View>
      <View style={styles.jobViewButton}>
        <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
          View Job
        </Text>
      </View>
    </View>
  );
};

export default WorkerJobCard;

const styles = StyleSheet.create({
  jobCard: {
    height: 150,
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#e4e8fa",
  },
  jobDetailTopContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 15,
  },
  jobIcon: {
    width: 25,
    height: 25,
  },
  jobContent: {
    flexDirection: "row",
    // justifyContent : 'space-between',
    paddingHorizontal: 10,
    flex: 1,
  },
  jobViewButton: {
    borderColor: "black",
    borderWidth: 1,
    marginTop: 10,
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#4560F4",
    height: 40,
    justifyContent: "center",
  },
});

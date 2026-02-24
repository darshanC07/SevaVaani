import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";

const Chat = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [search, setSearch] = useState("");

  const chatUsers = [
    {
      userId: "U101",
      userName: "Rakesh Yadav",
      time: "3:50 pm",
      status: "Online",
    },
    {
      userId: "U102",
      userName: "Gopal Singh",
      time: "3:50 pm",
      status: "Offline",
    },
    {
      userId: "U103",
      userName: "Rohit Pawar",
      time: "3:50 pm",
      status: "Online",
    },
    {
      userId: "U104",
      userName: "Savitri Thakur",
      time: "3:50 pm",
      status: "Offline",
    },
  ];

  const filteredUsers = chatUsers.filter((item) =>
    item.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <NavBar />

        <View style={styles.header}>
          <View style={styles.horizontalLine} />
          <Text style={styles.title}>Chat</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={16} color="#999" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredUsers.map((item) => (
            <TouchableOpacity key={item.userId} style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.userName.charAt(0)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.userName}</Text>

                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.status === "Online"
                            ? "#22C55E"
                            : "#EF4444",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === "Online"
                            ? "#22C55E"
                            : "#EF4444",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.time}>{item.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
          <BottomNavBar />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  horizontalLine: {
    height: 1,
    width: "105%",
    backgroundColor: "white",
    marginBottom: 6,
    alignSelf: "center",
  },

  header: {
    backgroundColor: "#4560F4",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },

  searchRow: {
    marginTop: 10,
  },

  searchBox: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  searchInput: {
    marginLeft: 6,
    flex: 1,
    color: "black",
    fontSize: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    elevation: 3,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },
});
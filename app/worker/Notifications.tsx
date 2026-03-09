import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { use, useContext, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  const contextObj = useContext(GlobalStatesContext);

  const notifications = [
    { "budget_max": "5", "budget_min": "1", "description": "Snabba", "duration": "5", "hi": { "budget_max": "5", "budget_min": "1", "description": "स्नब्बा", "d duration": "5", "job_details": "वा", "location": "Vzvzz", "posted_at": "2026-02-28T20:39:01.694206", "service_type": "बढ़ईगीरी", "status": "open", "user_id": "uNNQciHVWgXOoGRjxTAEjb741DuL2" }, "job_details": "Va", "location": "Pune", "mr": { "budget_max": "5", "budget_min": "1", "description": "स्नब्बा", "duration": "5", "job_details": "वा", "location": "Vzvzz", "posted_at": "2026-02-28T20:39:01.694206", "service_type": "सुतारकाम", "status": "open", "user_id": "uNQciHVWgXOoGRjxTTAEjb741DuL2" }, "posted_at": "2026-02-28T20:38:59.476301", "service_type": "Carpentry", "status": "open", "type": "new_job", "user_id": "uNQciHVWgXOoGRjxTAEjb741DuL2", "user_name": "Varun" }
  ];
  // 1. Log notifications when they change (Safe check included)
  useEffect(() => {
    if (contextObj.notifications?.length > 0) {
      contextObj.notifications.forEach((item) => console.log(item));
    }
  }, [contextObj.notifications]);


  const MessageBar = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={{
        backgroundColor: item.unread ? "#F5F7FF" : "white",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 21,
        marginBottom: 14,
        width: "92%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 4,
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {item.type}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {item.message["from_name"]}: {item.message["msg"]}
          </Text>


        </View>
      </View>
    </TouchableOpacity>
  );

  const JobOuterCard = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={{
        backgroundColor: item.unread ? "#F5F7FF" : "white",
        borderRadius: 18,
        paddingTop: 0,
        paddingBottom: 22,
        paddingHorizontal: 20,
        marginBottom: 20,
        minHeight: 96,
        width: "92%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#4560F4",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: "#4560F4",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                alignSelf: "stretch",
                marginHorizontal: -22,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "white",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {item.type}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 6,
              }}
            >
              {item.user_name} : {item.job_details}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "black",
                fontWeight: "600",
              }}
            >
              Job : {item.service_type}   Location : {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        height,
      }}
    >
      <View
        style={{
          backgroundColor: "#4560F4",
          height: 210,
          width: "100%",
          position: "absolute",
        }}
      />

      <NavBar />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
            marginBottom: 10,
          }}
        >
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search notifications"
            placeholderTextColor="gray"
            style={{
              marginLeft: 8,
              flex: 1,
              fontSize: 14,
              color: 'black'
            }}
          />
          <Ionicons name="options-outline" size={18} color="gray" />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingTop: 15,
          marginTop: 15,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Notifications
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#EEF1FF",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#4560F4",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {contextObj.notifications.map((item, index) => ( */}
          {notifications.map((item, index) => (
            console.log("Rendering notification:", item),
            console.log("Notification datatype:", typeof item),
            console.log("Notification content:", item["type"]),
            item = JSON.parse(JSON.stringify(item)), // Deep copy to ensure reactivity
            <View key={index}>
              {
                item.type === "new_message" ?
                  <MessageBar item={item} index={index} /> : item.type === "new_job" ?
                    <JobOuterCard item={item} index={index} /> : null
              }
            </View>
          ))}
        </ScrollView>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Notifications;

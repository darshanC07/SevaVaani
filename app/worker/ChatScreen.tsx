import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const ChatScreen = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F2", height }}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View>
            <Text style={styles.username}>User 1</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="phone" size={22} color="white" />
          <Feather name="more-vertical" size={22} color="white" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        <View style={styles.leftMessageRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>U</Text>
          </View>
          <View style={styles.leftBubble}>
            <Text style={styles.messageText}>
              I need bathroom tap work done
            </Text>
          </View>
        </View>

        <View style={styles.rightBubble}>
          <Text style={styles.messageText}>
            Sure ! What is the size of the Bathroom
          </Text>
        </View>

        <View style={styles.leftMessageRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>U</Text>
          </View>

          <View style={styles.leftBubble}>
            <Text style={styles.messageText}>
              Around 150 square feet
            </Text>
          </View>
        </View>

        <View style={styles.rightBubble}>
          <Text style={styles.messageText}>
            I can complete it in 4-5 hours for 1,500. Does that work ?
          </Text>
        </View>

        <View style={styles.leftMessageRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>U</Text>
          </View>
          <View style={styles.leftBubble}>
            <Text style={styles.messageText}>
              Ok ! I wil send location
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <Feather name="paperclip" size={22} color="black" />
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
        />
        <Feather name="mic" size={22} color="black" />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4F63FF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },

  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "600",
  },

  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  onlineDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "lime",
    marginRight: 5,
  },

  onlineText: {
    color: "white",
    fontSize: 14,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },

  chatContainer: {
    padding: 16,
  },

  leftMessageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  smallAvatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  smallAvatarText: {
    color: "white",
    fontWeight: "600",
  },

  leftBubble: {
    backgroundColor: "#5E8BFF",
    padding: 12,
    borderRadius: 14,
    maxWidth: "70%",
  },

  rightBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 14,
    maxWidth: "75%",
    marginBottom: 20,
  },

  messageText: {
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
  },
});

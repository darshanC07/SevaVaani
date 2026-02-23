import {
  Alert,
  Image,
  Modal,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import LoaderKitView from "react-native-loader-kit";
import { predictIntent } from "@/utils/ClassifierService";
import scripts from '../../scripts.json';
import { predictAnswer } from "@/utils/Extractor";

const ProfileSetup = () => {
  const { uid, number, email } = useLocalSearchParams();
  const { TTS_module, STT_module } = NativeModules;
  const router = useRouter();
  const setupImage = require("../../assets/ProfileSetup/setupImage.png");
  const micImg = require("../../assets/ProfileSetup/mic.png");
  const [showScroll, setShowScroll] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const contextObj = useContext(GlobalStatesContext);
  const [isListening, setIsListening] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [messages, setMessages] = useState<{ id: number; text: string; sender: "ai" | "user" }[]>([]);
  const isActiveRef = useRef(true);
  const scrollviewref = useRef<ScrollView>(null)
  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const addMessage = (text: string, sender: "ai" | "user") => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender }
    ]);
  };

  useEffect(() => {
    if (!contextObj.isIemodelLoaded) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [contextObj.isIemodelLoaded])

  const speakAndListen = async (question: string) => {
    try {

      await STT_module.speechStop();

      setIsListening(false)
      await TTS_module.getMsg(question);

      await sleep(700); // allow TTS to fully finish

      setIsListening(true)
      const response = await STT_module.getSTTResult();

      await sleep(700);
      // await STT_module.stopListening();

      setIsListening(false)
      return response || "";

    } catch (error: any) {
      console.log("STT Error:", error);
      return "";
    }
  };

  const handleConversation = async () => {
    try {

      await TTS_module.getMsg("Hello! I am your helpful buddy. Lets build your profile.");

      await sleep(700);
      if (!isActiveRef.current) return;

      let profileData: any = {
        phoneNumber: number || "9999999999",
        email: email || "abc@gmail.com",
        userId: uid || "sddfgdgdsdjkb",
      };

      for (let i = 0; i < scripts.profile_setup.length; i++) {
        if (!isActiveRef.current) return;
        const question = scripts.profile_setup[i];

        addMessage(question, "ai");

        let answer = await speakAndListen(question);
        if (!isActiveRef.current) return;
        if (!answer.trim()) {
          await TTS_module.getMsg(
            "I didn't catch that. Please say that again."
          );
          await sleep(700);
          i--;
          continue;
        }

        addMessage(answer, "user");

        switch (i) {
          case 0:
            const name = await predictAnswer("What is the name?", answer);
            profileData["name"] = name;
            break;
          case 1:
            const language = await predictAnswer("Which language is preferred?", answer);
            profileData["language"] = language;
            break;
          case 2:
            const address = await predictAnswer("What is the current address?", answer);
            profileData["address"] = address;
            break;
          case 3:
            const workType = await predictAnswer("What is the preferred work type?", answer);
            profileData["workType"] = workType;
            break;
          case 4:
            const role = await predictAnswer("What is the worker's role?", answer);
            profileData["role"] = role;
            break;
          case 5:
            const experience = await predictAnswer("How many years of experience?", answer);
            profileData["experience"] = experience;
            break;
        }
      }
      await TTS_module.getMsg(
        "Thanks for sharing the details. I have created your profile. Please click continue to confirm your profile details."
      );
      sleep(700);
      console.log("Final profile data:", profileData);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? String(error));
    }
  };

  useEffect(() => {
    if (isConversationStarted) {
      handleConversation();
    }
  }, [isConversationStarted]);

  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const handleContinue = async () => {
    isActiveRef.current = false;
    try {
      await STT_module.speechStop();
      await TTS_module.stopSpeech();
    } catch (e) {
      console.log(e);
    }

    router.push({ pathname: "/registration/WorkerProfile", params: { uid: uid, number: number, userEmail: email } });
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          height: height,
          marginTop:
            Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
        },
      ]}
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
      <View style={styles.progressContainer}>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>1</Text>
          </View>
        </View>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>2</Text>
          </View>
        </View>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>3</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>4</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.content, { height: height - 100, paddingTop: "10%" }]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Create a Profile</Text>
          <Text style={styles.desc}>
            Talk to our intelligent assistant to personalize your experience
          </Text>
        </View>

        <View style={styles.container}>
          <Image
            style={[styles.image, { width: width * 1, height: 200 }]}
            source={setupImage}
          />
        </View>

        {showScroll && (
          <View>
            <ScrollView style={styles.transcript} contentContainerStyle={{ padding: 12 }} ref={scrollviewref}
              onContentSizeChange={() => scrollviewref.current?.scrollToEnd({ animated: true })}>
              <Text style={styles.transcriptText}>Live Transcription</Text>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    msg.sender === "user"
                      ? styles.userRow
                      : styles.aiRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === "user"
                        ? styles.userBubble
                        : styles.aiBubble,
                    ]}
                  >
                    <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: msg.sender === "ai" ? 'left' : "right" }}>{msg.sender === "ai" ? "Assistant" : "You"}</Text>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            {
              isListening && (
                <View style={{ backgroundColor: 'white', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10, alignSelf: 'center', marginBottom: 10, position: 'absolute', bottom: 5 }}>
                  <LoaderKitView
                    style={{ width: 30, height: 30 }}
                    name={'BallPulse'}
                    animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
                    color={'blue'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                  />
                </View>)
            }
          </View>
        )}

        {!isConversationStarted &&
          <View style={styles.micContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.micButton}
              onPress={() => {

                if (isConversationStarted) return;
                if (contextObj.isIemodelLoaded) {
                  setShowLoading(false);
                  setShowScroll(true);
                  addMessage("Hello! I am your helpful buddy. Lets build your profile.", "ai");
                  setIsConversationStarted(true);
                }
              }}
            >

              <Image source={micImg} style={styles.micIcon} />
            </TouchableOpacity>
          </View>
        }
      </View>


      <View style={styles.buttonAbsolute} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.9}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  userRow: {
    justifyContent: "flex-end",
  },

  aiRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },

  userBubble: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 0,
  },

  aiBubble: {
    // backgroundColor: "#2E3BBF",
    backgroundColor: "white",
    borderTopLeftRadius: 0,
  },

  messageText: {
    fontSize: 16,
    color: "#000",
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
  safe: {
    padding: 20,
    backgroundColor: "white",
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },
  line: {
    backgroundColor: "#D9D9D9",
    width: "25%",
    alignItems: "center",
    height: 5,
    justifyContent: "center",
  },
  circle: {
    backgroundColor: "#D9D9D9",
    borderRadius: 9,
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 10,
    color: "white",
  },
  content: {
    // flex: 1,
    justifyContent: "flex-start",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  desc: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  countryBox: {
    width: 88,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F1F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  countryText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
  },
  mobileBox: {
    flex: 1,
    height: 56,
    justifyContent: "center",
  },
  mobileInput: {
    fontSize: 20,
    color: "#0B1B3A",
    fontWeight: "600",
    paddingVertical: 0,
  },
  footer: {
    // paddingTop: 10,
    alignItems: "flex-end",
  },
  buttonAbsolute: {
    position: "absolute",
    right: 20,
    bottom: 50,
    zIndex: 20,
  },
  continueButton: {
    backgroundColor: "#4560F4",
    width: 170,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  transcript: {
    backgroundColor: "#F3F4F6",
    width: "100%",
    maxHeight: 300,
    borderRadius: 12,
    marginTop: 12,
  },
  transcriptText: {
    color: "#6b7485ff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10
  },
  micContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    bottom: 280,
    left: 170,
  },
  micButton: {
    width: 68,
    height: 68,
    justifyContent: "center",
    top: 130,
    borderRadius: 100,
    backgroundColor: "#4560F4",
    alignItems: "center",
    position: "absolute",
  },
  micIcon: {
    width: 30,
    height: 40,
    position: "absolute",
  },
});
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

const WorkerProfile = () => {
  const { uid, number, userEmail } = useLocalSearchParams();
  console.log("Received params in WorkerProfile:", { uid, number, userEmail });
  const router = useRouter();

  const [name, onChangeName] = useState("");
  const [finalNumber, onChangeFinalNumber] = useState(number || "9999999999");
  const [email, onChangeEmail] = useState(userEmail || "abc@gmail.com");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Marathi", value: "marathi" },
  ]);
  const [open_time, setOpen_time] = useState(false);
  const [value_time, setValue_time] = useState(null);
  const [items_time, setItems_time] = useState([
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Daily", value: "daily" },
    { label: "Seasonal", value: "seasonal" },
  ]);
  const [open_Availability, setOpen_Availability] = useState(false);
  const [value_Availability, setValue_Availability] = useState(null);
  const [items_Availability, setItems_Availability] = useState([
    { label: "Weekdays", value: "Weekdays" },
    { label: "Weekend", value: "Weekend" },
    { label: "Daily", value: "Daily" },
    { label: "Seasonal", value: "seasonal" },
  ]);
  const [adress, onChangeAdress] = useState("");
  const [jobRole, onChangeJobRole] = useState("");
  const [Age, onChangeAge] = useState("");

  const black = "#000000";

  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((num) => (
          <View key={num} style={[styles.line, { backgroundColor: "#4560F4" }]}>
            <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
              <Text style={styles.number}>{num}</Text>
            </View>
          </View>
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.TextContainer}>
              <Text style={styles.titile}>Confirm Details</Text>
            </View>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder="Enter your name"
                placeholderTextColor="#777"
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={finalNumber?.toString()}
                  editable={false}
                  placeholder="Mobile Number"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  onChangeText={onChangeAge}
                  value={Age}
                  placeholder="Age"
                  keyboardType="numeric"
                  placeholderTextColor="#777"
                />
              </View>

              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email?.toString()}
                editable={false}
                placeholder="Email"
              />

              <DropDownPicker
                style={styles.dropdown}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Choose your Language"
                zIndex={3000}
              />

              <TextInput
                style={styles.input}
                onChangeText={onChangeAdress}
                value={adress}
                placeholder="Enter your Address"
                placeholderTextColor="#777"
              />

              <TextInput
                style={styles.input}
                onChangeText={onChangeJobRole}
                value={jobRole}
                placeholder="Enter your Job Role"
                placeholderTextColor="#777"
              />

              <DropDownPicker
                style={styles.dropdown}
                open={open_time}
                value={value_time}
                items={items_time}
                setOpen={setOpen_time}
                setValue={setValue_time}
                setItems={setItems_time}
                placeholder="Choose your Work-time preference"
                zIndex={2000}
              />

              <DropDownPicker
                style={styles.dropdown}
                open={open_Availability}
                value={value_Availability}
                items={items_Availability}
                setOpen={setOpen_Availability}
                setValue={setValue_Availability}
                setItems={setItems_Availability}
                placeholder="Choose your Availability"
                zIndex={1000}
              />
            </View>

            <TouchableOpacity
              style={styles.FinishButton}
              activeOpacity={0.9}
              onPress={() => {
                router.push("/registration/workerProfile");
              }}
            >
              <Text style={styles.FinishSetupText}>Finish Setup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WorkerProfile;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
    fontWeight: "bold",
  },

  content: {
    flex: 1,
  },

  TextContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  titile: {
    fontSize: 24,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },

  disabledInput: {
    backgroundColor: "#EFEFEF",
    color: "#555",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  dropdown: {
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 50,
  },

  FinishButton: {
    backgroundColor: "#4560F4",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 40,
    elevation: 4,
  },

  FinishSetupText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
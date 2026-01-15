 import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

const workerProfile = () => {
  const router = useRouter();
  const blankImage = require("../../assets/ProfileSetup/blankProfile.png");
  const Phone= require("../../assets/ProfileSetup/Phone.png");
  const confirmDetailsPerson = require("../../assets/ProfileSetup/confirmDetailsPerson.png");
  const Email= require("../../assets/ProfileSetup/Email.png");
  const Language= require("../../assets/ProfileSetup/Language.png");
  const Address= require("../../assets/ProfileSetup/Address.png");
  const JobRole= require("../../assets/ProfileSetup/Job.png");
  const AgeImage= require("../../assets/ProfileSetup/Age.png");
  const [text, onChangeText] = useState('');
  const [number, onChangeNumber] = useState('');
  const [email, onChangeEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Marathi", value: "marathi" },
  ]);
  const [adress, onChangeAdress] = useState("");
  const [jobRole, onChangeJobRole] = useState("");
  const [Age, onChangeAge] = useState("");



  const black = "#000000";
  

  let {height, width} = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
        style={[
          styles.safe,
          {height: height,
            marginTop:
              Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
            },
        ]}
    >
        <View style={styles.progressContainer}>
          <View style={[styles.line, {
            backgroundColor: "#4560F4",
          }]}>
            <View style={[styles.circle, {
              backgroundColor: "#4560F4",
            }]}>
              <Text style={[styles.number]}>1</Text>
            </View>
            
          </View>
        
        <View style={[styles.line,{
          backgroundColor:"#4560F4",
        }]}>
          <View style={[styles.circle,{
            backgroundColor:"#4560F4",
          }]}>
            <Text style={[styles.number]}>2</Text>
          </View>
        </View>
        <View style={[styles.line,{
          backgroundColor:"#4560F4",
        }]}>
          <View style={[styles.circle,{
            backgroundColor:"#4560F4",
          }]}>
            <Text style={[styles.number]}>3</Text>
          </View>
        </View>
        <View style={[styles.line,{
          backgroundColor:"#4560F4",
        }]}>
          <View style={[styles.circle,{
            backgroundColor:"#4560F4",
          }]}>
            <Text style={[styles.number]}>4</Text>
          </View>
        </View>
      </View>
      <View style={[styles.content, { height: height - 100, paddingTop: "10%" }]}>
        <View style={styles.TextContainer}>
          <Text style={styles.titile}>Confirm Details</Text>
        </View>
        <Image style={[styles.image,{width:width*1,height:75}]} source={blankImage} />
      </View>
  <View
  style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column",   
    marginTop:-880,
    alignItems: "center",   
    paddingVertical: 10,
  }}
   >
   
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:400,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={confirmDetailsPerson}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  // ← add flex:1 ONLY
    onChangeText={onChangeText}
    value={text}
    placeholder="Enter your name"
    keyboardType="default"
    placeholderTextColor={black}
     />
    </View>
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:450,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={Phone}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  // ← add flex:1 ONLY
    onChangeText={onChangeNumber}
    value={number}
    maxLength={10}
    placeholder="Enter your number"
    keyboardType="phone-pad"
    placeholderTextColor={black}
     />
    </View>
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:500,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={Email}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  //  flex:1 ONLY
    onChangeText={onChangeEmail}
    value={email}
    placeholder="Enter your Email"
    keyboardType="email-address"
    placeholderTextColor={black}
     />
    </View>
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:550,
    alignItems: "center",   
    paddingVertical: 5,
    paddingLeft:35,
    position:"absolute",
    }}
   >
     <Image
    source={Language}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <DropDownPicker
    style={[styles.input, { flex: 1 },{width: "76%",height: 10}]}  // ← add flex:1 ONLY
    open={open}
    value={value}
    items={items}
    setOpen={setOpen}
    setValue={setValue}
    setItems={setItems}
    placeholder="Choose your Language"
    />
  </View>
  <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:610,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={Address}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  //  flex:1 ONLY
    onChangeText={onChangeAdress}
    value={adress}
    placeholder="Enter your Adress"
    keyboardType="default"
    placeholderTextColor={black}
     />
    </View>
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:663,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={JobRole}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  //  flex:1 ONLY
    onChangeText={onChangeJobRole}
    value={jobRole}
    placeholder="Enter your Job Role"
    keyboardType="default"
    placeholderTextColor={black}
     />
    </View>
    <View
    style={{
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",   
    marginTop:715,
    alignItems: "center",   
    paddingHorizontal: 10,
    position:"absolute",
    }}
   >
     <Image
    source={AgeImage}
    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
    />

    <TextInput
    style={[styles.input, { flex: 1 }]}  //  flex:1 ONLY
    onChangeText={onChangeAge}
    value={Age}
    placeholder="Enter your Age"
    keyboardType="default"
    placeholderTextColor={black}
     />
    </View>
  </View>

     
    </SafeAreaView>    
              

    );
};

export default workerProfile;

const styles = StyleSheet.create({safe: {
    padding: 20,
    backgroundColor: "white",

  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },
  line:{
    backgroundColor: "#D9D9D9",
    width: "25%",
    alignItems: "center",
    height: 5,
    justifyContent: "center",
  },
  circle:{
    backgroundColor: "#D9D9D9",
    borderRadius: 9,
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  number:{
    fontSize:10,
    color:"white"
  },
  content: {
    // flex: 1,
    justifyContent: "flex-start",
  },
  TextContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  titile: {
    fontSize: 24,
    fontWeight: "700",
  },
  image:{
    justifyContent:"center",
    alignItems:"center",
    resizeMode:"contain",
    right:20
  },
  container:{
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    flex:1,
    
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    
  }
});
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";


const index = () => {
  const router = useRouter();
  const black = Platform.OS === "ios" ? "black" : "black";
  const [text, onChangeText] = React.useState("");
  const navImage = require("../../assets/Client_HomeScreen/Washing_man.png");
  const searchIcon = require("../../assets/navbar/Search.png");
  const AddIcon = require("../../assets/Client_HomeScreen/add.png");
  const plumbingIcon = require("../../assets/Client_HomeScreen/Plumbing.png");
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
      style={{
        height: height,
        backgroundColor: "white",
      }}
    >
      <NavBar />
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.horizontalLine}/>
          <Text style={[styles.desc,{marginLeft:10}]}>Good Morning,Ramesh!</Text>
          <Text style={[styles.headerText,{marginLeft:10}]}>Post a Job and get {'\n'}Workers near You</Text>
          <Image source={navImage} style={{width:70, height:67, alignSelf:'flex-end', marginTop:-70,marginRight:30}}/>
          <View
              style={{
              flex: 1,
              width: 480,
              justifyContent: "center",
              flexDirection: "row",   
              marginTop:70,
              marginLeft:-50,
              alignItems: "center",   
              paddingHorizontal: 55,
              position:"absolute",
              }}>
          <TextInput
              style={[styles.input, { flex: 1 },]}  // ← add flex:1 ONLY
              onChangeText={onChangeText}
              value={text}
              placeholder="Search Your Job"
              keyboardType="default"
              placeholderTextColor={"gray"}
              
          />
          <Image
              source={searchIcon}
              style={{ width: 30, height: 30, marginRight: 30,}}
          />
          </View>
          

        </View>
        <Text style={{justifyContent:'center',alignSelf:'flex-start',marginTop:20,marginLeft:20,fontSize:20,fontWeight:'bold',color:'black'}}>My Jobs Overview</Text>
        <View style={{justifyContent:'center',alignSelf:'flex-start',marginTop:10,marginLeft:20,backgroundColor:'#FDFAFA',width:'40%',height:100,borderRadius:10,borderColor:'black',borderWidth:1}}>
          <Text style={{fontSize:18,color:'black',marginTop:15,alignSelf:'center'}}>Posted Jobs</Text>
          <Text style={{fontSize:30,color:'black',fontWeight:'bold',alignSelf:'center',marginTop:5}}>11</Text>
        </View>
        <View style={{justifyContent:'center',alignSelf:'flex-end',marginTop:-100,marginRight:20,backgroundColor:'#FDFAFA',width:'45%',height:50,borderRadius:10,borderColor:'black',borderWidth:1}}>
          <Text style={{fontSize:18,color:'black',marginTop:10,marginLeft:20,alignSelf:'flex-start'}}>Your Rating</Text>
          <Text style={{fontSize:18,fontWeight:'bold',color:'black',marginTop:-23,marginRight:20,alignSelf:'flex-end'}}>4.5</Text>
        </View>
        <View style={{justifyContent:'center',alignSelf:'flex-end',marginTop:15,marginRight:106,backgroundColor:'#FDFAFA',width:'23%',height:100,borderRadius:10,borderColor:'black',borderWidth:1}}>
          <Image source={AddIcon} style={{width:30, height:30, alignSelf:'center', marginTop:15}}/>
          <Text style={{fontSize:16,color:'black',marginTop:10,alignSelf:'center'}}> Post a New {'\n'}       Job</Text>
        </View>
        <View style={{justifyContent:'center',alignSelf:'flex-end',marginTop:-100,marginRight:10,backgroundColor:'#FDFAFA',width:'23%',height:100,borderRadius:10,borderColor:'black',borderWidth:1}}>
          <Text style={{fontSize:28,fontWeight:'bold',color:'black',marginTop:9,alignSelf:'center'}}>9</Text>
          <Text style={{fontSize:16,color:'black',marginTop:10,alignSelf:'center'}}>Completed {'\n'}      Jobs</Text>
        </View>
        <View style={{justifyContent:'center',alignSelf:'flex-end',marginTop:-50,marginRight:215,backgroundColor:'#FDFAFA',width:'40%',height:55,borderRadius:10,borderColor:'black',borderWidth:1}}>
          <Text style={{fontSize:18,color:'black',marginTop:15,marginLeft:5,alignSelf:'flex-start'}}>Active</Text>
          <Text style={{fontSize:40,fontWeight:'bold',color:'black',marginTop:-42,marginRight:70,alignSelf:'flex-end'}}>2</Text>
          <Text style={{fontSize:15,color:'grey',marginTop:-45,marginRight:0,alignSelf:'flex-end'}}>ongoing {'\n'}jobs</Text>
        </View>
       <ScrollView style={styles.scrollView}>
        <Text style={{fontSize:20,fontWeight:'bold',color:'black',marginTop:10,marginLeft:10,alignSelf:'flex-start'}}>My Recent Jobs</Text>
        <View style={{justifyContent:'center',alignSelf:'flex-start',marginTop:40,marginLeft:10,backgroundColor:'#B4BEF5',width:'90%',height:70,borderRadius:10,borderColor:'gray',borderWidth:1,position:'absolute',}}>
          <Image source={plumbingIcon} style={{width:30, height:30, alignSelf:'flex-start', marginTop:-35,marginLeft:10,position:'absolute',}}/>
          <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginTop:-35,marginLeft:50,alignSelf:'flex-start',position:'absolute',}}>Repairing of bathroom tap</Text>
          <Text style={{fontSize:12,color:'black',marginTop:-35,marginRight:5,alignSelf:'flex-end',position:'absolute',}}>2 mins ago</Text>
          <TouchableOpacity
                    style={styles.viewRequestButton}
                    activeOpacity={0.9}
                    onPress={() => {}}
                  >
                    <Text style={styles.viewRequest}>View Request</Text>
          </TouchableOpacity>
          <Text style={{fontSize:16,color:'#656363',marginTop:20,marginLeft:13,alignSelf:'flex-start',position:'absolute',}}>Completed</Text>
        </View>
        </ScrollView>   
      </View>
      
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  desc:{
    fontSize:12,
    fontFamily:'times new roman',
    color:'#DFDFDF',
    fontWeight:'bold',
  },
  headerText:{
    fontSize:18,
    fontFamily:'times new roman', 
    color:'white',
    fontWeight:'bold',
  },
  input: {
    height: 37,
    margin: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "white",
    fontSize: 18,
  },
  
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    height: 125,
    // alignItems: "center",
    backgroundColor: "#4560F4",
  },
  horizontalLine: {
    height: 1,
    width: '94%',
    backgroundColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
  },
  scrollView:{
    marginTop:20,
    marginHorizontal:20,
    backgroundColor:'#FDFAFA',
    height:250,
    borderRadius:10,
    borderColor: "gray",
    borderWidth:1,
    
  },
  viewRequestButton:{
    position:'absolute',
    backgroundColor:'#2563EB',
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:10,
    bottom:10,
    right:10,
  },
  viewRequest:{
    color:'white',
    fontWeight:'bold',
    fontSize:14,
  },
  statusButton:{
    alignSelf:'center',
    borderBlockColor:'black',
    backgroundColor:'#58EE74',
    borderRadius:30,
    flexDirection:'row',
    paddingHorizontal:10,
    paddingVertical:5,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    paddingLeft:15
  },
  statusText:{
    color:'black',
    fontWeight:'bold',
    fontSize:19,
    marginRight:5,
  },
  statusIcon:{
    borderRadius:'50%',
    backgroundColor:'white',
    padding:3,
    borderBlockColor:'black',
    width:32,
    height:32,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1
  }
});

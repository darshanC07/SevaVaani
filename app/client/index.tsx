import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";

import { setStatusBarTranslucent } from "expo-status-bar";

const index = () => {
  

  const router = useRouter();
  const navImage = require("../../assets/Client_HomeScreen/Washing_man.png");
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
          <Image source={navImage} style={{width:75, height:75, alignSelf:'flex-end', marginTop:-80,marginRight:30}}/>
          

        </View>
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
    fontSize:22,
    fontFamily:'times new roman', 
    color:'white',
    fontWeight:'bold',
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

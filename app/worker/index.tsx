import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
import { setStatusBarTranslucent } from "expo-status-bar";

const index = () => {
  const router = useRouter();
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
          <View style={styles.statusButton}>
            <Text style={styles.statusText}>Online</Text>
            <View style={styles.statusIcon}>
              <Image source={require("../../assets/tools.png")} style={{width:20, height:20}}/>
            </View>
          </View>
        </View>
      </View>
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
    height: 100,
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

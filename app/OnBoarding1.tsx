import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnBoarding1 = () => {
  return (
    <SafeAreaView>
        <View>
            <Text style={styles.skip}>Skip</Text>
        </View>
        <View>
            <Image source={require("../assets/onboarding/ob1.png")} style={styles.image}/>
            <Text>Skilled Professionals You Can Trust</Text>
            <Text>Trained Professionals for home and daily services</Text>
        </View>
        <View style={styles.button}><Text style={styles.buttonText}>Continue</Text></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    skip:{
        color:'grey'
    },
    image:{
        height:100,
        width:100
    },
    button:{
        backgroundColor:'#4560F4'
    },
    buttonText:{
        color : "white"
    }
})
export default OnBoarding1
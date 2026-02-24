import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const MobileVerification1 = () => {
  const { t } = useTranslation();
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
      style={{
        height: height,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
        padding: 20,
        backgroundColor: "#F5F5F5",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image
          source={require("../../assets/back-arrow.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>1</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>2</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
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
        style={{
          // padding: 20,
          justifyContent: "space-evenly",
          height: height - 170,
          paddingBottom:50
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{t('registration.verifyMobileNumber')}</Text>
          <Text style={styles.desc}>
            {t('registration.sendOneTimeCode')}
          </Text>
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputContainer}>
          <View style={styles.flagContainer}>
            <Image
              source={require("../../assets/india-flag.png")}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('registration.enterMobileNumber')}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <View style={{ marginTop: 'auto' }}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/registration/otp-verification')}
        >
          <Text style={styles.buttonText}>{t('registration.sendCode')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MobileVerification1;

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    // padding: 10,
  },
  line: {
    backgroundColor: "#D9D9D9",
    // backgroundColor:'#4560F4',
    width: "25%",
    alignItems: "center",
    height: 5,
    justifyContent: "center",
    // borderRadius:2
  },
  circle: {
    backgroundColor: "#D9D9D9",
    // backgroundColor:'#4560F4',
    borderRadius: "50%",
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 10,
    color: "white",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 16,
    color: "grey",
    alignSelf: "center",
    // textAlign:'center'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    paddingRight: 10,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  continueButton: {
    backgroundColor: "#4560F4",
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

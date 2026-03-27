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
  Keyboard,
  Modal,
} from "react-native";
import React, { useState, useRef, use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import config from "../../config.json";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { useTranslation } from "react-i18next";
import { CameraView } from "expo-camera";
import * as Camera from "expo-camera";

const OTPScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { number, uid,email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<TextInput>(null);
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [isSuccessModal, setSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showQrSuccessModal, setShowQrSuccessModal] = useState(false);
  const [showAdditionalButton, setShowAdditionalButton] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [qrSuccessMsg, setQrSuccessMsg] = useState("");

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    console.log("QR Code scanned:", data);
    setShowScanner(false);
    
    // Validate QR data
    if (!data || data.trim() === '') {
      console.error('QR data is null or empty');
      setErrorMsg('Invalid QR code: No data found');
      return;
    }
    
    // Add your QR code handling logic here
     try {
    const response = await fetch('https://4z5zr34t-5000.inc1.devtunnels.ms/decode_aadhaar_qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_data: data
      })
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    const responseText = await response.text();
    console.log("Raw response text:", responseText);
    
    const result = JSON.parse(responseText);
    console.log("decode_aadhaar_qr API output:", result);
    
    if (result.status === 'success') {
      console.log('Decoded Aadhaar data:', result.decoded_data);
      const decodedName = result.decoded_data?.name;
      const displayName = decodedName ? `${decodedName} ` : "";
      setQrSuccessMsg(`${displayName}you are successfully authenticated`);
      setShowQrSuccessModal(true);
      // Handle the decoded data
    } else {
      console.error('Decoding failed:', result.message);
    }
  } catch (error) {
    console.error('API call failed:', error);
  }
  };

  const handleScanQR = async () => {
    if (!cameraPermission) {
      console.log('Camera permission not loaded yet');
      return;
    }
    
    if (cameraPermission.granted) {
      setShowScanner(true);
    } else {
      const result = await requestCameraPermission();
      if (result.granted) {
        setShowScanner(true);
      } else {
        console.log('Camera permission denied');
        // You can show an alert here
      }
    }
  };


  async function handleVerifyOtp() {
    // Bypass verification - show success immediately
    console.log("Bypassing OTP verification - showing success");
    setSuccessMsg("OTP verified successfully");
    setSuccessModal(true);
    setShowAdditionalButton(true);
    
    // Original verification code (commented out)
    
    if (otp.length === 4) {
      console.log("Verifying OTP:", otp);
      const res = await fetch(config.serverURL + "/verify_phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entered_otp: otp,
          uid: uid,
          role: "worker"
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("OTP verified successfully");
        // alert("OTP verified successfully");
        setSuccessMsg("OTP verified successfully");
        setSuccessModal(true);
        setShowAdditionalButton(true);
      } else {
        console.log("OTP verification failed:", data.message);
        setErrorMsg(data.message || "OTP verification failed");
        setShowErrorAlert(true);
        router.back();
        // alert("OTP verification failed: " + data.message);
      }
    }
    
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
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>5</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.content, { height: height - 170, paddingTop: "25%" }]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{t('registration.enterVerificationCode')}</Text>
          <Text style={styles.desc}>{t('registration.sentFourDigitCode')}</Text>
          <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold" }}>
            +91 {number}
          </Text>
        </View>

        <View style={styles.inputCard}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.otpRow}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                otpInputRef.current?.focus();
              }, 50);
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.otpBox, otp[i] ? styles.otpBoxFilled : null]}
              >
                <Text style={styles.otpText}>{otp[i] || ""}</Text>
              </View>
            ))}
          </TouchableOpacity>

          <TextInput
            ref={otpInputRef}
            value={otp}
            onChangeText={(t) => {
              const digits = t.replace(/[^0-9]/g, "").slice(0, 4);
              setOtp(digits);
              if (digits.length === 4) otpInputRef.current?.blur();
            }}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus={false}
            caretHidden
            showSoftInputOnFocus={true}
            selection={{ start: otp.length, end: otp.length }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.continueButton} activeOpacity={0.9} onPress={() => handleVerifyOtp()}>
            <Text style={styles.continueText}>{t('common.continue')}</Text>
          </TouchableOpacity>
          
          {showAdditionalButton && (
            <TouchableOpacity style={styles.scanQrButton} activeOpacity={0.9} onPress={handleScanQR}>
              <Text style={styles.scanQrButtonText}>Scan QR</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message={successMsg} handleOk={() => {
        setSuccessModal(false);
      }} />
      <SuccessModal
        isVisible={showQrSuccessModal}
        toggleModal={() => setShowQrSuccessModal(!showQrSuccessModal)}
        title="Success!"
        message={qrSuccessMsg}
        handleOk={() => setShowQrSuccessModal(false)}
      />
      <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Error" message={errorMsg} />
      
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={showScanner ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            enableTorch={false}
          />
          <View style={styles.overlay}>
            <Text style={styles.scanText}>{t('navbar.alignQRCode')}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScanner(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
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
    width: "20%",
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
    position: "relative",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 6,
    // backgroundColor:'pink',
    // zIndex:5
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 6,
  },
  otpBoxFilled: {
    borderColor: "#4560F4",
    backgroundColor: "#F1F5FF",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  hiddenInput: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 1,
    width: 1,
    opacity: 0,
  },
  footer: {
    // paddingTop: 10,
    alignItems: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  scanQrButton: {
    backgroundColor: "#FF6B35",
    width: 120,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  scanQrButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

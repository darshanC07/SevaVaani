import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform, Modal, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useInitializeAgora } from './hooks'; // Logic stays the same
import { useLocalSearchParams, useRouter } from 'expo-router';
import { uploadRecording } from '@/services/GlobalAPIs';
import { getUserId } from '@/utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallRoomScreen = () => {
  const { anotherUserId,anotherUserName, CN, channelToken } = useLocalSearchParams();
  console.log("CallRoomScreen Params:", { anotherUserName, CN, channelToken });
  const router = useRouter();
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [user, setUser] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [showTranscription, setShowTranscription] = useState(false);
  const {
    getRecordingFilePath,
    isMute,
    joinSucceed,
    peerIds,
    join,
    leaveChannel,
    toggleIsMute,
    toggleSpeaker,
    setIsTranscribing
  } = useInitializeAgora();


  const uploadAudioToServer = async () => {
    setIsTranscribing(true);
    try {
      const recordingPath = await getRecordingFilePath();


      const formData = new FormData();
      formData.append('audio', {
        uri: Platform.OS === 'android' ? `file://${recordingPath}` : recordingPath,
        type: 'audio/wav',
        name: 'recording.wav',
      } as any);

      formData.append("members", JSON.stringify({
        user1_name: name,
        user1_id: user,
        user2_name: anotherUserName,
        user2_id: anotherUserId
      }));

      // Send to your server
      const response = await uploadRecording(formData);

      console.log('Server Response:', response.data);
      setTranscriptionResult(response.data.text || 'Transcription complete');
    } catch (error) {
      console.error('Failed to upload audio to server:', error);
    } finally {
      setIsTranscribing(false);
    }
  };



  useEffect(() => {
    // Only attempt to join if we have BOTH the channel name and the token
    const fetchUserId = async () => {
      const userId = await getUserId();
      console.log("Fetched User ID:", userId);
      if (!userId) {
        router.replace("/login");
      }
      const uname = await AsyncStorage.getItem("name");
      setUser(userId);
      setName(uname);
    }
    if (CN && channelToken) {

      fetchUserId();
      console.log("Attempting to join with token...");
      join(CN, channelToken);
    } else {
      console.error("Missing CN or Token:", { CN, channelToken });
    }
  }, [CN, channelToken]);

  const handleHangup = async () => {
    await leaveChannel();
    router.back();
  };

  if (!joinSucceed) {
    return (
      <View style={[styles.bg, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 10 }}>Connecting to call...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#222224' }}>
        <View style={styles.bg}>
          <View style={styles.header}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {peerIds.length > 0 ? `In Call: ${anotherUserName}` : "Connecting to caller..."}
            </Text>
          </View>

          <View style={styles.centerContent}>
            <View style={styles.avatarCircle}>
              <FontAwesome5 name="user-alt" size={40} color="black" />
            </View>
            {peerIds.length === 0 && (
               <Text style={{ color: 'white', marginTop: 15 }}>Establishing connection...</Text>
            )}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.hangupBtn} onPress={handleHangup}>
              <MaterialIcons name="call-end" size={30} color="#750000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.muteBtn} onPress={toggleIsMute}>
              <FontAwesome 
                name={isMute ? "microphone-slash" : "microphone"} 
                size={30} 
                color="black" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

    </SafeAreaProvider>
  )
}

export default CallRoomScreen

const styles = StyleSheet.create({
  loadingModalOverlay: {
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
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bg: {
    backgroundColor: '#515152',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { 
    backgroundColor: '#222224', 
    padding: 10, 
    width: "100%", 
    alignItems: 'center', 
    height: '8%', 
    justifyContent: 'center' 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%'
  },
  avatarCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white' 
  },
  controls: { 
    height: '15%', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    width: '100%', 
    backgroundColor: '#222224' 
  },
  hangupBtn: { 
    padding: 15, 
    borderRadius: 50, 
    borderColor: '#750000', 
    borderWidth: 2, 
    backgroundColor: '#f57474' 
  },
  muteBtn: { 
    padding: 15, 
    borderRadius: 50, 
    borderWidth: 2, 
    backgroundColor: '#74e2f5', 
    width: 65, 
    height: 65, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
})
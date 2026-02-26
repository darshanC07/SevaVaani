import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useInitializeAgora } from './hooks'; // Logic stays the same
import { useLocalSearchParams, useRouter } from 'expo-router';

const CallRoomScreen = () => {
  const { anotherUserId, anotherUserName, CN, channelToken } = useLocalSearchParams();
  const router = useRouter();

  const {
    isMute,
    joinSucceed,
    peerIds,
    join,
    leaveChannel,
    toggleIsMute,
  } = useInitializeAgora();

  useEffect(() => {
    if (CN && channelToken) {
      join(CN, channelToken);
    } else {
      console.error("Receiver missing connection data:", { CN, channelToken });
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
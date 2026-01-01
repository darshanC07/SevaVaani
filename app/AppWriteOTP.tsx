import { StyleSheet, Text, TextInput, View,Button } from 'react-native'
import React,{useState} from 'react'
import { account } from '../libs/appwriteConfig'
import { ID } from 'appwrite'

const AppWriteOTP = () => {
    const[number,setNumber]=useState('')
    async function sendOTP(){
        try{
            const token = await account.createPhoneToken(
                ID.unique(),
                `+91${number}`,
            )
            console.log(token);
        }catch(err){
            console.log(err);
        }
    }
  return (
    <View style={{marginTop:50}}>
        <TextInput placeholder='Enter Number' style={{borderWidth:1,margin:10,padding:10,borderRadius:5}} keyboardType='numeric' value={number} onChangeText={setNumber}/>
        <Button title='Send OTP' onPress={sendOTP} />
        <TextInput placeholder='Enter OTP' style={{borderWidth:1,margin:10,padding:10,borderRadius:5}} keyboardType='numeric' />
        
    </View>
  )
}

export default AppWriteOTP

const styles = StyleSheet.create({})
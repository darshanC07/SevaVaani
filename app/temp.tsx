import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const temp = () => {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.line,{backgroundColor:'#4560F4'}]}>
        <View style={[styles.circle,{backgroundColor:'#4560F4'}]}>
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
  )
}

export default temp

const styles = StyleSheet.create({
    progressContainer:{
        flexDirection:'row',
        padding:10,
    },
    line:{
        backgroundColor:'#D9D9D9',
        // backgroundColor:'#4560F4',
        width:"25%",
        alignItems:'center',
        height:10,
        justifyContent:'center',
        borderRadius:2
    },
    circle:{
        backgroundColor:'#D9D9D9',
        // backgroundColor:'#4560F4',
        borderRadius:"50%",
        height:18,
        width:18,
        justifyContent:'center',
        alignItems:'center'
    },
    number:{
        fontSize:10,
        color:'white'
    }
})
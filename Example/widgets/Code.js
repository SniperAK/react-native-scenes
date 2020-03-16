import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet, 
} from 'react-native';

const styles = StyleSheet.create({
  container:{
    minWidth:260,
    width:'80%', 
    marginLeft:'10%',
    borderRadius:5, 
    padding:15,
    backgroundColor:'#333', 
    marginVertical:10,
  },
  code:{
    fontSize:12, color:'#eee'
  }
});

const Code = ({children, condition})=>{
  if( condition === false ) return null;
  return (
    <View style={styles.container}>
      <Text style={[styles.code]}>{children}</Text>
    </View>
  )
}

export default Code;
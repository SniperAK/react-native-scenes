import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';

const Caption = ({children, text})=>{
  return (
    <View style={{
      width:'84%',
      marginLeft:'8%',
    }}>
      <Text style={{fontSize:16, fontWeight:'600'}}>- {children}{text}</Text>
    </View>
  )
}

export default Caption;
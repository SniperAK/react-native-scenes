import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';

const Explain = ({children})=>{
  return (
    <View style={{
      width:'80%',
      marginLeft:'10%',
    }}>
      <Text style={{fontSize:16}}>{children}</Text>
    </View>
  )
}

export default Explain;
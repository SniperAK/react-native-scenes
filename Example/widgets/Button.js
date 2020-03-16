import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  button:{
    height:45, 
    minWidth:260,
    width:'80%', 
    marginLeft:'10%',
    borderRadius:45/2, 
    backgroundColor:'#ddd', 
    marginVertical:10,
  },
  contentWrapper: {
    backgroundColor:'transparent', 
    width:'100%', 
    height:'100%', 
    alignItems:'center', 
    justifyContent:'center',
  }
});

const Button = ({title, condition, onPress})=>{
  if( condition === false ) return null;
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <View style={styles.contentWrapper}>
        <Text style={[{fontSize:16}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Button;
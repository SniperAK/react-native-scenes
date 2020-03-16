import React, {Component} from 'react';
import {
  View,
} from 'react-native';

export default ({color='#eee'})=>{
  return (
    <View style={{height:1, backgroundColor:color, marginVertical:10}} />
  )
}
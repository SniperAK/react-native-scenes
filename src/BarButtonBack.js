import React, { Component } from 'react';
import { 
  View, 
  StyleSheet 
} from 'react-native';

import BarButton from './BarButton';

const S = StyleSheet.create({
  container:{
    position:'relative',
  }, 
  bar:{
    position:'absolute',
  }
});

export default class BarButtonBack extends Component {
  static defaultProps = {
    color:'#333',
    direction:'right',
    width:9,
    height:18,
    borderWidth:2,
  };

  constructor(props){
    super(props);
  }

  onPress = ()=>{
    let {onPress, pop, hideModal} = this.props;
    if( onPress ) onPress();
    else if( pop ) pop();
    else if( hideModal ) hideModal();
  }

  render(){
    let {style, color, direction, width, height, borderWidth} = this.props;
    let barWidth = Math.sqrt( Math.pow( (height - borderWidth) / 2, 2) + Math.pow( width ,2 ) );
    return (
      <BarButton
        style={style}
        onPress={this.onPress}
      >
        <View style={[S.container, {width, height, transform:[{rotate:'180deg'}]}]}>
          <View style={[S.bar,{
            backgroundColor:color, 
            height:borderWidth, 
            width:barWidth, 
            transform:[{rotate:'45deg'}], 
            top:width / 2 - borderWidth  / 4, 
            left:-borderWidth,
            borderRadius:borderWidth / 2 }]} />
          <View style={[S.bar,{
            backgroundColor:color, 
            height:borderWidth, 
            width:barWidth, 
            transform:[{rotate:'-45deg'}], 
            bottom:width / 2 - borderWidth  / 4, 
            left:-borderWidth,
            borderRadius:borderWidth / 2} ]} />
        </View>
      </BarButton>
    );
  }
}

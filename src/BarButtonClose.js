import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import BarButton from './BarButton';

const styles = StyleSheet.create({
  container:{
    width:42, 
    height:42, 
    justifyContent:'center', 
    alignItems:'center',
    position:'relative'
  },
  bar:{
    position:'absolute', 
    transform:[{rotate: '45deg'}],
  }
})

const Close = ({style, onPress, color = 'white', barWidth, size, borderRadius}) => {
  const barStyle = {
    backgroundColor:color, 
    height:barWidth, 
    width: size, 
    borderRadius,
  }
  return (
    <View style={[styles.container,style]}>
      <View style={[styles.bar, barStyle]} />
      <View style={[styles.bar, barStyle, {transform:[{rotate:'-45deg'}]}]} />
    </View>
  )
};

Close.defaultProps = {
  style:{},
  color:'white',
  barWidth:1,
  size:23,
  borderRadius:0
}

export default class BarButtonClose extends Component {
  constructor(props){
    super(props);
  }
  onPress(){
    if( this.props.hideModal ) this.props.hideModal();
    else if( this.props.pop ) this.props.pop();
    else if( this.props.onPress ) this.props.onPress();
  }
  render(){
    let {...args} = this.props;
    return (
      <BarButton
        {...args}
        onPress={()=>this.onPress()}
      >
        <Close color='#333'/>
      </BarButton>
    );
  }
}

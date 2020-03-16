import React, { Component } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity, 
} from 'react-native';
import BarButton from './BarButton';

const styles = StyleSheet.create({
  menu:{
    width:18,
    height:12,
    justifyContent:'space-between',
  },
  bar:{
    height:2,
    borderRadius:1,
    backgroundColor:'rgb(136, 151, 170)',
  },
  bar1:{ width:18 },
  bar2:{ width:18 },
  bar3:{ width:18 },
})

export default class BarButtonMenu extends Component {
  constructor(props){
    super(props);
    this._onPress = this._onPress.ubind(this);
  }

  _onPress(){
    this.props.onPress && this.props.onPress();
  }

  render(){
    return (
      <BarButton onPress={this._onPress}>
        <View style={styles.menu}>
          <View style={[styles.bar, styles.bar1]}/>
          <View style={[styles.bar, styles.bar2]}/>
          <View style={[styles.bar, styles.bar3]}/>
        </View>
      </BarButton>
    );
  }
}

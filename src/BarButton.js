import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// import Haptic from '../../utils/Haptic';

const styles = StyleSheet.create({
  container:{
    minWidth: 46,
    height: 46,
  },
  contentWrapper:{
    width:'100%',
    height:'100%', 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent',
  }
})

class BarButton extends Component {
  static defaultProps = {
  }
  constructor( props ) {
    super( props );
  }

  _onPress(){
    // Haptic.impactMedium();
    this.props.onPress && this.props.onPress();
  }

  render(){
    let {children, textStyle, style, source, tintColor, onPress, ...etcProps } = this.props;
    let content = null;
    if( source ) {
      content = <Image style={[tintColor && {tintColor}]} source={source} resizeMode={'stretch'}/>;
    }
    else if( typeof children === 'string') {
      content = <Text style={[textStyle]}>{children}</Text>;
    }
    else {
      content = children;
    }

    let Container = View;

    if( onPress ) {
      Container = TouchableOpacity;
      content = <View style={styles.contentWrapper}>{content}</View>
    }

    return (
      <Container 
        style={[styles.container, style]} 
        onPress={this._onPress.bind(this)}
        {...etcProps}
      >
        {content}
      </Container>
    )
  }
};

module.exports = BarButton;

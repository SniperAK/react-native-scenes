import React,{Component} from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

let {width,height} = Dimensions.get('window');
global.NotchDevice     = Platform.OS == 'ios' ? height == 812 || height == 896 || height == 828 : false;
global.StatusBarHeight = Platform.OS == 'ios' ? NotchDevice ? 35 : 20 : 0; // StatusBar.currentHeight;
global.BarHeight       = 56 + StatusBarHeight || 0;

const styles = StyleSheet.create({
  bar: {
    height: 56 + StatusBarHeight || 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: StatusBarHeight,
    paddingHorizontal:4,

    backgroundColor:'white',
    borderBottomColor:'#ccc',
    borderBottomWidth:StyleSheet.hairlineWidth,
  },
  title: {
    color: '#333',
    fontSize: 19.3,
    fontWeight: '900',
    textAlign: 'center',
    alignItems: 'center',
    letterSpacing : 0.1,
  },
  corner: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonTextLeft: {
    marginLeft: 10,
  },
  buttonTextRight: {
    marginRight: 10,
  },
});

export default class Bar extends Component {
  static Height = BarHeight;
  static styles = styles;
  constructor(props){
    super(props);
    this.state = {
      leftWidth:0,
      rightWidth:0,
    }
  }

  _renderTitle(){
    let {
      title: Title ,
      titleStyle,
      titleProps,
    } = this.props;
    if( typeof Title === 'object' ) return Title;
    if( typeof Title === 'function' ) return ( <Title {...titleProps}/> );
    if( typeof Title === 'string' ) return (
      <Text
        style={[styles.title, titleStyle]}
        numberOfLines={1}
        {...titleProps}
      >{Title}</Text>
    );
  }

  _onLeftItemLayout({nativeEvent:{layout:{width, height}}}){
    this.setState({leftWidth:width});
  }

  _onRightItemLayout({nativeEvent:{layout:{width, height}}}){
    this.setState({rightWidth:width});
  }

  _renderLeftItem(){
    let {
      leftItem : LeftItem,
      index,
      sceneProps,
      defaultBackButton,
    } = this.props;

    if( !LeftItem && index > 0 ) LeftItem = defaultBackButton;

    switch (typeof LeftItem) {
      case 'function': {
        return ( <LeftItem style={[styles.corner]} {...sceneProps} /> );
      } break;
      case 'object':{
        if( !LeftItem ) return null;
        if( LeftItem.constructor === Array) {
          if( LeftItem.filter(e=>e).length > 0 ) {
            return (
              <View style={{flexDirection:'row'}}>
                { LeftItem.filter(item=>item).map( (item,index)=>Object.assign({},item,{key:'leftItem_' + index, ...sceneProps}))}
              </View>
            );
          }
          else return null;
        }
        else {
          return Object.assign( {}, LeftItem, sceneProps );
        }
      } break;
    }
  }

  _renderRightItem(){
    let {
      rightItem : RightItem,
      sceneProps,
    } = this.props;

    switch (typeof RightItem) {
      case 'function': {
        return ( <RightItem style={[styles.corner]} {...sceneProps} /> );
      } break;
      case 'object':{
        if( !RightItem ) return null;
        if( RightItem && RightItem.constructor === Array) {
          if( RightItem.filter(e=>e).length > 0 ) {
            return (
              <View style={{flexDirection:'row'}}>
                { RightItem.filter(item=>item).map( (item,index)=>Object.assign({},item,{key:'rightItem_' + index, ...sceneProps}))}
              </View>
            );
          }
          return null;
        }
        else {
          return Object.assign( {}, RightItem, sceneProps );
        }
      } break;
    }
  }

  render(){
    let {
      barStyle,
      overlay,
    } = this.props;

    let {
      leftWidth, 
      rightWidth,
    } = this.state;

    let leftItem  = this._renderLeftItem();
    let rightItem = this._renderRightItem();

    return (
      <View style={[styles.bar, barStyle, {position:'relative'}]} >
        {leftItem && (
          <View style={{}} onLayout={this._onLeftItemLayout.bind(this)}>
            {leftItem}
          </View>
        )}
        <View style={{
          flex:1, 
          paddingLeft:rightWidth < leftWidth ? 0 : rightWidth - leftWidth,
          paddingRight:leftWidth < rightWidth ? 0 : leftWidth - rightWidth,
          }}>
          { this._renderTitle() }
        </View>
        { rightItem && (
          <View style={{}} onLayout={this._onRightItemLayout.bind(this)}>
            {rightItem}
          </View>
        ) }
        { overlay }
      </View>
    );
  }
}
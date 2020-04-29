/**
 * Modal
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
} from 'react-native';

import {
  AnimationDuration,
  TransitionType
} from './common';

const styles = StyleSheet.create({
  container:{
    ...StyleSheet.absoluteFill,
    overflow:'hidden',
  },
  dimming:{
    ...StyleSheet.absoluteFill,
    backgroundColor:'#00000088',
  },
  modal:{
    ...StyleSheet.absoluteFill,
    alignItems:'center',
    justifyContent:'center',
  },
})

export default class Modal extends Component{
  static defaultProps = {
    transitionType: TransitionType.Slide,
    animationDuration: AnimationDuration, 

    onModalWillShow:null,
    onModalDidShow:null,
    onModalWillHide:null,
    onModalDidHide:null,
  }

  constructor( props ){
    super( props );
    let {width, height} = props;

    this._dimming = true;
    if( width || height ) {
      this._dimming = true;
    }
    
    this._transitionType = props.transitionType;
    this.state = {
      wrapperWidth : null,
      wrapperHeight : null,
      width, 
      height,
    }
    this._modalAnimation   = new Animated.Value(0);
    this._dimmingAnimation = new Animated.Value(this._dimming ? 0 : 1);
  
    this._backAction = this._backAction.bind(this)
  }

  componentDidMount(){
    if( !this.props.avoidBackHandler ) {
      this._backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this._backAction );
    }
  }

  componentWillUnmount(){
    if( this._backHandlerSubscription ) this._backHandlerSubscription.remove();
  }

  _backAction(){
    this.hideAnimation();
    return true;
  }
  

  get animationDuration(){
    return this.props.animationDuration;
  }

  get transitionType(){
    return this._transitionType;
  }

  _onLayoutModalContainer({nativeEvent:{layout:{width,height}}}){
    if( this.state.wrapperWidth == width && this.state.wrapperHeight == height ) return;

    this.setState({
      wrapperWidth:width,
      wrapperHeight:height, 
    }, ()=>{
      this.showAnimation();
    })
  }

  showAnimation(){
    this.props.onModalWillShow && this.props.onModalWillShow();
    this._isShowTransition = true;
    return Animated.parallel([
      Animated.timing( this._dimmingAnimation, {
        toValue:1,
        duration:this.animationDuration,
        easing:Easing.easeInOut
      }),
      Animated.timing( this._modalAnimation, {
        toValue:1,
        duration:this.animationDuration,
        easing:Easing.easeInOut,
      })
    ]).start(()=>{
      this.props.onModalDidShow && this.props.onModalDidShow();
    });
  }

  hideAnimation(){
    this.props.onModalWillHide && this.props.onModalWillHide();
    this._isShowTransition = false;
    Animated.parallel([
      Animated.timing( this._dimmingAnimation, {
        toValue:0,
        duration:this.animationDuration,
        easing:Easing.easeInOut
      }),
      Animated.timing( this._modalAnimation, {
        toValue:0,
        duration:this.animationDuration,
        easing:Easing.easeInOut,
      }),
    ]).start(()=>{
      this.props.onFinishHide();
      this.props.onModalDidHide && this.props.onModalDidHide();
    })
  }

  _calculateTransformForTranstion(){
    let {wrapperWidth, wrapperHeight} = this.state;

    let opacity = this._modalAnimation.interpolate({
      inputRange:this._isShowTransition ? [0,0.5,1] : [0,0.5,1], 
      outputRange:this._isShowTransition ? [0,1,1] : [0,0,1], 
    })

    if( this.transitionType == TransitionType.Slide ){
      return {
        opacity,
        transform : [{
          translateY:this._modalAnimation.interpolate({
            inputRange:[0,1],
            outputRange:[wrapperHeight, 0],
          })
        }]
      }
    }
    else if( this.transitionType == TransitionType.Fade ){
      return { 
        opacity
      };
    }
    return null;
  }

  render(){
    let {width, height, wrapperWidth, wrapperHeight} = this.state;
    let {scenesProps, Scenes} = this.props;
    let transform = this._calculateTransformForTranstion();
    let opacity = this._dimmingAnimation;

    if( !wrapperWidth || !wrapperHeight ) return (
      <View style={[styles.container]} onLayout={this._onLayoutModalContainer.bind(this)} />
    )
    if( !width || !height ) {
      width  = wrapperWidth;
      height = wrapperHeight;
    }

    return (
      <View style={[styles.container]} onLayout={this._onLayoutModalContainer.bind(this)}>
        <Animated.View style={[styles.dimming, {opacity}]} />
        <Animated.View style={[styles.modal, transform]}>
          <View style={{width, height, alignSelf:'center', overflow:'hidden'}}>
            <Scenes
              {...scenesProps}
              hideModal={this.hideAnimation.bind(this)}
            />
          </View>
        </Animated.View>
      </View> 
    )
  }
}
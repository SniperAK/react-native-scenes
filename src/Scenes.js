/**
 * Scenes
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
} from 'react-native';

import Modal from './Modal';

import BarButtonBack  from './BarButtonBack';
import BarButtonClose from './BarButtonClose';
import SceneContainer from './SceneContainer'; 

import {
  AnimationDuration,
  TransitionType
} from './common';

const styles = StyleSheet.create({
  container:{
    flex:1, 
    position:'relative',
  },
  routeContainerWrapper:{
    ...StyleSheet.absoluteFill,
  },
});

export default class Scenes extends Component {
  static TransitionType = TransitionType;
  static defaultProps = {
    transitionType: TransitionType.Slide,
    backButton:BarButtonBack,
    animationDuration:AnimationDuration,
    style:{backgroundColor:'white'}
  }
  static _modalSeed = 0;
  static _modalIds = [];
  static _modals = [];

  static _barStyle = null;
  static _barShadow = true;
  static _titleStyle = null;

  static setGlobalBarStyle( barStyle ){
    this._barStyle = barStyle;
  } 
  static setGlobalBarShadow( barShadow ){
    this._barShadow = barShadow;
  } 
  static setGlobalTitleStyle( titleStyle ){
    this._titleStyle = titleStyle; 
  }

  static showModal( options = {}){
    if( !global.Absolute ) return console.warn( 'Absolute module is not created yet or not implemented');
    if( !options.component ) return console.error( 'NaviagionController modal must provieded component to controll');

    let {
      title,
      titleStyle,
      barHidden,
      barStyle,
      leftItem,
      rightItem,
      avoidBackHandler,

      style,
      component,
      passProps,
      animationDuration,

      transitionType, 
      modalTransitionType,
      closeButton=BarButtonClose,
      ...etc
    } = options || {};

    let route = {
      title,
      titleStyle,
      barHidden,
      barStyle,
      rightItem,
      avoidBackHandler,
      
      component, 
      passProps,
      leftItem:closeButton
    };

    let modalId = `Modal_${this._modalSeed++}`;
    this._modalIds.push( modalId );
    let absolute = Absolute.add(
      <Modal 
        {...etc}
        scenesProps={{
          style,
          route,
          modalId,
          transitionType,
        }}
        avoidBackHandler={avoidBackHandler}
        Scenes={this}
        transitionType={modalTransitionType || transitionType}
        onFinishHide={()=>{
          absolute.destroy();
          let modalIndex = this._modalIds.findIndex(id=>id == modalId);
          if(modalIndex > -1) this._modalIds.splice(modalIndex, 1);

          delete this._modals[modalId];
        }}
      />
      ,this._modalIds.length + 1
    )
    this._modals[modalId] = absolute;
  }

  static hideAllModal(){
    this._modalIds.forEach(absoluteRef=>{
      this._modals[absoluteRef].destroy()
    });
    this._modalIds = [];
    this._modals = {};
  }


  constructor( props ){
    super( props );
    let { route } = props;
    
    this.state = {
      routes:[ route ],
      transition: null,
    };

    this._animation = new Animated.Value(1);
  }

  get animationDuration(){
    return this.props.animationDuration;
  }

  get transitionType(){
    return this.props.transitionType;
  }

  setStateAsync( state ){
    return new Promise(r=>this.setState(state, r));
  }

  _onLayout({nativeEvent:{layout:{width, height}}}){
    this.setState({ width,  height });
  }

  _animateTranstion(){
    this._animation.setValue(0);
    return new Promise(r=>Animated.timing(
      this._animation,{
        toValue:1,
        duration:this.animationDuration,
        easing:Easing.easeInOut,
        useNativeDriver:true,
      }
    ).start( r )); 
  }

  // route control 
  push = ( route )=>{
    if( this._nowTransition ) return Promise.resolve();
    this._nowTransition = true; 

    return this.setStateAsync(({routes})=>{
      routes.push( route );
      return {
        routes,
        transition:{
          pushIn:routes.length - 1,
          pushOut:routes.length - 2,
        }
      };
    })
    .then(()=>this._animateTranstion())
    .then(()=>{
      this._nowTransition = false; 
      return this.setStateAsync({ transition: null })
    })
  }

  pop = ()=>{
    if( this.state.routes.length == 1 ) return Promise.resolve();

    if( this._nowTransition ) return Promise.resolve();
    this._nowTransition = true; 

    return this.setStateAsync(({routes})=>{
      if( routes.length == 1 ) return {};
      return {
        transition:{
          popIn:routes.length - 2,
          popOut:routes.length - 1, 
        }
      };
    })
    .then(()=>this._animateTranstion())
    .then(()=>{
      return this.setStateAsync(({routes})=>{
        routes.pop();
        return {
          routes,
          transition:null,
        };
      })
    })
    .then(()=>this._nowTransition = false)
  }

  popTo = ( index )=>{
    if( this.state.routes.length == 1 ) return Promise.resolve({});
    if( index > this.state.routes.length - 2) return Promise.resolve({});

    if( this._nowTransition ) return Promise.resolve({});
    this._nowTransition = true; 

    return this.setStateAsync(({routes})=>{
      if( routes.length == 1 ) return {};
      return {
        transition:{
          popIn:index,
          popOut:routes.length - 1,
        }
      };
    })
    .then(()=>this._animateTranstion())
    .then(()=>{
      return this.setStateAsync(({routes})=>{
        routes.splice(  (index + 1), routes.length - (index + 1) );
        return {
          routes,
          transition:null,
        };
      })
    })
    .then(()=>this._nowTransition = false);
  }

  popToTop = ()=>{
    return this.popTo( 0 );
  }

  hideModal = ()=>{
    this.props.hideModal && this.props.hideModal();
  }
  
  _calculateTransformForTranstion( index, routes ){
    let {transition} = this.state;
    
    let {width, height} = this.state;
    if( transition == null ) return ( index == routes.length - 1 ) ? null : { opacity:0, transform:[{translateX:width}] };
    let {pushIn, pushOut, popIn, popOut} = transition;
    let inputRange, outputRange;

    if( transition.pushIn == index ){
      if( this.transitionType == TransitionType.Slide ) {
        inputRange  = [0, 1];
        outputRange = [width, 0];
      }
      else if( this.transitionType == TransitionType.Fade ) {
        inputRange  = [0, 1];
        outputRange = [0, 1];
      }
    }
    else if( transition.pushOut == index ){
      if( this.transitionType == TransitionType.Slide ) {
        inputRange  = [0, 0.3, 1];
        outputRange = [0,-width * 0.1, -width];
      }
      else if( this.transitionType == TransitionType.Fade ) {
        inputRange  = [0, 1];
        outputRange = [1, 0];
      }
    }
    else if( transition.popIn == index ){
      if( this.transitionType == TransitionType.Slide ) {
        inputRange  = [0, 1];
        outputRange = [-width, 0];
      }
      else if( this.transitionType == TransitionType.Fade ) {
        inputRange  = [0, 1];
        outputRange = [0, 1];
      }
    }
    else if( transition.popOut == index ){
      if( this.transitionType == TransitionType.Slide ) {
        inputRange  = [0, 1];
        outputRange = [0, width];
      }
      else if( this.transitionType == TransitionType.Fade ) {
        inputRange  = [0, 1];
        outputRange = [1, 0];
      }
    }
    if( inputRange && outputRange ){
      if( this.transitionType == TransitionType.Slide ) {
        return {transform:[{translateX:this._animation.interpolate({ inputRange, outputRange })}]}
      }
      else if( this.transitionType == TransitionType.Fade ) {
        return { opacity:this._animation.interpolate({ inputRange, outputRange }) }
      }
    }
    return { opacity:0, transform:[{translateX:width}] }
  }

  _renderRoute( route, index, routes ){
    let _transform = this._calculateTransformForTranstion( index, routes );
    let { modalId, backButton } = this.props;

    let routing = {
      isRoot:index == 0,
      route,
      index,
      modalId,
      backButton,
      push:this.push,
      pop:this.pop,
      popTo:this.popTo,
      popToTop:this.popToTop,
      hideModal:this.props.hideModal && this.hideModal,
      barStyle   : [this.constructor._barStyle,   this.props.barStyle  ].flat(),
      barShadow  : this.constructor._barShadow || this.props.barShadow,
      titleStyle : [this.constructor._titleStyle, this.props.titleStyle].flat(),
    };

    return (
      <Animated.View 
        key={`navigation-route-${index}`}
        style={[styles.routeContainerWrapper, {zIndex:index}, _transform]} 
      >
        <SceneContainer {...routing} routing={routing}/>
      </Animated.View>
    )
  }

  render(){
    return (
      <View style={[styles.container, this.props.style]} onLayout={this._onLayout.bind(this)}>
        {this.state.routes.map(this._renderRoute.bind(this))}
      </View>
    )
  }
}
/**
 * Scene Container
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Easing,
  StatusBar,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';

import Bar from './Bar';

import {
  BarShadow,
  TransitionType, 
  AnimationDuration,
} from './common';

const styles = StyleSheet.create({
  container:{
    flex:1,
    position:'relative',
  },
  barContainer:{
  },
  compoentContainer:{
    flex:1,
    position:'relative', 
  },
  barShadow:{
    position:'absolute',
    top:0,
    left:0,
    right:0, 
    height:15,
    zIndex:1,
  },
});

const CallRefNotExists = {CallRefNotExists:true};

export default class SceneContainer extends Component {
  constructor( props ){
    super( props );
    let {route, barShadow:barShadowGiven} = props;
    let barShadow = typeof route.barShadow == 'boolean' ? route.barShadow : 
                    typeof route.component.barShadow == 'boolean' ? route.component.barShadow : 
                    barShadowGiven;
    this.state = {
      barStyle    : route.barStyle   || route.component.barStyle    || null,
      title       : route.title      || route.component.title       || null,
      titleStyle  : route.titleStyle || route.component.titleStyle  || null,
      leftItem    : route.leftItem   || route.component.leftItem    || null,
      rightItem   : route.rightItem  || route.component.rightItem   || null,
      barOverlay  : null,
      barHidden   : route.barHidden  || route.component.barHidden   || false,
      barShadow,
    };

    this._onReceiveBackPress = this._onReceiveBackPress.bind(this);
    this._onChangeDimensions = this._onChangeDimensions.bind(this);
  }

  get route(){ 
    return this.props.route; 
  }

  get index(){
    return this.props.index;
  }

  get avoidBackHandler() { 
    return typeof this.route.avoidBackHandler === 'boolean' ? this.route.avoidBackHandler :
           typeof this.route.component.avoidBackHandler === 'boolean' ? this.route.component.avoidBackHandler : 
           false;
  }

  _componentRefCall( action, ...params ){
    if( this._componentRef && this._componentRef[action] && typeof this._componentRef[action] === 'function' ){
      return this._componentRef[action]( ...params);
    }
    else return CallRefNotExists;
    // if( !target ) console.warn( '_componentRefCall target not exists');
    // else if( !target[action] ) console.warn(`_componentRefCall target.${action} not exists`);
    // else if( typeof target[action] !== 'function' ) console.warn(`_componentRefCall target.${action} is not function`);
  }

  componentDidMount(){
    if( !this.avoidBackHandler && this.props.index > 0 ) {
      this._backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this._onReceiveBackPress );
    }

    let {dimensionsChangeEventEmitter:dimensionsEmitter} = this.props;
    dimensionsEmitter && dimensionsEmitter.addEventListener && dimensionsEmitter.addEventListener('change', this._onChangeDimensions );
    this._componentRefCall( 'routeWillAppear', this.props.index );
  }

  componentWillUnmount(){
    if( this._backHandlerSubscription ) this._backHandlerSubscription.remove();
    
    let {dimensionsChangeEventEmitter:dimensionsEmitter} = this.props;
    dimensionsEmitter && dimensionsEmitter.removeEventListener && dimensionsEmitter.removeEventListener('change', this._onChangeDimensions );
    this._componentRefCall( 'routeDidDisappear', this.props.index );
  }

  shouldComponentUpdate(nextProps, nextState){
    return (
      this._shouldUpdate 
      || nextState.barStyle   != this.state.barStyle    
      || nextState.title      != this.state.title       
      || nextState.titleStyle != this.state.titleStyle  
      || nextState.leftItem   != this.state.leftItem    
      || nextState.rightItem  != this.state.rightItem   
      || nextState.barOverlay != this.state.barOverlay  
      || nextState.barHidden  != this.state.barHidden   
      || nextState.barShadow  != this.state.barShadow
    );
  }

  _onReceiveBackPress(){
    let res = this._componentRefCall( 'onBackPress' );
    if( res  === CallRefNotExists ) {
      this.props.pop();
      return true;
    }
    else return res;
  }

  _onChangeDimensions(event){
    this._shouldUpdate = true;
    this._componentRefCall( 'routeWillChangeDimensions', event );
    this.setState({},()=>{
      this._shouldUpdate = false;
      this._componentRefCall( 'routeDidChangeDimensions', event );
    })
  }


  routeWillChange( toIndex, currentIndex ) {
    if( currentIndex == this.index && toIndex != this.index ) {
      this._componentRefCall( 'routeWillDisappear', toIndex );
    }
    else if( (toIndex == this.index && currentIndex != this.index ) ) {
      this._componentRefCall( 'routeWillAppear', toIndex );
    }
  }

  routeDidChange( currentIndex, beforeIndex ) {
    if( beforeIndex == this.index && currentIndex != this.index ) {
      this._componentRefCall( 'routeDidDisappear', currentIndex )
    }
    if( currentIndex == this.index && beforeIndex != this.index ) {
      this._componentRefCall( 'routeDidAppear', currentIndex )
    }
  }
  
  render(){
    let {
      route,
      routing,
    } = this.props;

    let {
      component:Content,
      passProps
    } = route;

    let {
      barHidden,
      title,
      titleStyle,
      leftItem,
      rightItem,
      barStyle,
      barOverlay,
      barShadow,
    } = this.state;

    let sceneProps = {
      setTitle      : (title)         =>this.setState({title}),
      setTitleStyle : (titleStyle)    =>this.setState({titleStyle}),
      setLeftItem   : (leftItem)      =>this.setState({leftItem}),
      setRightItem  : (...rightItem)  =>this.setState({rightItem}),
      setBarStyle   : (barStyle)      =>this.setState({barStyle}),
      setBarOverlay : (barOverlay)    =>this.setState({barOverlay}),
      setBarHidden  : (barHidden)     =>this.setState({barHidden}),
      setBarShadow  : (barShadow)     =>this.setState({barShadow}),
      barHidden,
      barShadow,
      ...routing,
    };

    return (
      <View style={styles.container} key={`rounte-content-${routing.index}`}>
        {!barHidden && (
          <View style={[styles.barContainer]}>
            <Bar
              title={title}
              titleStyle={[routing.titleStyle, titleStyle]}
              leftItem={leftItem || ( !routing.isRoot && routing.backButton )}
              rightItem={rightItem}
              barStyle={[routing.barStyle, barStyle]}
              barOverlay={barOverlay}
              sceneProps={sceneProps}
            />
          </View>
        )}

        <View style={[styles.compoentContainer]}>
          {!barHidden && barShadow && (
            <Image source={BarShadow} style={styles.barShadow} resizeMode='stretch' />
          )}
          <Content 
            ref={r=>this._componentRef = r}
            sceneProps={sceneProps}
            {...sceneProps}
            {...passProps}
          />
        </View>
      </View>
    )
  }
}

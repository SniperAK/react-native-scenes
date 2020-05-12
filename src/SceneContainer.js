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
})

export default class SceneContainer extends Component {
  constructor( props ){
    super( props );
    let {route} = props;
    let barShadow = typeof route.barShadow == 'boolean' ? route.barShadow : 
                    typeof route.component.barShadow == 'boolean' ? route.component.barShadow : 
                    true;
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

    this._backAction = this._backAction.bind(this)
  }

  componentDidMount(){
    if( !this.avoidBackHandler && this.props.index > 0 ) {
      this._backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this._backAction );
      console.log( this._backHandlerSubscription );
    }
  }

  componentWillUnmount(){
    if( this._backHandlerSubscription ) this._backHandlerSubscription.remove();
  }

  _backAction(){
    this.props.pop();
    return true;
  }

  shouldComponentUpdate(nextProps, nextState){
    return (
         nextState.barStyle   != this.state.barStyle    
      || nextState.title      != this.state.title       
      || nextState.titleStyle != this.state.titleStyle  
      || nextState.leftItem   != this.state.leftItem    
      || nextState.rightItem  != this.state.rightItem   
      || nextState.barOverlay != this.state.barOverlay  
      || nextState.barHidden  != this.state.barHidden   
      || nextState.barShadow  != this.state.barShadow
    );
  }

  get route(){ return this.props.route; }
  get avoidBackHandler()  { return this.route.avoidBackHandler  || this.route.component.avoidBackHandler   || null  }

  routeWillChange( toIndex, currentIndex ) {
    
    let {index} = this.props;
    // console.log( {index, toIndex, currentIndex});

    if( currentIndex == index && toIndex != index ) {
      if( this._componentRef && this._componentRef.routeWillDisappear && typeof this._componentRef.routeWillDisappear === 'function') {
        this._componentRef.routeWillDisappear(toIndex);
      }
      else {
        console.log( `routeWillDisappear[${index}]`, toIndex );
      }
    }
    else if( (toIndex == index && currentIndex != index ) ) {
      if( this._componentRef && this._componentRef.routeWillAppear && typeof this._componentRef.routeWillAppear === 'function') {
        this._componentRef.routeWillAppear(toIndex);
      }
      else {
        console.log( `routeWillAppear[${index}]`, toIndex );
      }
    }
  }

  routeDidChange( currentIndex, beforeIndex ) {
    let {index} = this.props;
    
    console.log( {index, currentIndex, beforeIndex});
    // routeDidDisappear can't call when route popping cause ref already unmount should using componentWillUmnoumt instead.
    if( beforeIndex == index && currentIndex != index ) {
      if( this._componentRef && this._componentRef.routeDidDisppear && typeof this._componentRef.routeDidDisppear === 'function') {
        this._componentRef.routeDidDisppear(currentIndex);
      }
      else {
        console.log( `routeDidDisppear[${index}]`, currentIndex );
      }
    }
    if( currentIndex == index && beforeIndex != index ) {
      if( this._componentRef && this._componentRef.routeDidAppear && typeof this._componentRef.routeDidAppear === 'function') {
        this._componentRef.routeDidAppear(currentIndex);
      }
      else {
        console.log( `routeDidAppear[${index}]`, currentIndex );
      }
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

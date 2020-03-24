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

    this.state = {
      barStyle    : route.barStyle   || route.component.barStyle    || null,
      title       : route.title      || route.component.title       || null,
      titleStyle  : route.titleStyle || route.component.titleStyle  || null,
      leftItem    : route.leftItem   || route.component.leftItem    || null,
      rightItem   : route.rightItem  || route.component.rightItem   || null,
      barOverlay  : null,
      barHidden   : route.barHidden  || route.component.barHidden   || false,
      barShadow   : route.barShadow  || route.component.barShadow   || true,
    }
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
  get avoidBack()  { return this.route.avoidBack  || this.route.component.avoidBack   || null  }
  
  render(){
    let {
      route,
      routing,
    } = this.props;

    let {
      component:Component,
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
          <Component 
            sceneProps={sceneProps}
            {...sceneProps}
            {...passProps}
          />
        </View>
      </View>
    )
  }
}

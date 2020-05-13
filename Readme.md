# react-native-scenes

> Pure Javascript to standalone scene statck control in React Native like react-navigation or navigator.

> react-native-scenes makes dynamic routing each scene.

# Version History
- 0.4.0 Add Dimensions Change receive event implementable
- 0.3.0 Add Route Change event props on each Component and Scenes owner
- 0.2.0 Add BackHandler Event on Modal and SceneContainer
- 0.1.5 Add setGlobalBarShadow(boolean) to control bar shadow appearence.

## Supported OS

- iOS
- Android
- Windows

## Installation

```
npm install --save react-native-scenes
```

## How to use

### Basic Use

> Start Entry point.
```
import Scenes from 'react-native-scenes';

export default class EntryPoint extends React.Component {
  render(){
    return (
      <Scenes
        route={{
          component:Main, 
        }}
      />
    )
  }
}
```
> Dynamically and programmatically route to another sceen
```
class Main extends React.Component {
  _onPressSomeEvent(){
    this.props.push({
      component:SecondScene,
      passProps:{
        testValue:'test' // can pass value using passProps and next scene receive with there props.
      }
    })
  }
}
```

## Scene Component Properties
  - [pop](#pop)
  - [push](#push)
  - [popToTop](#poptotop)
  - [popTo](#popto)
  - [setBarStyle](#setbarstyle)
  - [setBarOverlay](#setbaroverlay)
  - [setTitle](#settitle)
  - [setTitleStyle](#settitlestyle)
  - [setLeftItem](#setleftitem)
  - [setRightItem](#setrightitem)

### pop
  > Pop current scene from current scene stack
  
  ```
  this.props.pop(void);
  ```
### push
 > Push new component to current stack
  ```
  this.props.push( Route )
  ```
### popToTop
 > clear all scene stack with out main route scene.
  ```
  this.props.popToTop( void )
  ```
### popTo
 > pop to specific index to current scene stack
  ```
  this.props.popTo( index )
  ```
### setBarStyle
 > customization bar style
  ```
  this.props.setBarStyle
  ```
### setBarOverlay
  ```
  this.props.setBarOverlay
  ```
### setTitle
  ```
  this.props.setTitle
  ```
### setTitleStyle
  ```
  this.props.setTitleStyle
  ```
### setLeftItem
  ```
  this.props.setLeftItem
  ```
### setRightItem
  ```
  this.props.setRightItem()
  ```
## Route
### Route options
  - title
  - titleStyle
  - barHidden
  - barStyle
  - barShadow
  - leftItem
  - rightItem
  - avoidBackHandler

## Static Method 

- static setGlobalBarStyle(View Style StyleSheet)
- static setGlobalBarShadow(Boolean)
- static setGlobalTitleStyle(Text Style StyleSheet)

## Scene
### props 
- transitionType
  - Configure appearence method 
  - (default)TransitionType.Slide
  - TransitionType.None
  - TransitionType.Fade,
- backButton
  - Default left item for back ( pop ) button
  - default : BarButtonBack
- animationDuration (default : 500)
- style
- routeWillChange( toIndex : Number )
- routeDidChange( toIndex : Number )


### methods 
- push
- pop
- popTo
- popToTop
- hideModal

## Modal
options 
  ...Route options
  ...Scene props
  animationDuration,
  closeButton=BarButtonClose,
    
```
Modal.show()
```


## BackHandler event ( v0.2.0 )
- The avoidBackHandler rounter options can determine BackHandler work or not work. But you should make sure implement BackHandler event as you want. See react-native BackHandler event sample [BackHandler](https://reactnative.dev/docs/backhandler)


```
this.props.push({
  component:SomeScene,
  avoidBackHandler:true,
})

// ... 

class SomeScene extend Component{
  componentDidMount(){
    this._backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', ()=>{
      Popup.show({
        message:'Are you sure?',
        buttons:['Ok','Cance'],
      })
      .then(({answer})=>{
        if( answer == 0 ) this.props.pop();
      })
      return true;
    })
  }

  componentWillUnmount(){
    this._backHandlerSubscription.remove();
  }
}
```


## Implement Route life cycle functions ( above v 0.3 )

- routeWillAppear()
  > after scene did mount and before the transition push or other component will push out with came current route
- routeDidAppear()
  > after transition with current route push over other scene or other comopnent did push out and re appear curent route
- routeWillDisappear()
  > before scene unmount or other scene route will show push over current scene with transition
- routeDidDisappear()
  > after scene unmount or other scene route did push over current scene after transition


```
class SomeScene extends Component {
  componentDidMount(){
  }

  componentWillUnmount(){
  }

  routeWillAppear(){
  }

  routeDidAppear(){

  }

  routeWillDisappear(){

  }

  reouteDidDisappear(){

  }

  someActionToPushSomeRoute(){
    this.props.push({
      component:SomeOtherScene,
    })
  }
}
```

## Implement Dimensions Change event
> For improve performance should reduce render event called that each route are contained SceneContainer implements shouldCompnentUpdate funciton. So need to update navigation bar and scene update via dimension change event.

- routeWillChangeDimensions
- routeDidChangeDimensions
# react-native-scenes

> Pure Javascript to standalone scene statck control in React Native like react-navigation or navigator.

> react-native-scenes makes dynamic routing each scehe.

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
class Main extends Reat.Component {
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

## Scene Properties
- [react-native-scenes](#react-native-scenes)
  - [Supported OS](#supported-os)
  - [Installation](#installation)
  - [How to use](#how-to-use)
    - [Basic Use](#basic-use)
  - [Scene Properties](#scene-properties)
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
  - [Static Method](#static-method)
  - [Scene](#scene)


### pop
  ```
  this.props.pop
  ```
### push
  ```
  this.props.push
  ```
### popToTop
  ```
  this.props.popToTop
  ```
### popTo
```
this.props.popTo
```
### setBarStyle
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

## Static Method 
- 

## Scene 


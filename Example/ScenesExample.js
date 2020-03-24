import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import Scenes, {
  BarButton,
} from 'react-native-scenes';

import TreeView from 'react-native-dev-treeview';

import {
  Caption,
  Button,
  Code,
  Hair,
  Explain,
} from './widgets';

export default class ScenesExample extends Component {
  static get title(){
    return 'react-native-scenes';
  }
  constructor( props ){
    super( props ); 
    this.state = {
      showTreeView:false,
    }
  }

  componentDidMount(){
    if( this.props.index > 0 ){
      this.props.setTitle(`Sample ${this.props.modalId ? 'Modal ' : ''}Scene <${this.props.index}${this.props.modalId ? '|' + this.props.modalId : ''}>`);
    }
    this.props.setRightItem(
      <BarButton onPress={()=>{
        LayoutAnimation.easeInEaseOut();
        this.setState({showTreeView:!this.state.showTreeView})
      }}>
        T
      </BarButton>
    )
  }

  _onPressPush(){
    this.props.push({
      component:ScenesExample
    })
  }

  _onPressPop(){
    this.props.pop();
  }

  _onPressPopTo( index ){
    this.props.popTo( index );
  }

  _onPressPopToTop(){
    this.props.popToTop();
  }

  _onPressShowModal(){
    Scenes.showModal({
      component:ScenesExample,
    })
  }

  _onPressShowModalDimm(){
    Scenes.showModal({
      component:ScenesExample,
    })
  }

  _onPressShowModalJustModalFade(){
    Scenes.showModal({
      component:ScenesExample,
      modalTransitionType:Scenes.TransitionType.Fade,
    })
  }

  _onPressShowModalTransitionFade(){
    Scenes.showModal({
      component:ScenesExample,
      transitionType:Scenes.TransitionType.Fade
    })
  }

  _onPressHideModal(){
    this.props.hideModal();
  }

  render(){
    let backgroundColor = `#${('0'.repeat(6) + Math.round( Math.random() * 0xFFFFFF).toString(16)).substr(-6,6)}`;
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <ScrollView style={{flex:1}} contentContainerStyle={{paddingVertical:10}}>

          <Caption>Dynamic Scene Routing Control</Caption>
          <Explain>Control dynamically</Explain>
          
          <Button 
            onPress={this._onPressPush.bind(this)} 
            title='Push'
          />

          <Code>
            {`this.props.push({component})`};
          </Code>

          <Button 
            condition={!this.props.isRoot}
            onPress={this._onPressPop.bind(this)} 
            title='Pop'
          />

          <Code condition={!this.props.isRoot}>
            {`this.props.pop()`};
          </Code>

          <Button 
            title='PopTo : 2'
            condition={this.props.index > 2}
            onPress={this._onPressPopTo.bind(this, 2)} 
          />

          <Code condition={this.props.index > 2}>
            {`this.props.popTo( index );`};
          </Code>

          <Button 
            condition={!this.props.isRoot}
            onPress={this._onPressPopToTop.bind(this)} 
            title='PopToTop'
          />

          <Code condition={!this.props.isRoot}>
            {`this.props.popToTop();`};
          </Code>

          <Hair />
          <Caption>Bar Controls</Caption>
          <Explain>Dynamically change bar, title, leftItem, rightItem, overlay, shadow</Explain>

          <Button
            title='setBarStyle'
            onPress={()=>{this.props.setBarStyle( {backgroundColor:'red'} )}}
          />

          <Code>{`this.props.setBarStyle( {backgroundColor:'red'} )`}</Code>

          <Button
            title='setTitleStyle'
            onPress={()=>{this.props.setTitleStyle( {color:'blue'} )}}
          />

          <Code>{`this.props.setTitleStyle( {color:'red'} )`}</Code>

          <Button
            title='setBarHidden'
            onPress={()=>{this.props.setBarHidden( !this.props.barHidden )}}
          />
          <Code>{`this.props.setBarHidden`}</Code>

          <Button
            title='setBarShadow'
            onPress={()=>{this.props.setBarShadow( !this.props.barShadow )}}
          />
          <Code>{`this.props.setBarShadow`}</Code>

          <Button
            title='setLeftItem'
            onPress={()=>{this.props.setLeftItem( <View style={{width:50,height:50, backgroundColor:'red'}} /> )}}
          />
          <Code>{`this.props.setLeftItem( ... )`}</Code>

          <Button
            onPress={()=>{this.props.setRightItem( <View style={{width:50,height:50, backgroundColor:'red'}} /> )}}
            title='setRightItem'
          />

          <Code>{`this.props.setRightItem( ... )`}</Code>

          <Button
            onPress={()=>{this.props.setTitle( 'Custom Title' )}}
            title='setTitle'
          />

          <Code>{`this.props.setTitle( 'Custom Title' )`}</Code>
          
          <Hair />
          <Caption>Advanced : Modal</Caption>
          <Explain>Scenes appear via modal</Explain>
          <Explain>Need to install react-native-absolute</Explain>

          <Button 
            onPress={this._onPressShowModal.bind(this)} 
            title='Show Modal'
          />

          <Button 
            onPress={this._onPressShowModalDimm.bind(this)} 
            title='Show Modal With Dimm'
          />

          <Button 
            onPress={this._onPressShowModalJustModalFade.bind(this)} 
            title='Show Modal just modal fade'
          />

          <Button 
            onPress={this._onPressShowModalTransitionFade.bind(this)} 
            title='Show Modal fade in/out'
          />

          <Button
            condition={!!this.props.modalId} 
            onPress={this._onPressHideModal.bind(this)} 
            title='Hide Modal'
          />

          <Button
            condition={!!this.props.modalId} 
            onPress={()=>Scenes.hideAllModal()} 
            title='Hide All Modal'
          />

        </ScrollView>

        {/*
        */}
        {this.state.showTreeView && (
          <ScrollView style={{maxHeight:200, backgroundColor:'#333'}}>
            <TreeView data={this}/>
          </ScrollView>
        )}
        
      </View>
    )
  }
}
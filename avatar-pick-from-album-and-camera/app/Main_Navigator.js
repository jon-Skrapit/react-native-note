import React, {Component} from 'react';
import {Navigator, Text} from 'react-native';
import MainComponent from './MainComponent';
export default class Main_Navigator extends React.Component{
	render(){
		let defaultName = 'MainComponent';
		let defaultComponent = MainComponent;
		return(
			<Navigator
				initialRoute={{ name: defaultName, component: defaultComponent }}
            	configureScene={(route) => {
                	return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
              	}}
            	renderScene={(route, navigator) => {
                let Component = route.component;
                return <Component {...route.params} navigator={navigator} />
              }}
			/>
		);
	}
};
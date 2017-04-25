import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, NativeModules} from 'react-native';
import {Container} from 'native-base';
import styles from './Styles.js';
import ImagePicker from 'react-native-image-crop-picker';

export default class MainComponent extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	image: null,
	  };
	}
	pickSingle(cropit, circular = false){
		ImagePicker.openPicker({
			cropping:true,
			width:300,
			hegith:300,
			cropping: cropit,
			cropperCircleOverlay: circular,
		}).then(image =>{
			this.setState({
        	image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
      		});
		});
	}
	renderImage(){
		if(this.state.image){
			return(
					<Image style={styles.icon} source={this.state.image}/>
				);
		}else{
			return(
					<Image style={styles.icon} source={require('./default.png')}/>
				);
		}
	}
	render(){
		return(
			<Container style={styles.container}>
				<View style={styles.user_info}>
					<TouchableOpacity onPress={() => this.pickSingle(true,true)}>
						{this.renderImage()}
					</TouchableOpacity>
					<View style={styles.name_and_email}>
						<Text>name</Text>
						<Text>example@xx.com</Text>
					</View>
				</View>
				<View style={styles.other_info}>
					<Text>2</Text>
				</View>
			</Container>
		);
	}
};
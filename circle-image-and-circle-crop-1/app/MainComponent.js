import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, NativeModules} from 'react-native';
import ModalBox from 'react-native-modalbox';
import {Container,Button} from 'native-base';
import styles from './Styles.js';
import ImagePicker from 'react-native-image-crop-picker';

export default class MainComponent extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	image: null,
	  };
	}
	pickSingleWithCamera(cropping){
		ImagePicker.openCamera({
			cropping:cropping,
			width:500,
			height:500,
		}).then(image =>{
			this.setState({
				image: {uri: image.path, width: image.width, height: image.height},
			});
		}).catch(e=>alert(e));
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
					<TouchableOpacity onPress={() => this.refs.modal.open()}>
						{this.renderImage()}
					</TouchableOpacity>
					<View style={styles.name_and_email}>
						<Text>name</Text>
						<Text>example@xx.com</Text>
					</View>
				</View>
				<View style={styles.other_info}>
					<Text></Text>
				</View>
				<ModalBox style={styles.modal} position={"bottom"} ref={"modal"}>
					<View>
						<Button style={native_base_styles.modal_button} onPress={() => this.pickSingle(true,true)}>
							<Text style={{color : 'white'}}>album</Text>
						</Button>
						<Button style={native_base_styles.modal_button} onPress={() => this.pickSingleWithCamera(true)}>
							<Text style={{color : 'white'}}>take a photo</Text>
						</Button>
						<Button style={native_base_styles.modal_button} onPress={() => this.refs.modal.close()}>
							<Text style={{color : 'white'}}>cancle</Text>
						</Button>	
					</View>
				</ModalBox>
			</Container>
		);
	}
};
native_base_styles={
  modal_button:{
    margin: 4,
    backgroundColor: "powderblue",
    color: "white",
    alignItems: 'center',
    justifyContent: 'center',
    width:200,
  },
};
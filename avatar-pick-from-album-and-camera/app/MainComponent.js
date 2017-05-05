import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, NativeModules} from 'react-native';
import ModalBox from 'react-native-modalbox';
import {Container,Button} from 'native-base';
import styles from './Styles.js';
import CameraView from './CameraView';
import AlbumView from './AlbumView';
export default class MainComponent extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	image: null,
	  };
	}
	renderImage(){
		if(this.state.image){
			console.log(this.state.image);
			return(
					<Image style={styles.icon} source={{uri:this.state.image}}/>
				);
		}else{
			return(
					<Image style={styles.icon} source={require('./default.png')}/>
				);
		}
	}
	pickSingle(){
		let _this = this;
		const {navigator} =this.props;
		if(navigator){
			navigator.push({
				name: 'AlbumView',
				component: AlbumView,
				params:{
					getPic(image){
						_this.setState({
							image:image
						})
					},
				}
			});
		}
	}
	pickSingleWithCamera(){
		let _this = this;
		const { navigator } = this.props;
		if(navigator){
			navigator.push({
				name: 'CameraView',
				component: CameraView,
				params:{
					getPic(image){
						_this.setState({
							image:image
						})
					},
				}
			});
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
    alignItems: 'center',
    justifyContent: 'center',
    width:200,
  },
};
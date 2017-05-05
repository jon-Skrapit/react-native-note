import React, {Component} from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  PixelRatio,
  CameraRoll,
} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import SquareImageCropper from './ImageEdit';
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

export default class CameraView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
    };
    Camera.checkVideoAuthorizationStatus().then(hasVideoAnthorization=>{
      this.setState({
        hasVideoAnthorization
      })
    }).catch(e=>{
      console.tron.log(e)
    })
  }
	render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[take]</Text>
        </Camera>
      </View>
    );
  }

  takePicture() {
    const options = {};
    const {navigator} = this.props;
    let _this = this;
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => {
        //console.log(data);
        CameraRoll.saveToCameraRoll(data.path).then((imageUri) => {
            if(navigator){
              navigator.replace({
              name: 'ImageCropper',
              component: SquareImageCropper,
              params:{
                imageUri: imageUri,
                getCropImg(CropImg){
                  if(_this.props.getPic){
                    _this.props.getPic(CropImg);
                  }
                },
              }
              });
            }
        });
        
      }).catch(err => console.error(err));
      // if(navigator){
      // 	navigator.pop();
      // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
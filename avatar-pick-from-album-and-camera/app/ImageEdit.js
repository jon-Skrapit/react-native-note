'use strict';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
import {
  CameraRoll,
  Image,
  ImageEditor,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
} from 'react-native';
import React, { Component } from 'react';
import Svg,{
    Circle,
    Rect,
    Defs,
    ClipPath,
} from 'react-native-svg';

type ImageOffset = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type ImageCropData = {
  offset: ImageOffset;
  size: ImageSize;
  displaySize?: ?ImageSize;
  resizeMode?: ?any;
};
export default class SquareImageCropper extends React.Component {
  state: any;
  _isMounted: boolean;
  _transformData: ImageCropData;

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      randomPhoto: null,
      measuredSize: null,
      croppedImageURI: null,
      cropError: null,
    };
    this._fetchRandomPhoto();
  }

  async _fetchRandomPhoto() {
    if(this.props.picFromAlbum){
      const data = await CameraRoll.getPhotos({first: 1});
      if (!this._isMounted) {
          return;
        }
      var edge = this.props.edge;
      var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          this.setState({randomPhoto});
        }
    }else{
        try {
        const data = await CameraRoll.getPhotos({first: 1});
        if (!this._isMounted) {
          return;
        }
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          this.setState({randomPhoto});
        }
      } catch (error) {
        console.warn("Can't get a photo from camera roll", error);
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (!this.state.measuredSize) {
      return (
        <View
          style={styles.container}
          onLayout={(event) => {
            var measuredWidth = event.nativeEvent.layout.width;
            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: measuredWidth},
            });
          }}
        />
      
      );
    }

    if (!this.state.croppedImageURI) {
      return this._renderImageCropper();
    }
    return this._renderCroppedImage();
  }

  _renderImageCropper() {
    if (!this.state.randomPhoto) {
      return (
        <View style={styles.container} />
      );
    }
    var error = null;
    if (this.state.cropError) {
      error = (
        <Text>{this.state.cropError.message}</Text>
      );
    }
    return (
    <View style={styles.container}>
        <Text>Drag the image within the square to crop:</Text>
        <ImageCropper
          image={this.state.randomPhoto}
          size={this.state.measuredSize}
          style={[styles.imageCropper, this.state.measuredSize]}
          onTransformDataChange={(data) => this._transformData = data}>
        </ImageCropper>
        <TouchableHighlight
          style={styles.cropButtonTouchable}
          onPress={this._crop.bind(this)}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>
              Crop
            </Text>
          </View>
        </TouchableHighlight>
        {error}
    </View>
    );
  }

  _renderCroppedImage() {
    return (
      <View style={styles.container}>
        <Text>Here is the cropped image:</Text>
        <Image
          source={{uri: this.state.croppedImageURI}}
          style={[styles.imageCropper, this.state.measuredSize]}>
        <Svg
              height={this.state.measuredSize.height}
              width={this.state.measuredSize.width}>
            <Defs>
                <ClipPath id="clip">
                    <Circle cx="50%" cy="50%" r="50%"/>
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                    />
                </ClipPath>
            </Defs>
            <Rect
            width="100%"
            height="100%"
            fillOpacity="0.5"
            clipPath="url(#clip)"
            clipRule="evenodd"
            />
        </Svg>
        </Image>
        
        <TouchableHighlight
          style={styles.cropButtonTouchable}
          onPress={this._reset.bind(this)}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>
              Try again
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _crop() {
    let _this=this;
    const {navigator} = _this.props;
    ImageEditor.cropImage(
      this.state.randomPhoto.uri,
      this._transformData,
      (croppedImageURI) => {
          _this.setState({croppedImageURI});
          _this.props.getCropImg(croppedImageURI);
          //navigator.pop();
      },
      (cropError) => this.setState({cropError})
    );
  }

  _reset() {
    this.setState({
      randomPhoto: null,
      croppedImageURI: null,
      cropError: null,
    });
    this._fetchRandomPhoto();
  }

}

class ImageCropper extends React.Component {
  _contentOffset: ImageOffset;
  _maximumZoomScale: number;
  _minimumZoomScale: number;
  _scaledImageSize: ImageSize;
  _horizontal: boolean;

  componentWillMount() {
    // Scale an image to the minimum size that is large enough to completely
    // fill the crop box.
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    this._horizontal = widthRatio > heightRatio;
    if (this._horizontal) {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.size.height,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.size.width,
        height: this.props.image.height / widthRatio,
      };
      if (Platform.OS === 'android') {
        // hack to work around Android ScrollView a) not supporting zoom, and
        // b) not supporting vertical scrolling when nested inside another
        // vertical ScrollView (which it is, when displayed inside UIExplorer)
        this._scaledImageSize.width *= 2;
        this._scaledImageSize.height *= 2;
        this._horizontal = true;
      }
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / 2,
      y: (this._scaledImageSize.height - this.props.size.height) / 2,
    };
    this._maximumZoomScale = Math.min(
      this.props.image.width / this._scaledImageSize.width,
      this.props.image.height / this._scaledImageSize.height
    );
    this._minimumZoomScale = Math.max(
      this.props.size.width / this._scaledImageSize.width,
      this.props.size.height / this._scaledImageSize.height
    );
    this._updateTransformData(
      this._contentOffset,
      this._scaledImageSize,
      this.props.size
    );
  }

  _onScroll(event) {
    this._updateTransformData(
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
      event.nativeEvent.layoutMeasurement
    );
  }

  _updateTransformData(offset, scaledImageSize, croppedImageSize) {
    var offsetRatioX = offset.x / scaledImageSize.width;
    var offsetRatioY = offset.y / scaledImageSize.height;
    var sizeRatioX = croppedImageSize.width / scaledImageSize.width;
    var sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    var cropData: ImageCropData = {
      offset: {
        x: this.props.image.width * offsetRatioX,
        y: this.props.image.height * offsetRatioY,
      },
      size: {
        width: this.props.image.width * sizeRatioX,
        height: this.props.image.height * sizeRatioY,
      },
    };
    this.props.onTransformDataChange && this.props.onTransformDataChange(cropData);
  }

  render() {
    return (
      <ScrollView
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={false}
        contentOffset={this._contentOffset}
        decelerationRate="fast"
        horizontal={this._horizontal}
        maximumZoomScale={this._maximumZoomScale}
        minimumZoomScale={this._minimumZoomScale}
        onMomentumScrollEnd={this._onScroll.bind(this)}
        onScrollEndDrag={this._onScroll.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={this.props.style}
        scrollEventThrottle={16}>
        
        <Image source={this.props.image} style={this._scaledImageSize}>
        </Image>
      </ScrollView>
    );
  }

}


var styles = StyleSheet.create({
  view:{
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    margin:30,
    overflow: 'hidden',
  },
  imageCropper: {
    marginTop: 12,
  },
  cropButtonTouchable: {
    marginTop: 12,
  },
  cropButton: {
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
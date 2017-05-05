import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  CameraRoll,
  ListView,
  TouchableHighlight,
} from 'react-native';
import SquareImageCropper from "./ImageEdit"
export default class AlbumView extends Component{
    //构造函数
    constructor(props) {
         super(props);
         this.state = {
             dataSource: new ListView.DataSource({
                 rowHasChanged: this._rowHasChanged
             }),
             loaded: false,
             assets: ([]),
         };
     }

     _rowHasChanged(r1, r2){
        if(r1!=r2) return true;
        return false;
     } 
     // componentDidMount在render之后执行，用户加载listview中使用的数据
     componentDidMount(){
         this.fetchData();
     }
     // 从cameraRoll中加载数据的函数
     fetchData() {
         // 定义如何从cameraRoll中取数据
         var fetchParams = {
            first: 6, // 每次取六张
            groupTypes: 'All',
            assetType: 'Photos'
        }
        // 如果不是第一次取图片，则this.state.lastCursor不为空，下一次取图片时就从上次的结尾开始取
        if(this.state.lastCursor){
            fetchParams.after = this.state.lastCursor;
        }
        var _this = this;
        CameraRoll.getPhotos(fetchParams)
        .then((data) => {
            this.setState({
                loaded:true,
            });
            this._appendAssets(data); // 取到图片数据后，交由appendAssets处理
        }).done();
     }
     _appendAssets(data){ 
         var assets = data.edges;
         var newState={};
         if(!data.page_info.has_next_page){ //已经到相册的末尾了
             newState.noMore = true;
         }
         if (assets.length > 0) { //如果此次加载的图片数量大于0
            newState.lastCursor = data.page_info.end_cursor;
            newState.assets = this.state.assets.concat(assets);
            newState.dataSource = this.state.dataSource.cloneWithRows(newState.assets);
        }
        this.setState(newState); 
     }
     render() { 
         // 如果还没有加载好，就返回loading界面
         if (!this.state.loaded) {
             return this.renderLoadingView();
         }
         // 如果加载好了，就返回listview界面
         return (
             <ListView
                 dataSource={this.state.dataSource}
                 renderRow={this.renderImage.bind(this)}
                 style={styles.listView}
                 onEndReached={this.onLoadMore.bind(this)} // 到listView 末尾会调用onLoadMore函数
             />
         );
     }
     // 返回loading界面
     renderLoadingView()
     {
         return (
            <View style={styles.container} >
                 <Text>Loading image......</Text>
             </View>

         );
     }
    // 返回每一行的图片
     renderImage(rowData, sectionID, rowID) {
         return (
             <View>
                 <TouchableHighlight onPress={() => this.crop_image(rowData)}>
                    <Image style={{width:100,height:100,margin:10,}} source={{uri:rowData.node.image.uri}}/>
                </TouchableHighlight>
            </View>
         );
     }
     
     onLoadMore(){
         if(!this.state.noMore){
            this.fetchData();
         }
     }

     crop_image(rowData){
         let _this = this;
		const {navigator} =this.props;
		if(navigator){
			navigator.push({
				name: 'SquareImageCropper',
				component: SquareImageCropper,
				params:{
                    picFromAlbum:true,
                    edge: rowData,
					getCropImg(image){
						_this.props.getPic(image);
					},
				}
			});
        }
     }
}
//样式定义
var styles = StyleSheet.create({
     container: {
         flex: 1,
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#F5FCFF',
     },
     listView:{
         marginTop: 30,
     },
     
 });
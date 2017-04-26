#circle-image-and-circle-crop1

使用https://github.com/ivpusic/react-native-image-crop-picker

完成用户头像圆形显示
可以选择图片，自由裁剪，裁剪框为圆形
使用modelbox，点击头像可以弹出菜单，可以选择相册，拍照，取消操作
但是目前拍照无法使用，是因为模拟器没有拍照功能吗

注意添加查看相册的权限、开启摄像头的权限

注意看https://github.com/ivpusic/react-native-image-crop-picker中的注意事项：
Click on project General tab
Under Deployment Info set Deployment Target to 8.0
Under Embedded Binaries click + and add RSKImageCropper.framework and QBImagePicker.framework

native-base中的样式不需要使用StyleSheet，注意
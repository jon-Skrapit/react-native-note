import {StyleSheet} from 'react-native';
export default styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  user_info:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'powderblue',
    justifyContent:'center',
    alignItems:'center'
  },
  name_and_email:{
    marginLeft:10
  },
  other_info:{
    flex:3,
  },
  icon:{
    width:100,
    height:100,
    borderRadius:50,
  },
  text:{
    color: "black",
    fontSize:22,
  },
  modal:{
    justifyContent: 'center',
    alignItems: 'center',
    height:200,
    flexDirection: 'column',
    width:300,
  },
});
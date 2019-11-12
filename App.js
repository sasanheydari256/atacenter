import React, {Component} from 'react';
import { View,Dimensions,StatusBar,I18nManager } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { YellowBox } from 'react-native';
import { connect , Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeMaker from './redux/store';
import RNRestart from "react-native-restart";

import Menu from "./components/menu";
import Login from "./components/login/login";
import Splash from "./components/login/splash";
import Main from "./components/main/main";
import Log from "./components/main/log";
import about from "./components/main/about";
import historyMyService from "./components/main/historyMyService";
import ActiveRequest from "./components/main/activeRequest";

import { lang as langs } from "./lang";
import R from "reactotron-react-native";
if(__DEV__) {
  import('./ReactotronConfig').then(() => {})
}

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader',
  'Module RNFetchBlob requires main queue setup',
]);
console.disableYellowBox = false;

EStyleSheet.build({
  $rem:Dimensions.get("window").width/380,
  // $outline: 1,
  $font:"IRANSansMobile",
  $grayColor:"#576d83",
  $lightGrayColor:"#b9c5d3",
  $lightBlueColor:"#4ba7fd",
  $violetColor:"#504de4"
});

const mainStack = createStackNavigator({
  Splash,
  Login,
  Main,
  Log,
  about,
  ActiveRequest
},{
  defaultNavigationOptions: {
    header:null
  }
})

const Drawer  = createDrawerNavigator({
  mainStack:{
    screen:mainStack,
    navigationOptions:{
      drawerLabel:"اطا"
    }
  },
    about:{
    screen:about,
      navigationOptions:{
      drawerLabel:"درباره ما"
      }
    },
      historyMyService:{
      screen:historyMyService,
        navigationOptions:{
        drawerLabel:"تاریخچه خدمات"
        }
      }
      ,
        darkhast:{
        screen:ActiveRequest,
          navigationOptions:{
          drawerLabel:"darkjast ha"
          }
        }

},{
  drawerPosition:"right",
  contentComponent:Menu,
  drawerLockMode: 'locked-closed',
});

const Stack = createStackNavigator({
  Drawer,
},{
  defaultNavigationOptions: {
    header:null
  },
})

const Router = connect()(createAppContainer(Stack))
const store = storeMaker();

export default class App extends Component{
  componentDidMount = async ()=> {
    try {
        const lang  = await AsyncStorage.getItem("lang")
        const isRTL = await AsyncStorage.getItem("isRTL")

        if(lang === null){
          await AsyncStorage.setItem("lang","fa");
          await AsyncStorage.setItem("isRTL","true");
        }

        const language = await langs()
        if(language.isRTL && isRTL !== "true"){
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }
    } catch (e) {

    }

    setInterval(async ()=>{
      // const requests = store.store.getState().tempState.requests
      // if(requests.length>0){
      //   const isConnected = await checkInternetConnection();
      //   if(isConnected){
      //     requests[0]();
      //     store.store.dispatch(removeTempStateRequest());
      //   }
      // }
    },1000)
  }
  render() {
    return (

        <View style={{ flex:1,backgroundColor:"white" }}>
          <StatusBar translucent={false}/>
          <Provider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
              <Router/>
            </PersistGate>
          </Provider>
        </View>

    );
  }
}
export const myStore = store.store

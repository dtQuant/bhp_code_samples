<script src="http://localhost:8097"></script>
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TouchableHighlight, FlatList, List, ActivityIndicator, Dimensions, AppRegistry, ScrollView, Animated, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, ListItem, Avatar, AvatarIcon, Header, Icon } from 'react-native-elements';
import { createStackNavigator, createAppContainer, createBottomTabNavigator, createSwitchNavigator } from "react-navigation";
// import Constants from 'expo-constants'
import {
  Constants,
} from 'react-native-unimodules';
import MapView, { Marker, ProviderPropType, Callout, CalloutSubview } from 'react-native-maps';
// import CalloutBubble from '../components/callout';
import Geolocation from 'react-native-geolocation-service';
// import AnimatedViews from '../components/AnimatedViews';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.3122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CARD_HEIGHT = height / 8;
const CARD_WIDTH = CARD_HEIGHT ;

// import Geolocation from 'react-native-geolocation-service';

import HomeScreen from './screens/HomeScreen'
import LeaderBoardScreen from './screens/LeaderBoardScreen'
import BreweryDetailScreen from './screens/BreweryDetailScreen'
import BrewListScreen from './screens/BrewListScreen'
import BrewMapScreen from './screens/BrewMapScreen'
// import DetailsScreen from './screens/DetailsScreen'
// import LoginScreen from './screens/LoginScreen'
import NewsDetailScreen from './screens/NewsDetailScreen'
import NewsListScreen from './screens/NewsListScreen'
import SubscribeScreen from './screens/SubscribeScreen'
import SubscribeWebView from './screens/SubscribeWebView'
// import Test2Page from './screens/Test2Page'
// import TestComponent from './screens/TestComponent'
// import Test2Component from './screens/Test2Component'
// import RedeemCodeScreen from './screens/RedeemCodeScreen'
// import Test3 from './screens/Test3'
import MyAccountScreen from './screens/MyAccountScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import SignInScreen from './screens/SignInScreen'
import ActivityFeedScreen from './screens/ActivityFeedScreen';
import FBLoginScreen from './screens/FBLoginScreen';
// import GoogLogTest from './screens/GoogLogTest';
import TopRedeem from './screens/TopRedeem';
import ResetPWScreen from './screens/ResetPWScreen';
import ProfilePicScreen from './screens/ProfilePicScreen';
import FAQWebView from './screens/FAQWebView';
import AboutUsWebView from './screens/AboutUsWebView';
import PrivacyWebView from './screens/PrivacyWebView';
import RedeemCodeTestScreen from './screens/RedeemCodeTestScreen';
import PhotoWallScreen from './screens/PhotoWallScreen';
import EventDetailsScreen from './screens/EventDetailScreen';
import HowItWorksScreen from './screens/HowItWorksScreen';
import TutorialVideoScreen from './screens/TutorialVideoScreen';
import SupportScreen from './screens/SupportScreen';
import WebAccountmanage from './screens/WebAccountManage';
import ResetPWMidScreen from './screens/ResetPWMidScreen';





const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});


// const AppStack = createStackNavigator({ AccountHome: {screen: MyAccountScreen, navigationOptions: {header: null}} });
// const AuthStack = createStackNavigator(
//   { 
//     SignIn: {screen: SignInScreen, navigationOptions: {header: null}} 
//   }
//   );

// const RedeemCodeStack = createStackNavigator(
//   {
//     RedeemCode: {screen: RedeemCodeScreen, navigationOptions: {header:null}}
//   }
// )
const MyAcctSwitch = createSwitchNavigator(
  {
    AuthLoading: {screen: AuthLoadingScreen, navigationOptions: {header: null}},
    App: {screen: MyAccountScreen, navigationOptions: {header: null}},
    Auth: {screen: SignInScreen, navigationOptions: {header: null}},
    PWScreenReset: {screen: ResetPWScreen, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

// const StackSwitch = createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStack,
//     Auth: AuthStack,
//   },
//   {
//   initialRouteName: 'AuthLoading',
//   }
// );

const AppNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen, navigationOptions: {header: null}},
    Redeem: {screen: RedeemCodeTestScreen, navigationOptions: {header: null}},
    // Details: DetailsScreen,
    BrewMap: {screen: BrewMapScreen, navigationOptions: {header: null}},
    // SP: Test2Page, 
    NewsList: {screen: NewsListScreen, navigationOptions: {header: null}},
    Activity: {screen: ActivityFeedScreen, navigationOptions: {header: null}},
    HowItWorks: {screen: HowItWorksScreen, navigationOptions: {header: null}},
    TutorialVideo:  {screen: TutorialVideoScreen, navigationOptions: {header: null}},
    // Locations: BrewListScreen,
    // Login: LoginScreen,
    // Brewery: BreweryViewScreen,
    SubscribeIntro: {screen: SubscribeScreen, navigationOptions: {header: null}},
    BrewDeets: {screen: BreweryDetailScreen, navigationOptions: {header: null}},
    Support: {screen: SupportScreen, navigationOptions: {header: null}},
    // DT: BrewMapScreenOrig,
    // ReactMap: TestReactMapsEx,
    NewsDeets: {screen: NewsDetailScreen, navigationOptions: {header: null}},
    Subscribe: {screen: SubscribeWebView, navigationOptions: {header: null}},
    // Test: TestComponent,
    // Test2: Test2Component,
    PhotoWall: {screen: PhotoWallScreen, navigationOptions: {header: null}},
    // Redeem: {screen: RedeemCodeScreen, navigationOptions: {header: null}},
    // Test3: Test3,
    MyAccount: {screen: MyAcctSwitch, navigationOptions: {header: null}},
    LeaderBoard: LeaderBoardScreen,
    FBLogin: FBLoginScreen,
    // GoogTest: GoogLogTest,
    TopRedeem: TopRedeem,
    FAQScreen: {screen: FAQWebView, navigationOptions: {header: null}},
    AboutUsScreen: {screen: AboutUsWebView, navigationOptions: {header: null}},
    ManageAccount: {screen: WebAccountmanage, navigationOptions: {header: null}},
    PrivacyScreen: {screen: PrivacyWebView, navigationOptions: {header: null}},
    // RideView: RideViewScreen,
    // NumPad: NumPadTest
    ResetPWMid: ResetPWMidScreen,
    ResetPW: ResetPWScreen,
    ProfilePic: ProfilePicScreen,
    EventDeets: {screen: EventDetailsScreen, navigationOptions: {header: null}},
    // HomeScreenScroll: HomeScreenScroll,
    // MyAccount2:{screen: AuthLoadingScreen, navigationOptions: {header: null, resetOnBlur: true,}},
    // MyAccount3:{ screen: AuthLoadingScreen, navigationOptions: {header: null, resetOnBlur: true,}}
  },
  {
    initialRouteName: "Home",
   
  },
  
);

const HomeNav = createStackNavigator(
  {
    
    Home: HomeScreen,
  },
  {
  
    initialRouteName: "Home",
  },
  
);

const AppNavLocations = createStackNavigator(
  {
    
    Locations: {screen: BrewListScreen, navigationOptions: {header: null}},
    BrewDeets: {screen: BreweryDetailScreen, navigationOptions: {header: null}},
  },
  {
    initialRouteName: "Locations",
  },
  
);

const AppNavMap = createStackNavigator(
  {
    BrewMap: {screen: BrewMapScreen, navigationOptions: {header: null}},
    BrewDeets: {screen: BreweryDetailScreen, navigationOptions: {header: null}},
  },
  {
    initialRouteName: "BrewMap",
  },
  
);

// const AppNavMyAccount = createStackNavigator(
//   {
    
//     Details: DetailsScreen,
//     MyAccount: MyAccountScreen
//   },
//   {
//     initialRouteName: "MyAccount",
//   },
  
// );

// const AppStack = createStackNavigator({ AccountHome: MyAccountScreen });
// const AuthStack = createStackNavigator({ SignIn: SignInScreen });

// const MyAcctSwitch = createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStack,
//     Auth: AuthStack,
//   },
//   {
//     initialRouteName: 'AuthLoading',
//   }
// );

const BottomNav = createBottomTabNavigator(
  {
    Home: AppNavigator, 
    Locations: AppNavLocations,
    Maps: AppNavMap,
    'My Account': MyAcctSwitch,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return (
            <Image
            source={ require('./assets/images/homeIcon.png') }
            style={{ width: wp('15%'), height: hp('4.75%'), resizeMode: 'contain'}} />
          );
        } else 
          if (routeName === 'Locations') {
          return (
            <Image
              source={ require('./assets/images/glassIcon.jpg') }
              style={{ width: wp('15%'), height: hp('4%'), resizeMode: 'contain'}} />
          );
        } else 
        if (routeName === 'Maps') {
        return (
          <Image
            source={ require('./assets/images/mapIcon.png') }
            style={{ width: wp('15%'), height: hp('4%'), resizeMode: 'contain' }} />
        );
      } else 
      if (routeName === 'My Account') {
      return (
        <Image
          source={ require('./assets/images/myAccountIcon.png') }
          style={{ width: wp('15%'), height: hp('4%'), resizeMode: 'contain' }} />
      );
    } 

      },
    }),
    resetOnBlur: true,
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'black',
      style:{backgroundColor: '#f4ad07', height: hp('8%'), fontSize: hp('2.75%')},
      labelStyle: {fontSize: hp('2%'), fontWeight:'bold'},
      keyboardHidesTabBar: true
    },
  }
);
// const bottomTabNavigator = createBottomTabNavigator({
//   Home: {screen: AppNavigator}, 
//   Locations: {screen: AppNavigator},
//   Maps: {screen: AppNavigator},
//   MyAccount: {screen: AppNavigator},
// },{order: ['Home', 'Location', 'Maps', 'MyAccount'],
// animationEnabled: true,
// keyLocation: 'Home'
// // })

const AppContainer = createAppContainer(BottomNav);

// const codePushOptions = {
//   checkFrequency: 
// }
class App extends React.Component {
  constructor(properties) {
    super(properties);
    OneSignal.init("ec943097-282e-4065-90bb-b39651a5167a");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }
  
  codePushStatusDidChange(status) {
    switch(status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log("Checking for updates.");
            break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log("Downloading package.");
            break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log("Installing update.");
            break;
        case codePush.SyncStatus.UP_TO_DATE:
            console.log("Up-to-date.");
            break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
            console.log("Update installed.");
            break;
    }
}

codePushDownloadDidProgress(progress) {
    console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
}


  render() {
    return <AppContainer />;
  }
}

export default codePush(App);
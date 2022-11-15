import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TouchableHighlight, FlatList, List, ActivityIndicator, Dimensions, AppRegistry, ScrollView, Animated, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Button, ListItem, Avatar, AvatarIcon, Header, Icon } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";
// import Constants from 'expo-constants'
import {
  Constants,
} from 'react-native-unimodules';
// import MapView, { Marker, ProviderPropType, Callout, CalloutSubview } from 'react-native-maps';
// import CalloutBubble from './components/callout';
import Geolocation from 'react-native-geolocation-service';
// import AnimatedViews from './components/AnimatedViews';
import renderIf from '../components/RenderIf';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.3122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CARD_HEIGHT = height / 8;
const CARD_WIDTH = CARD_HEIGHT ;

export default class LeaderBoardScreen extends Component {
    static navigationOptions = {
      header: null
      };
  
      constructor(props) {
        super(props);
    
        this.state = {
          isLoading: true,
          data: [], 
        };
      }

      getLeaderboard = () => {
       
        fetch('http://67.225.204.188/app/dev/leaderboardPullApi.php',
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
          }
          })
          .then(res => res.json())
          .then(myJson => {
            // var results={results:myJson};
            // console.log(results);
            console.log(myJson)
            console.log()
            // var myJsonString=JSON.parse(myJsonString);
            // console.log(myJsonString);
            this.setState({
              data: myJson,
              isLoading: false,
            }, ()=> console.log(this.state.data));
          })
          .catch(err => console.log(err));
      };

      checkForIncognito = async () => {
        let isIncog = await AsyncStorage.getItem('isIncognito');
        this.setState({
          isIcognito: isIncog
        })
      }

      checkForLoginStatus = async() => {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          this.setState({
            isLoggedIn: true
          })
        } else {
          this.setState({
            isLoggedIn: false
          })
        }
    }

    sendEmail = () => {
      Linking.openURL('mailto:info@brewhoppass.com') 
      }
  
    setModalVisible() {
      this.setState({modalVisible: true});
    }
  
    setModalInvisible() {
      this.setState({modalVisible: false});
    }
  
      componentDidMount() {
      
        this.focusListener = this.props.navigation.addListener("willFocus", () => {
          {this.checkForLoginStatus(); this.getLeaderboard(); this.checkForIncognito();}
    });
  }




      
    render(){
      if (this.state.isLoading) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ActivityIndicator size='large' color='#f4ad07' />
          </View>
        );
      } else {
        return (
            <View style={{height: '100%'}}>
    <Modal style={{margin: 2}}
          animationIn="slideInLeft"
          animationInTiming={100}
          animationOut="slideOutRight"
          animationInTiming={50}
          transparent={true}
          isVisible={this.state.modalVisible}
          onBackdropPress={() => {this.setModalInvisible()}}
          onBackButtonPress={() => {this.setModalInvisible()}}>
          <View style={{height: hp('95%'), width:'75%', backgroundColor: 'black', opacity: .9}}>
            <View>
            <View style={{width: '100%', height: hp('6%'), flexDirection: 'row'}}>
            <Icon
              containerStyle={{ position: 'absolute', right: 0}}
              name='window-close'
              type='font-awesome'
              color='#f4ad07'
              size = {hp('5%')}
              onPress={() => {this.setModalInvisible()}} 
              />
            </View>
              <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
              onPress={()=>{this.setModalInvisible(); this.props.navigation.navigate('FAQScreen')}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>FAQ</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                  <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
            onPress={()=>{this.setModalInvisible(); this.props.navigation.navigate('AboutUsScreen')}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>About Us</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
              onPress={()=>{this.setModalInvisible(); this.props.navigation.navigate('Support')}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Feedback & Support</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity>
            
            {/* <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>My Notifications</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                  <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity> */}
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
            onPress={()=>{this.setModalInvisible(); this.props.navigation.navigate('PrivacyScreen')}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Privacy Policy & Terms</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                  <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
            onPress={()=>{this.setModalInvisible(); this.props.navigation.navigate('HowItWorks')}}>
                <View style={{width: '90%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Tutorial</Text>
                </View>
                <View style={{width: '10%', justifyContent:'center'}}>
                  <Icon
                  name='chevron-right'
                  color='#f4ad07'
                  size = {hp('5%')}
                  />
                </View>
            </TouchableOpacity>
            </View>
            {renderIf (this.state.isLoggedIn, 
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderTopColor: '#f4ad07', borderBottomWidth: 2, borderTopWidth: 2, position: 'absolute', bottom: 0}}
            onPress={() => {this.setModalInvisible(); this.updateIdLogout()}}>
                <View style={{width: '80%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Log Out</Text>
                </View>
                <View style={{width: '20%'}}></View>
            </TouchableOpacity>
            )}
            {renderIf (!this.state.isLoggedIn, 
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderTopColor: '#f4ad07', borderBottomWidth: 2, borderTopWidth: 2, position: 'absolute', bottom: 0}}
            onPress={() => this.props.navigation.navigate('My Account')}>
                <View style={{width: '80%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Log In</Text>
                </View>
                <View style={{width: '20%'}}></View>
            </TouchableOpacity>
            )}
          </View>
   </Modal>
   
            <View style={{height: '19%'}}>
            {renderIf(this.state.passType !=="free" && this.state.isLoggedIn,
                  <Header
                    containerStyle={{
                    backgroundColor: 'black',
                    height: '100%',
                    paddingBottom: 10,
                    paddingTop: 8
                  }}
                  leftComponent={{ icon: 'menu', color: '#fff', size: 50, 
                  onPress: () => this.setModalVisible(),
                }}
                  // ========================================================================================================
                                    // COMMENTED OUT IN CASE THEY WANT PIC ON HOME SCREEN TOO--NOTES FROM 10/3
                  // =======================================================================================================
                  // leftComponent={ 
                  //           <TouchableOpacity style={{height: 80, width: 80, borderRadius: 40, overflow: 'hidden'}}
                  //           onPress={() => this.setModalVisible()}>
                  //           <Image
                  //             style={{
                              
                  //               height: 80,
                  //               width: 80,
                  //               borderWidth: 1,
                  //               borderRadius: 40
                  //             }}
                  //           source={this.state.avatarSource}
                  //           resizeMode="cover"
                  //   />
                  //   </TouchableOpacity>}

                // ==================================================================================================================

                  centerComponent= {<Image
                  style={{width: wp('20%'), height: hp('13.5%'), padding: 20}}
                  source={require('../assets/images/brew-hop-logo.png')}
                  />}
                  rightComponent={ <Button
                    buttonStyle={{width: wp('25%'), backgroundColor: '#f4ad07', height: hp('7%')}}
                    title="REDEEM"
                    titleStyle={{color: 'black', fontSize: hp('2.25%'), fontWeight: 'bold'}}
                    onPress= {() => this.props.navigation.navigate('Redeem', {brewGUID: this.state.devId, userGUID: this.state.userGUID})}
                  />}
                  />
                  )}
            {renderIf(this.state.passType ==="free" || !this.state.isLoggedIn,
                  <Header
                  containerStyle={{
                  backgroundColor: 'black',
                  height: '100%',
                  paddingBottom: 10,
                  paddingTop: 8
                }}
                leftComponent={{ icon: 'menu', color: '#fff', size: 50, 
                onPress: () => this.setModalVisible(),
                }}
                // ========================================================================================================
                                  // COMMENTED OUT IN CASE THEY WANT PIC ON HOME SCREEN TOO--NOTES FROM 10/3
                // =======================================================================================================
                // leftComponent={ 
                //           <TouchableOpacity style={{height: 80, width: 80, borderRadius: 40, overflow: 'hidden'}}
                //           onPress={() => this.setModalVisible()}>
                //           <Image
                //             style={{
                            
                //               height: 80,
                //               width: 80,
                //               borderWidth: 1,
                //               borderRadius: 40
                //             }}
                //           source={this.state.avatarSource}
                //           resizeMode="cover"
                //   />
                //   </TouchableOpacity>}

                // ==================================================================================================================

                centerComponent= {<Image
                style={{width: wp('20%'), height: hp('13%'), padding: 20}}
                source={require('../assets/images/brew-hop-logo.png')}
                />}
                rightComponent={ <Button
                  buttonStyle={{width: wp('25%'), backgroundColor: 'grey', height: hp('7%')}}
                  title="Log In To Redeem"
                  titleStyle={{color: 'black', fontSize: hp('2.25%'), fontWeight: 'bold'}}
                  onPress={() => this.props.navigation.navigate('My Account')}
                />}
                />
                )}
            </View>
           <View style={{height: '14%'}}>
              <Header
              containerStyle={{
              backgroundColor: '#f4ad07',
              height: '100%',
              paddingBottom: 20,
              justifyContent: 'center'
              }}
              centerContainerStyle={{height: '100%', position: 'absolute', top: 0}}
              leftComponent={{ }}
              centerComponent={
              <View style={{}}>
              <Icon
                name='trophy'
                type='font-awesome'
                color='black'
                size = {60}
              />
              <Text style={{fontSize: hp('3%'), color: 'black', fontWeight: 'bold'}}>Leaderboard</Text>
              </View>
            }
              // centerComponent= {{Icon: 'home', color: '#fff', size: 50, }}

              />
            </View>
            <View style={{width: '100%', height:'60%'}}>
                  <FlatList
                  data={this.state.data}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item }) => 
                  <View style={{width: '100%', height: hp('8%'), borderBottomColor:'black', borderBottomWidth: 1, flexDirection:'row'}}>

                    <View style={{width: '80%', justifyContent: 'center', alignContent: 'center'}}>
                      <Text style={{marginLeft: 3, fontWeight: '600', fontSize: hp('2.5%')}}>{item.userFname} {item.userLInit}</Text>
                    </View>
                    <View style={{width: '20%', justifyContent: 'center', alignContent: 'center', borderLeftColor: '#ececeb', borderLeftWidth: 1}}>
                      <Text  style={{alignSelf: 'center', fontSize: hp('2%'), fontWeight: '300'}}>{item.redCount * 12} points</Text>
                    </View>
                    </View>}
                  /> 
                
            </View>
            </View>
        )
    }
  }
};



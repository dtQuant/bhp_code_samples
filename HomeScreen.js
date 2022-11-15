import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Linking, TouchableHighlight, FlatList, List, ActivityIndicator, Dimensions, AppRegistry, ScrollView, Animated, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, ListItem, Avatar, AvatarIcon, Header, Icon } from 'react-native-elements';
import { createStackNavigator, createAppContainer, BottomTabBar } from "react-navigation";
// import Constants from 'expo-constants'
import {
  Constants,
} from 'react-native-unimodules';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import renderIf from '../components/RenderIf';
import {PermissionsAndroid} from 'react-native';
import Modal from "react-native-modal";



let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.3122;  
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CARD_HEIGHT = height / 8;
const CARD_WIDTH = CARD_HEIGHT ;

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Brew Hop Pass Needs Location Permission',
        message:
          'Location permission needed for this app' +
          'Pleae allow use',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the maps functionality');
    } else {
      console.log('Location Permission Denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

class HomeScreen extends Component { 
  static navigationOptions = {
      
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };

    constructor(props) {
      super(props);
  
      this.state = {
        isLoading: true,
        data: [], 
        modalVisible: false,
      };
    }

async componentWillMount() {
  await requestLocationPermission()
    } 
  
    componentDidMount(){
      const { navigation } = this.props;
      this.focusListener = this.props.navigation.addListener("willFocus", () => {
        {this.checkForIncognito(); this.checkStorageForUser(); this.checkPhotoStorage(); this.getUserInfo();}
  });
  }

  getUserInfo = () => {
    //Getting the Unique Id from here
    var deviceID = DeviceInfo.getUniqueID();
    var deviceID2 = Constants.deviceId;
    // this.setState({ deviceId: id, });
      fetch('http://67.225.204.188/app/dev/onLoad.php?brewGUID=' + deviceID, {
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        }
        })
        .then(res => res.json())
        .then(myJson => {
            this.setState({
                userGUID: myJson[0].userGUID,
                passType: myJson[0].userPassType,
                devId: deviceID,
                isLoading: false
              });
          // var results={results:myJson};
          // console.log(results);
          console.log(myJson)
          console.log(deviceID2)
          console.log(deviceID)
         
          console.log(this.state.passType)
          console.log(this.state.devId)
          console.log(this.state.userGUID)
          // var myJsonString=JSON.parse(myJson);
          // console.log(myJsonString);
        // AsyncStorage.setItem('accountData', this.state.userData)
        // console.log(accountData)
        })
        .catch(err => console.log(err));
    };

  checkStorageForUser = async() => {
      const userToken = await AsyncStorage.getItem('userToken');
        if(userToken) {
      this.setState({
        userLoggedIn: true
      })
    } else {
      this.setState({
        userLoggedIn: false
      })
    }
    }

  // updateIdLogout = async () =>{
  // try {
  //     let value = await AsyncStorage.getItem('userEmail');
  //     // let deviceID = DeviceInfo.getUniqueID();
  //     let response = await fetch('https://www.brewhoppass.com/app/dev/idUpdate.php', {
  //       method: 'POST',
  //       headers: {
  //       "Accept": "*/*",
  //         "Content-Type": "application/json",
  //         'Cache-Control': 'no-cache',
  //       },
  //       body: JSON.stringify({
  //           userEmail: value,
  //       })
  //     });
  //     let res = await response.json();
  //     console.log(res)
  //     this.setState({
  //     updateStatus: res,
  //     }, ()=> this.signOutAsync())
  //       } 
  //       catch(error) {
  //           console.log(error);
// }
  //       }
  //   };

  sendEmail = () => {
    Linking.openURL('mailto:info@brewhoppass.com') 
    }

  setModalVisible() {
    this.setState({modalVisible: true});
  }

  setModalInvisible() {
    this.setState({modalVisible: false});
  }

  checkPhotoStorage = async () => {
    let photoData = await AsyncStorage.getItem('profilePic64');
    if(photoData !== null) {
    let photoSource = {uri: 'data:image/jpeg;base64,' + photoData};
    this.setState({
      avatarSource: photoSource
    })
  }
  };

  checkForIncognito = async () => {
    let isIncog = await AsyncStorage.getItem('isIncognito');
    console.log(JSON.parse(isIncog));
    console.log("hello there incognito")
    this.setState({
      isIncognito: JSON.parse(isIncog)
    })
  }

  updateIdLogout = async () =>{
    try {
        let value = await AsyncStorage.getItem('userEmail');
        // let deviceID = DeviceInfo.getUniqueID();
        let response = await fetch('https://www.brewhoppass.com/app/dev/idUpdate.php', {
          method: 'POST',
          headers: {
          "Accept": "*/*",
            "Content-Type": "application/json",
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
              userEmail: value,
          })
        });
        let res = await response.json();
        console.log(res)
        this.setState({
        updateStatus: res,
        }, ()=> this.signOutAsync())
          } 
          catch(error) {
              console.log(error);
          }
      };
  
  signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
      alert("You Have Logged Out")
      };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }


  render() {
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
    <View style={{height: '100%', backgroundColor: 'black', paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 0}} >
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
            <TouchableOpacity style={{width: '100%', height: hp('8%S'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderBottomWidth: 2}}
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
            {renderIf (this.state.userLoggedIn, 
            <TouchableOpacity style={{width: '100%', height: hp('8%'), flexDirection: 'row', borderBottomColor: '#f4ad07', borderTopColor: '#f4ad07', borderBottomWidth: 2, borderTopWidth: 2, position: 'absolute', bottom: 0}}
            onPress={() => {this.setModalInvisible(); this.updateIdLogout()}}>
                <View style={{width: '80%', justifyContent: 'center'}}>
                  <Text style={{color: '#f4ad07', fontSize: hp('3%'), fontWeight: 'bold'}}>Log Out</Text>
                </View>
                <View style={{width: '20%'}}></View>
            </TouchableOpacity>
            )}
            {renderIf (!this.state.userLoggedIn, 
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
  
  {renderIf(this.state.userLoggedIn === false, 
    <View style={{height: '100%'}}>
      <View style={{height: '20%'}}>
        <Header
          containerStyle={{
          backgroundColor: 'black',
          height: '100%',
          paddingBottom: 25
        }}
        leftComponent={{ icon: 'menu', color: '#fff', size: 50, 
        onPress: () => this.setModalVisible()
      }}
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
        </View>
     
      <View style={{height: '80%', width: '100%'}}>
      <ScrollView>
      <View style={{backgroundColor: 'black', height: hp('25%')}}>
      <TouchableOpacity style= {{width: '100%', paddingTop: 5, paddingBottom: 10}}
       onPress={() => this.props.navigation.navigate('BrewMap')}>
          <Image style={{width: '100%', height: "100%"}}
                        source={require('../assets/images/brewPass-googleBackground-01.png')
            }
            />
          <View style={styles.absoluteViewMaps}>
            <Text style={styles.mapsNearbyText}>MAPS + NEARBY</Text>
          </View>

      </TouchableOpacity>
       </View>     
    
      <View style={{width: '100%', flexDirection: 'row', backgroundColor: 'black', height: hp('25%'), paddingBottom: 10, justifyContent: 'space-between'}}>

    {/* <TouchableOpacity style= {{width: '49%', height: '100%', }} 
      onPress={() => this.props.navigation.navigate('PhotoWall')}
    >
    <Image style={{width: '100%', height: '100%'}}
      source={
        require('../assets/images/beer-fest.jpg')
      }
    />
    <View style={styles.absoluteViewMyPass}>
      <Text style={styles.myPassTextHome}>PHOTO WALL</Text>
    </View>
  </TouchableOpacity> */}
   <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('HowItWorks')}>
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/brewNews.jpg')
                }
              />
              <View style={styles.absoluteViewMyPass}>
                {/* <Text style={styles.myPassTextHome}>NEWS + EVENTS</Text> */}
                <Text style={styles.myPassTextHome}>HOW IT WORKS</Text>
              </View>
    </TouchableOpacity>

  <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('Activity')}>
    <Image style={{width: '100%', height: '100%' }}
      source={
        require('../assets/images/topRatedCheers.jpg')
      }
    />
    <View style={styles.absoluteViewMyPass}>
      <Text style={styles.myPassTextHome}>ACTIVITY FEED</Text>
    </View>
  </TouchableOpacity>

  </View>


        <View style={{width: '100%', flexDirection: 'row', backgroundColor: 'black', height: hp('25%'), paddingBottom: 10, justifyContent: 'space-between'}}>
          
            <TouchableOpacity style= {{width: '49%', height: '100%', }} 
              onPress={() => this.props.navigation.navigate('PhotoWall')}
            >
            <Image style={{width: '100%', height: '100%'}}
              source={
                require('../assets/images/beer-fest.jpg')
              }
            />
            <View style={styles.absoluteViewMyPass}>
              <Text style={styles.myPassTextHome}>PHOTO WALL</Text>
            </View>
          </TouchableOpacity>
            
          <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('TopRedeem')}>
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/reviewPic.jpg')
                }   
              />
              <View style={styles.absoluteViewMyPass}>
                <Text style={styles.myPassTextHome}>TOP CHECKINS</Text>
              </View>
          </TouchableOpacity>
        </View>
        
        <View style={{backgroundColor: 'black', height: hp('25%')}}>
      <TouchableOpacity style= {{width: '100%', paddingTop: 5, paddingBottom: 10}}
       onPress={() => this.props.navigation.navigate('My Account')}>
          <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/myPassPic.jpg')
                }
              />
          <View style={styles.absoluteViewMaps}>
            <Text style={styles.mapsNearbyText}>MY ACCOUNT</Text>
          </View>

      </TouchableOpacity>
       </View>
    
    {/* <View style= {{width: '100%', flexDirection: 'row', height: '10%', backgroundColor: 'white', position: 'absolute', bottom: 0}}>
      <View style= {{width: '50%', alignItems: 'center'}}>
      <Text style={{alignSelf: 'center', color: 'black', fontWeight: 'bold', fontSize: 15, paddingLeft: 10, textAlign: 'center',}}>We notice that you don't yet have a pass or need to login.</Text>
      </View>
      <View style= {{width: '50%', alignItems: 'center'}}>
      <Button
      onPress={() => this.props.navigation.navigate('My Account')}
      buttonStyle={{backgroundColor: 'black', width: 150, alignContent: 'space-around', height: 50, flexWrap: 'wrap', paddingTop: 20, paddingBottom: 20}}
      titleStyle = {{fontSize: hp('2.5%'), alignSelf: 'center'}}
      title="Subscribe or Login"
      />
      </View>
    </View> */}

     
    </ScrollView>
    <View style= {{postition: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', height: hp('13%'), backgroundColor: 'white', marginBottom: 10}}>
<View style= {{width: '50%', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}>
  <Text style={{alignSelf: 'center', color: 'black', fontWeight: 'bold', fontSize: 15, paddingLeft: 10, textAlign: 'center',}}>We notice that you don't yet have a pass or need to login.</Text>
</View>
<View style= {{width: '50%', alignItems: 'center', justifyContent: 'center'}}>
<Button
onPress={() => this.props.navigation.navigate('My Account')}
buttonStyle={{backgroundColor: 'black', width: wp('40%'), alignContent: 'space-around', flexWrap: 'wrap'}}
titleStyle = {{fontSize: hp('2%'), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold'}}
title="Please login or purchase a pass to redeem offers"
/>
</View>
</View>
      </View>
      
    </View>
  )}

  {renderIf(this.state.userLoggedIn === true, 
    <View style={{height: '100%'}}>
    <View style={{height: '20%'}}>
{renderIf (this.state.avatarSource,
      <Header
        containerStyle={{
        backgroundColor: 'black',
        height: '100%',
        paddingBottom: 25
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
        buttonStyle={{width: wp('25%'), backgroundColor: '#f4ad07', height: hp('7%')}}
        title="REDEEM"
        titleStyle={{color: 'black', fontSize: hp('2.25%'), fontWeight: 'bold'}}
        onPress= {() => this.props.navigation.navigate('Redeem', {brewGUID: this.state.devId, userGUID: this.state.userGUID, isIncognito: this.state.isIncognito})}
      />}
      />
)}
{renderIf (!this.state.avatarSource,
    <Header
      containerStyle={{
      backgroundColor: 'black',
      height: '100%',
      paddingBottom: 25
      }}
      leftComponent={{ icon: 'menu', color: '#fff', size: 50, 
        onPress: () => this.setModalVisible(),
      }}
      centerComponent= {<Image
      style={{width: wp('20%'), height: hp('13.5%'), padding: 20}}
      source={require('../assets/images/brewHopLogoFinal.png')}
      />}
      rightComponent={ <Button
      buttonStyle={{width: wp('25%'), backgroundColor: '#f4ad07', height: hp('7%')}}
      title="REDEEM"
      titleStyle={{color: 'black', fontSize: hp('2.25%'), fontWeight: 'bold'}}
      onPress= {() => this.props.navigation.navigate('Redeem', {brewGUID: this.state.devId, userGUID: this.state.userGUID})}
      />}
      />
)}
      </View>
   
    <View style={{height: '80%', width: '100%'}}>
      <ScrollView >
      <View style={{backgroundColor: 'black', height: hp('25%')}}>
      <TouchableOpacity style= {{width: '100%', paddingTop: 5, paddingBottom: 10}}
       onPress={() => this.props.navigation.navigate('BrewMap')}>
          <Image style={{width: '100%', height: "100%"}}
                        source={require('../assets/images/brewPass-googleBackground-01.png')
            }
            />
          <View style={styles.absoluteViewMaps}>
            <Text style={styles.mapsNearbyText}>MAPS + NEARBY</Text>
          </View>

      </TouchableOpacity>
       </View>     
    
      <View style={{width: '100%', flexDirection: 'row', backgroundColor: 'black', height: hp('25%'), paddingBottom: 10, justifyContent: 'space-between'}}>

          {/* <TouchableOpacity style= {{width: '49%', height: '100%', }} 
         onPress={() => this.props.navigation.navigate('PhotoWall')}
          >
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/beer-fest.jpg')
                }
              />
              <View style={styles.absoluteViewMyPass}>
                <Text style={styles.myPassTextHome}>PHOTO WALL</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('HowItWorks')}>
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/brewNews.jpg')
                }
              />
              <View style={styles.absoluteViewMyPass}>
                {/* <Text style={styles.myPassTextHome}>NEWS + EVENTS</Text> */}
                <Text style={styles.myPassTextHome}>HOW IT WORKS</Text>
              </View>
          </TouchableOpacity>

            <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('Activity')}>
              <Image style={{width: '100%', height: '100%' }}
                source={
                  require('../assets/images/topRatedCheers.jpg')
                }
              />
              <View style={styles.absoluteViewMyPass}>
                <Text style={styles.myPassTextHome}>ACTIVITY FEED</Text>
              </View>
            </TouchableOpacity>

        </View>
        
        <View style={{width: '100%', flexDirection: 'row', backgroundColor: 'black', height: hp('25%'), paddingBottom: 10, justifyContent: 'space-between'}}>
          
          <TouchableOpacity style= {{width: '49%', height: '100%', }} 
         onPress={() => this.props.navigation.navigate('PhotoWall')}
          >
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/beer-fest.jpg')
                }
              />
              <View style={styles.absoluteViewMyPass}>
                <Text style={styles.myPassTextHome}>PHOTO WALL</Text>
              </View>
            </TouchableOpacity>

          <TouchableOpacity style= {{width: '49%', height: '100%'}} onPress={() => this.props.navigation.navigate('TopRedeem')}>
              <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/reviewPic.jpg')
                }   
              />
              <View style={styles.absoluteViewMyPass}>
                <Text style={styles.myPassTextHome}>TOP CHECKINS</Text>
              </View>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor: 'black', height: hp('25%')}}>
      <TouchableOpacity style= {{width: '100%', paddingTop: 5, paddingBottom: 10}}
       onPress={() => this.props.navigation.navigate('My Account')}>
          <Image style={{width: '100%', height: '100%'}}
                source={
                  require('../assets/images/myPassPic.jpg')
                }
              />
          <View style={styles.absoluteViewMaps}>
            <Text style={styles.mapsNearbyText}>MY ACCOUNT</Text>
          </View>

          </TouchableOpacity>
       </View>     
        </ScrollView>
      </View>
    </View>
  )}
    
    </View>
    );

    }
  }
}
  
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      alignItems: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: 'black',
      paddingBottom: 15
    }, 
    avatar: {
      borderRadius: 45,
      width: 90,
      height: 90,
      resizeMode: 'cover'
    },
    containerBrewInfo: {    // flex: 1,
      alignItems: 'center',
      paddingTop: 15,
      // once constants are installed
      // paddingTop: Constants.statusBarHeight,
      backgroundColor: 'black',
    },
    mapsNearbyText: {
      color: 'white',
      fontSize: hp('5%'),
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center'
    },
    myPassText:  {
      color: 'white',
      fontSize: 20,
      justifyContent: 'center'
    },
    txtDeetsAddress: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'bold'
    },
    myPassTextDeets:  {
      color: 'white',
      fontSize: 35,
      justifyContent: 'center',
      fontWeight: 'bold',
      
    },
    myPassTextDeetsBrewTitle:  {
      color: 'white',
      fontSize: 29,
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    myPassTextDeetsBrewSubTitle: {
      color: 'white',
      fontSize: 25,
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    mapContainer: {
      width: "100%",
      height: '100%',
    },
    map: {
      width: "100%",
      height: "100%"
    },
    myPassTextHome:  {
      color: 'white',
      fontSize: hp('3%'),
      justifyContent: 'center',
      fontWeight: 'bold'
    },
    absoluteView: {
          flex: 1,
          position: 'absolute',
          left: 73,
          top: 65,
          alignItems: 'center',
          backgroundColor: 'transparent',
          color: 'white',
          fontSize: 30,
          fontWeight: 'bold'
      },
      absoluteViewMyPass: {
        flex: 1,
        position: 'absolute',
        height: 45,
        top: '40%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: .7
    },
      absoluteViewMaps: {
        flex: 1,
        position: 'absolute',
        height: 55,
        top: '40%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: .7
    },
    containerAnimated: {
      flex: 1,
    },
    scrollView: {
      position: "absolute",
      bottom: 75,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
    endPadding: {
      paddingRight: width - CARD_WIDTH,
    },
    card: {
      padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      // overflow: "hidden",
    },
    cardImage: {
      flex: 3,
      width: "50%",
      height: "50%",
      alignSelf: "center",
    },
    textContent: {
      flex: 1,
    },
    cardtitle: {
      fontSize: 12,
      marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    marker: {
      width: 12,
      height: 12,
      // borderRadius: 6,
      backgroundColor: "#f4ad07",
    },
    ring: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(130,4,150, 0.3)",
      position: "absolute",
      borderWidth: 1,
      borderColor: "rgba(130,4,150, 0.5)",
    },
      callout: {
        width: 140,
    },
  });
  export default HomeScreen;
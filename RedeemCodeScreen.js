import React, { Component } from 'react';
import { TextInput, Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, TouchableHighlight, FlatList, List, ActivityIndicator, Dimensions, AppRegistry, ScrollView, Animated, Image } from 'react-native';

import { Button, ListItem, Avatar, AvatarIcon, Header } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";
// import Constants from 'expo-constants'
import {
  Constants,
} from 'react-native-unimodules';
// import MapView, { Marker, ProviderPropType, Callout, CalloutSubview } from 'react-native-maps';
// import CalloutBubble from './components/callout';
import Geolocation from 'react-native-geolocation-service';
// import AnimatedViews from './components/AnimatedViews';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import renderIf from '../components/RenderIf';
import { StackActions } from 'react-navigation';

class RedeemCodeTestScreen extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { 
            text: '',
            id: this.props.navigation.state.params.venID,
            checkDone: false,
            isLoading: true, 
            venueLogo: "https://picsum.photos/200/300",
            venueName: "",
            venueOffer: "",
            venID: "",
            redeemDone: false
        };
      }

      
    componentDidMount() {
     this.checkForIncognito();
     console.log(this.props.navigation.state.params.brewGUID);
     console.log(this.props.navigation.state.params.userGUID);      }
    
    addToState=(value)=>{
      this.setState({
        text: this.state.text+=value,
      });
        var vallength = this.state.text;
        if (vallength.length == 3){                       
        this.checkOffer();
      }
    }

    resetForNumPad = () => {
      this.setState({
        checkDone: false,
        redeemDone: false,
        text: ""
      })
    }

    checkForIncognito = async () => {
      let isIncog = await AsyncStorage.getItem('isIncognito');
      console.log(JSON.parse(isIncog));
      console.log("hello there incognito")
      this.setState({
        isIncognito: JSON.parse(isIncog)
      })
    }

    clearText=()=>{
      this.setState({
        text: "",
       
      });
    }

    setCheckDone = () => {
      this.setState({
        checkDone: true
      })
    }
    /*call db to do check conditions check code show offer on screen.
    -> when user confirms button below ->runs redeem offer*/

    checkOffer = () => {
      console.log(this.state.text)
    //   if (this.state.isIncognito) {
    //     var anon = 1
    //   } else {
    //     var anon = 0 
    //   }
      fetch('https://brewhoppass.com/app/dev/redeemable.php?venueCode=' + this.state.text + '&brewGUID=' + this.props.navigation.state.params.brewGUID + '&userGUID=' + this.props.navigation.state.params.userGUID + '&redeem=' + false, {
          mode: 'cors',
          headers: {
            "Cache-Control": "no-cache",
            'Access-Control-Allow-Origin':'*'
          }
          })
        .then(res => res.json())
        .then(myJson => {
          console.log(myJson)
          if((myJson[0].reason).includes("redeemed this offer on")) {
            Alert.alert(
              'Redeem Failed',
                myJson[0].reason
            )
            // alert("Offer Already Redeemed")
            this.setState({
              text: ""
            })
          } else if (myJson[0].reason === "failed code"){
            Alert.alert(
              'Redeem Failed',
              'Invalid Code Entered'
            )
            this.setState({
              text: ""
            })
          } else if((myJson[0].reason).includes("Pass expired")){
            Alert.alert(
              'Redeem Failed',
              myJson[0].reason
            )
            this.setState({
              text: ""
            })
          } else {
          // var results={results:myJson};
          // console.log(results);
            console.log(myJson)
          this.setState({
            data: myJson,
            venueName: myJson[0].venueName,
            venueLogo: myJson[0].venueLogo,
            venueOffer: myJson[0].venueOffer,
           responseStatus: myJson[0].status,
           responseReason: myJson[0].reason
          }, ()=>this.setCheckDone());
        }
        })
        .catch(err => console.log(err));
    };

    redeemOffer = (code) => {
      console.log(this.state.text)
      if (this.state.isIncognito) {
        var anon = 1
      } else {
        var anon = 0 
      }
        fetch('https://brewhoppass.com/app/dev/redeemable.php?venueCode='+ code + '&brewGUID=' + this.props.navigation.state.params.brewGUID + '&userGUID=' + this.props.navigation.state.params.userGUID + '&redeem=' + true + '&incognito=' + anon, {
          mode: 'cors',
          headers: {
            "Cache-Control": "no-cache",
            'Access-Control-Allow-Origin':'*'
          }
          })
        .then(res => res.json())
        .then(myJson => {
          if(myJson[0].reason === "already redeemed") {
            Alert.alert(
              'Redeem Failed',
              'Offer Already Redeemed'
            )
            // alert("Offer Already Redeemed")
            this.setState({
             
            })
          } else if (myJson[0].reason === "failed code"){
            Alert.alert(
              'Redeem Failed',
              'Wrong Code Inputted'
            )
            this.setState({
              
            })
          } else {
          // var results={results:myJson};
          // console.log(results);
            console.log(myJson)
          this.setState({
            data: myJson,
           redeemDone: true,
           checkDone: false,
           venID: myJson[0].venID,
           responseStatus: myJson[0].status,
           responseReason: myJson[0].reason
          }, ()=>console.log(this.state.redeemDone));
        }
        })
        .catch(err => console.log(err));
    };



    render() {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'BrewDeets', params: { id: this.state.venID, userGUID: this.props.navigation.state.params.userGUID, brewGUID: this.props.navigation.state.params.brewGUID }})],
      });
      const resetAction2 = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home', params: { id: this.state.venID, userGUID: this.props.navigation.state.params.userGUID, brewGUID: this.props.navigation.state.params.brewGUID }})],
      });
        return (
          <View style={{height: '100%', width: '100%', backgroundColor: 'black'}}>
            {renderIf(!this.state.checkDone & !this.state.redeemDone, 
               <View style={{height: '100%', width: '100%', backgroundColor: 'black'}}>
            
               <View style={{height: '10%', width: '100%', justifyContent: 'center'}}>
                 <View style={{alignSelf: 'center', width: '78%', height: '50%', justifyContent: 'center'}}>
                     <Text style={{color: 'white', fontWeight: 'bold', alignSelf: 'center', fontSize: hp('3%') }}>Enter Venue Code Below</Text>
                 </View>
               </View>
   
               <View style={{height: '20%', width: '100%', justifyContent: 'center'}}>
                 <View style={{alignSelf: 'center', width: '78%', height: '50%', borderColor: '#f4ad07', borderWidth: 5, justifyContent: 'center'}}>
                     <Text style={{color: '#f4ad07', fontWeight: 'bold', fontSize: hp('3%')}}>{this.state.text}</Text>
                 </View>
               </View>
   
             <View style={{width: '80%', height: '12%', marginBottom: 10, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('1')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf: 'center', color: '#f4ad07'}}>1</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('2')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>2</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('3')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>3</Text>
               </TouchableOpacity>
             </View>
     
             <View style={{width: '80%', marginBottom: 10, height: '12%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('4')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>4</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('5')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>5</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
               onPress={()=>this.addToState('6')}>
               <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>6</Text>
               </TouchableOpacity>
             </View>
     
             <View style={{width: '80%', marginBottom: 13, height: '12%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
                 onPress={()=>this.addToState('7')}>
                 <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>7</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
                 onPress={()=>this.addToState('8')}>
                 <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>8</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
                 onPress={()=>this.addToState('9')}>
                 <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>9</Text>
               </TouchableOpacity>
             </View>
             <View style={{width: '80%', marginBottom: 10, height: '12%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
               
               <TouchableOpacity style={{width: '30%', height: '100%', justifyContent: 'center', borderColor: '#f4ad07', borderWidth: 5}}
                 onPress={()=>this.addToState('0')}>
                 <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>0</Text>
               </TouchableOpacity>
              
             </View>
   
   
             <TouchableOpacity style={{ alignSelf: 'center', width: '78%', height: '12%', borderColor: '#f4ad07', borderWidth: 5, justifyContent: 'center'}}
             onPress={()=>this.clearText()}>
                 <Text style={{fontSize: hp('3%'), fontWeight: 'bold', alignSelf:'center', color: '#f4ad07'}}>Clear</Text>
             </TouchableOpacity>
   
            
           </View>
              )}
          {renderIf(this.state.checkDone && !this.state.redeemDone,
         <View style={{alignSelf: 'center', width: '100%', height: '100%', backgroundColor: 'black', }}>       
         <View style={{justifyContent: 'center', height: '71%'}}>
          <View style={{alignItems: 'center', height: '30%', marginTop: 25, marginBottom: 30}}>
          <Avatar
                                size={hp('20%')}
                                containerStyle = {{backgroundColor: 'white'}}
                                imageProps={{resizeMode: 'stretch'}}
                                source={{
                                  uri: this.state.venueLogo
                                }}
                              />
            </View>
            <View style={{height: '19%'}}>
              <Text style={{alignSelf: 'center', fontSize: hp('4.5')}}>Venue Name</Text>
            <Text style={{alignSelf: 'center', fontSize: hp('3.75%'), fontWeight: 'bold', color: 'white'}}>{this.state.venueName}</Text>
            </View>
          
            <View style={{height: '28%'}}>
            <Text style={{alignSelf: 'center', fontSize: hp('4.5')}}>Offer</Text>
            <Text style={{alignSelf: 'center', fontSize: hp('3.75%'), fontWeight: 'bold', color: '#f4ad07'}}>{this.state.venueOffer}</Text>
            </View>
            <View style={{width: '100%', height: '15%'}}>
            <Text style={{alignSelf: 'center', fontSize: hp('3.5%'), fontWeight: 'bold', color: 'white'}}>Confirm The Redemption Offer?</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', width: '100%', position: "absolute", bottom: 4, justifyContent: 'space-evenly', height: '11%'}}>
            <Button 
            buttonStyle={{alignSelf: 'center', backgroundColor: 'red', width: wp('40%'), alignContent: 'center', height: '98%', borderWidth: 2, borderColor: 'black'}}
            onPress={() => {this.resetForNumPad()}}
            titleStyle={{color: 'black', fontSize: 20, fontWeight: 'bold'}}
            title= 'Cancel'>
            </Button> 
            <Button 
            buttonStyle={{alignSelf: 'center', backgroundColor: 'green', width: wp('40%'), alignContent: 'center', height: '98%', borderWidth: 2, borderColor: 'black'}}
            onPress={() => {console.log(this.state.text), this.redeemOffer(this.state.text)}}
            titleStyle={{color: 'black', fontSize: 20, fontWeight: 'bold'}}
            title= 'Confirm'>
            </Button> 
          </View>
          </View>
          )}

          {renderIf(this.state.redeemDone && this.state.responseStatus === '1', 
          <View style={{alignSelf: 'center', width: '100%', height: '100%', backgroundColor: 'black', }}>
          <View style={{width: '100%', height: '25%', flexWrap: 'wrap', marginBottom: 26, marginTop: 15 }}>
          <Text style={{alignSelf: 'center', fontSize: hp('3.5%'), fontWeight: 'bold', color: '#f4ad07', textAlign: 'center', }}>You Have Successfully Redeemed The Offer</Text>
          </View>
          <View style={{justifyContent: 'center', height: '71%'}}>
          <View style={{alignItems: 'center', height: '30%', marginTop: 0, marginBottom: 30}}>
          <Avatar
                                size={hp('20%')}
                                containerStyle = {{backgroundColor: 'white'}}
                                imageProps={{resizeMode: 'stretch'}}
                                source={{
                                  uri: this.state.venueLogo
                                }}
                              />
            </View>
          <View style={{height: '100%', flexWrap: 'wrap'}}>
          <Text style={{alignSelf: 'center', fontSize: hp('6.5%'), color: 'white'}}>OFFER REDEEMED</Text>
          <Text style={{alignSelf: 'center', fontSize: hp('3.75%'), fontWeight: 'bold', color: '#f4ad07'}}>{this.state.venueOffer}</Text>
          <Text style={{alignSelf: 'center', fontSize: hp('3.75%'), fontWeight: 'bold', color: 'white'}}>AT</Text>
          <Text style={{alignSelf: 'center', fontSize: hp('3.75%'), fontWeight: 'bold', color: '#f4ad07', textAlign: 'center'}}>{this.state.venueName}</Text>
          </View>
         </View>
         <View style={{flexDirection: 'row', width: '100%', position: "absolute", bottom: 4, justifyContent: 'space-evenly', height: '14%'}}>
          <Button 
          buttonStyle={{alignSelf: 'center', backgroundColor: '#f4ad07', width: wp('40%'), alignContent: 'center', height: '98%', borderWidth: 2, borderColor: 'black'}}
          onPress={() => this.props.navigation.dispatch(resetAction2)}
          titleStyle={{color: 'black', fontSize: 20, fontWeight: 'bold'}}
          title= 'GO HOME'>
          </Button> 
          <Button 
          buttonStyle={{alignSelf: 'center', backgroundColor: '#f4ad07', width: wp('40%'), alignContent: 'center', height: '98%', borderWidth: 2, borderColor: 'black'}}
          onPress={() => this.props.navigation.dispatch(resetAction)}
          titleStyle={{color: 'black', fontSize: 20, fontWeight: 'bold'}}
          title= 'VENUE INFO'>
          </Button> 
         </View>
         </View>
          
          
          
          
          )}
          </View>
        )
        }
      }


  const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
},  
  headerText: {  
    fontSize: 20,  
    textAlign: "center",  
    margin: 10,  
    fontWeight: "bold"  
},  
TextInputStyle: {  
    textAlign: 'center',  
    height: 40,  
    borderRadius: 10,  
    borderWidth: 2,  
    borderColor: '#009688',  
    marginBottom: 10  
}  
});

  export default RedeemCodeTestScreen;
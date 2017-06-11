import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import { firebaseApp } from '../../services/database/FirebaseService';
import { defaultPreference } from '../../services/userPreferences/UserPreferences';
import Spinner from 'react-native-spinkit';

export default class Home extends Component {

  constructor(props) {
   super(props);
   this.state = {
     cameFrom: this.props.cameFrom,
     loading: false
   }
 }

goBack (){
  this.logOut();
  this.navigate('login', 'Left', true);
}

changeVisibility() {
    this.setState({loading: !this.state.loading});
  }

navigate(routeName, type='Normal', reset=false) {
  if (reset){
    this.props.navigator.resetTo({
      name: routeName,
      type: type
    });
  } else {
    this.props.navigator.push({
      name: routeName,
      type: type
    });
  }

}

async logOut(){
  try {
    await firebaseApp.auth().signOut().then(()=> console.log('firebase logged out'));
    await defaultPreference.clear('token').then(()=> console.log('userDefaults deleted'));
  } catch (error) {
    console.log(error);
  }
}

  render (){
    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <View style={styles.logoContainer}>
          <Spinner style={styles.spinner} isVisible={this.state.loading} size={60} color={'#bdc3c7'} type={'Circle'}/>
            <Text>
              This is the Home screen that came from {this.state.cameFrom}.
            </Text>
          </View>
          <View style={styles.viewContainer}>
          <View style={styles.viewButtonStyle}>
            <TouchableOpacity onPress={this.goBack.bind(this)}>
              <Text style={styles.buttonTextStyle}>
                X
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewButtonStyle}>
            <TouchableOpacity onPress={this.changeVisibility.bind(this)}>
              <Text style={styles.buttonTextStyle}>
                stop/start spinner
              </Text>
            </TouchableOpacity>
          </View>

          </View>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  logoContainer:{
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: '#1ABC9C',
  },
  viewButtonStyle: {
    paddingVertical: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  viewContainer: {
    padding: 20
  },
  spinner: {
    marginBottom: 50
  },
});

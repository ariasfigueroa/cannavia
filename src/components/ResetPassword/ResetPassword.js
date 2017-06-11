import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Alert
} from 'react-native';

import { firebaseApp } from '../../services/database/FirebaseService';
import Spinner from 'react-native-spinkit';

export default class ResetPassword extends Component {

constructor (props) {
  super(props);

  this.state = {
    userName: '',
    loading: false,
  }
  this.changeVisibility = this.changeVisibility.bind(this);
  this.resetPassword = this.resetPassword.bind(this);
  this.goBack = this.goBack.bind(this);
}

componentWillMount(){
  this.changeVisibility();
}

componentDidMount(){
  this.changeVisibility();
}

changeVisibility() {
  this.setState({loading: !this.state.loading});
}


resetPassword(){
  try {
    this.changeVisibility;
    if (this.state.userName == '') {
      Alert.alert('Alerta', 'Usuario o email no ingresado.',
                  [{text: 'OK', onPress: () => this.userNameInput.focus()}]);
    } else  {
      this.sendPasswordResetEmailFirebase (this.state.userName);
    }
    this.changeVisibility;
  } catch (error) {
    console.log(error.toString());
  }
}

async sendPasswordResetEmailFirebase(userName) {
  try {
    let userNameInput = this.userNameInput;
    var success = false;
    await firebaseApp.auth().sendPasswordResetEmail(this.state.userName).then (function (result) {
      success = true;
      },function (error) {
      var errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email' : errorMessage = 'Usuario/email invalido'; break;
        case 'auth/user-not-found' : errorMessage = 'Usuario/email no encontrado'; break;
        default : errorMessage = '';
      }
      Alert.alert('Oops', errorMessage,
                  [{text: 'OK', onPress: () => {
                      userNameInput.focus();
                  }}]);
    });
    // if token is != '' means that the user has been authenticated.
    // send to the home
    if (success){
      await Alert.alert('Atención', 'Se ha enviado un email con los pasos para generar tu nueva contraseña',
                  [{text: 'OK', onPress: () => console.log('usuario')}]);
      //this.navigate('passwordConfirmation', 'Normal');
      this.goBack();
    }
  } catch (error){
    console.log(error.toString());
  }
}

navigate(routeName, type='Normal') {
  this.props.navigator.push({
    name: routeName,
    type: type
  });
}

goBack (){
  this.props.navigator.pop();
}

  render (){
    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{uri: 'https://firebasestorage.googleapis.com/v0/b/cannavia-e2b7b.appspot.com/o/profile%2FcannaviaLogo.png?alt=media&token=3d8d7c4b-d5c3-4719-b0f9-fd0c9d1da58b'}}
            />

        </View>
        <View>
        <View style={styles.viewContainer}>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              autoCapitalize='none'
              returnKeyType='go'
              keyboardType='email-address'
              placeholder="USUARIO O EMAIL"
              style={styles.textInputStyle}
              ref={input => {this.userNameInput = input}}
              onChangeText={(userName) => this.setState({userName})}
              value={this.state.userName}
            />
          </View>
        <View style={styles.viewButtonStyle}>
            <TouchableOpacity onPress={this.resetPassword}>
              <Text style={styles.buttonTextStyle}>
                OBTENER CONTRASEÑA
              </Text>
            </TouchableOpacity>
          </View>
            <View style={styles.viewButtonStyle}>
              <TouchableOpacity onPress={this.goBack}>
                <Text style={styles.buttonCloseTextStyle}>
                  CERRAR
                </Text>
              </TouchableOpacity>
            </View>
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
  logo: {
    width: 110,
    height: 53
  },
  viewContainer: {
    padding: 20
  },
  textInputStyle: {
    height: 40,
    textAlignVertical: 'bottom',
    color: '#7f8c8d',
  },
  viewInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    marginBottom: 10,
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: '#1ABC9C',
  },
  buttonCloseTextStyle: {
    textAlign: 'center',
    color: '#7f8c8d',
  },
  viewButtonStyle: {
    paddingVertical: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 16,

    marginTop: 20,
  },
  buttonTextSignInStyle: {
    textAlign: 'center',
    color: '#1ABC9C',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 50
  },
  logoContainerSpinner:{
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
});

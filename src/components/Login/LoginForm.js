import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import { firebaseApp } from '../../services/database/FirebaseService';

export default class LoginForm extends Component{
constructor(props){
  super(props);
  this.state = {
    userName: '',
    password: '',
    token: ''
  }
  this.login = this.login.bind(this);
}

login (){
  if (this.state.userName == '') {
    Alert.alert('Alerta', 'Usuario o email no ingresado.',
                [{text: 'OK', onPress: () => this.userNameInput.focus()}]);
  } else if (this.state.password == ''){
    Alert.alert('Alerta', 'Contraseña no ingresada.',
                [{text: 'OK', onPress: () => this.passwordInput.focus()}]);
  } else {
    this.singup (this.state.userName, this.state.password);
  }
}

async singup(userName, password) {
  try {
    let userNameInput = this.userNameInput;
    let passwordInput = this.passwordInput;
    var token = '';
    await firebaseApp.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then (function (result) {
      token = result.uid;
    }, function (error) {
      var typeOfError = 0;
      var errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email': errorMessage = 'Usuario/email invalido'; break;
        case 'auth/user-disabled' : errorMessage = 'Usuario/email inactivo'; break;
        case 'auth/user-not-found' : errorMessage = 'Usuario/email no registrado'; break;
        case 'auth/wrong-password' : errorMessage = 'Contraseña incorrecta'; typeOfError = 1; break;
        default : errorMessage = '';
      }
      Alert.alert('Oops', errorMessage,
                  [{text: 'OK', onPress: () => {
                    if (typeOfError == 0) {
                      userNameInput.focus();
                    } else {
                      passwordInput.focus();
                    }}}]);
    });
    // if token is != '' means that the user has been authenticated.
    // send to the home
    if (token != ''){
      this.setState({token});
      this.navigateTo('Home');
    }
  } catch (error){
    console.log(error.toString());
  }
}

  navigateTo (target) {
    Alert.alert(target, this.state.token,
                [{text: 'OK', onPress: () => console.log('Go to Home')}]);
  }

  navigate(routeName) {
    this.props.navigator.push({
      name: routeName
    });
  }

  render (){
    return (
        <View style={styles.viewContainer}>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              autoCapitalize='none'
              returnKeyType='next'
              keyboardType='email-address'
              placeholder="USUARIO O EMAIL"
              style={styles.textInputStyle}
              onSubmitEditing={() => this.passwordInput.focus()}
              ref={input => {this.userNameInput = input}}
              onChangeText={(userName) => this.setState({userName})}
              value={this.state.userName}
            />
          </View>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              secureTextEntry={true}
              autoCapitalize='none'
              returnKeyType='go'
              placeholder="CONTRASEÑA"
              style={styles.textInputStyle}
              ref={input => this.passwordInput = input}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
          <View style={styles.viewButtonStyle}>
            <TouchableOpacity onPress={this.login}>
              <Text style={styles.buttonTextStyle}>
                INGRESAR
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={ this.navigate.bind(this,'registerUser') } >
              <Text style={styles.buttonTextSignInStyle}>
                CREAR CUENTA
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.navigate.bind(this, 'resetPassword')}>
              <Text style={styles.forgotPasswordStyle}>
                Recuperar usuario/contraseña?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    padding: 20
  },
  forgotPasswordStyle: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '100',
    marginTop: 10,
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
  viewButtonStyle: {
    paddingVertical: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonTextSignInStyle: {
    textAlign: 'center',
    color: '#1ABC9C',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

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
export default class PasswordConfirmation extends Component {

constructor (props) {
  super(props);

  this.state = {
    code: '',
    password: '',
    passwordConfirmation: '',
  }

}
save(){
  if (this.state.code == ''){
    Alert.alert('Alerta', 'Codigo no ingresado.',
                [{text: 'OK', onPress: () => this.codeInput.focus()}]);
  } else  if (this.state.password == ''){
    Alert.alert('Alerta', 'Contraseña no ingresada.',
                [{text: 'OK', onPress: () => this.passwordInput.focus()}]);
  } else if (this.state.passwordConfirmation == ''){
    Alert.alert('Alerta', 'Confirmación de contraseña no ingresada.',
                [{text: 'OK', onPress: () => this.passwordConfirmationInput.focus()}]);
  } else if (this.state.password != this.state.passwordConfirmation){
    Alert.alert('Alerta', 'Confirmación de contraseña no coincide.',
                [{text: 'OK', onPress: () => this.passwordConfirmationInput.focus()}]);
  }else {
    this.confirmationCodeFirebase (this.state.code, this.state.password);
  }
}

async confirmationCodeFirebase(code, password) {
  try {
    let codeInput = this.codeInput;
    let passwordInput = this.passwordInput;
    var success = false;
    await firebaseApp.auth().confirmPasswordReset(code, password).then (function (result) {
      success = true;
    }, function (error) {
      var typeOfError = 0;
      var errorMessage = '';
      switch (error.code) {
        case 'auth/expired-action-code': errorMessage = 'Código ha expirado'; break;
        case 'auth/invalid-action-code' : errorMessage = 'Código invalido'; break;
        case 'auth/user-disabled' : errorMessage = 'Usuario deshabilitado'; break;
        case 'auth/user-not-found' : errorMessage = 'Usuario no encontrado'; break;
        case 'auth/weak-password' : errorMessage = 'Contraseña no segura'; typeOfError = 1; break;
        default : errorMessage = '';
      }
      Alert.alert('Oops', errorMessage,
                  [{text: 'OK', onPress: () => {
                    if (typeOfError == 0) {
                      codeInput.focus();
                    } else {
                      passwordInput.focus();
                    }}}]);
    });
    // if token is != '' means that the user has been authenticated.
    // send to the home
    if (success){
      //this.navigateTo('Home');
      this.navigate('login', 'Modal');
      //this.setState({userName: '', password: ''});
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
            source={require('../../resources/images/cannaviaLogo.png')}
            />

        </View>
        <View>
        <View style={styles.viewContainer}>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              autoCapitalize='none'
              returnKeyType='next'
              keyboardType='default'
              placeholder="CÓDIGO"
              style={styles.textInputStyle}
              onSubmitEditing={() => this.passwordInput.focus()}
              ref={input => {this.nameInput = input}}
              onChangeText={(name) => this.setState({code})}
              value={this.state.code}
            />
          </View>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              secureTextEntry={true}
              autoCapitalize='none'
              returnKeyType='next'
              placeholder="CONTRASEÑA"
              style={styles.textInputStyle}
              onSubmitEditing={() => this.passwordConfirmationInput.focus()}
              ref={input => this.passwordInput = input}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
          <View style={styles.viewInputStyle}>
            <TextInput
              autoCorrect={false}
              selectTextOnFocus={true}
              secureTextEntry={true}
              autoCapitalize='none'
              returnKeyType='go'
              placeholder="CONFIRMAR CONTRASEÑA"
              style={styles.textInputStyle}
              ref={input => this.passwordConfirmationInput = input}
              onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})}
              value={this.state.passwordConfirmation}
            />
          </View>

          <View style={styles.viewButtonStyle}>
            <TouchableOpacity onPress={this.save.bind(this)}>
              <Text style={styles.buttonTextStyle}>
                VERIFICAR
              </Text>
            </TouchableOpacity>
          </View>
            <View style={styles.viewButtonStyle}>
              <TouchableOpacity onPress={this.goBack.bind(this)}>
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
  }
});

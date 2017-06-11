import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';

//import LoginForm from './LoginForm'
import { firebaseApp } from '../../services/database/FirebaseService';
import { defaultPreference } from '../../services/userPreferences/UserPreferences';
import Spinner from 'react-native-spinkit';
export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      token: '',
      loading: false
    }
    this.login = this.login.bind(this);
    this.clearUserAndPassword = this.clearUserAndPassword.bind(this);
    this.changeVisibility = this.changeVisibility.bind(this);
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

  clearUserAndPassword(){
    this.setState({userName: '', password: ''});
  }

  async login (){
    try {
      this.changeVisibility();
      if (this.state.userName == '') {
        this.changeVisibility();
        Alert.alert('Alerta', 'Usuario o email no ingresado.',
                    [{text: 'OK', onPress: () => {
                      this.userNameInput.focus()
                    }}]);
      } else if (this.state.password == ''){
        this.changeVisibility();
        Alert.alert('Alerta', 'Contraseña no ingresada.',
                    [{text: 'OK', onPress: () => {
                      this.passwordInput.focus();
                    }}]);
      } else {
        await this.loginFirebase (this.state.userName, this.state.password);
        if (this.state.token != ''){
          this.changeVisibility();
          this.navigate('home');
        }
      }
    } catch (error) {
      console.log(error.toString());
    }
  }

  async loginFirebase(userName, password) {
    try {
      let userNameInput = this.userNameInput;
      let passwordInput = this.passwordInput;
      var token = '';
      await firebaseApp.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then (function (result) {
        token = result.uid;
      }, function (error) {
        this.changeVisibility;
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
        try {
          defaultPreference.set('token', token).then(()=> {
            defaultPreference.get('token').then((value)=> {
              console.log('uid: '+value);
            });
          });
        } catch (error) {
          console.log(error.toString());
        }
      }
    } catch (error){
      console.log(error.toString());
    }
  }

    navigate(routeName, type='Normal') {
      this.clearUserAndPassword();
      this.props.navigator.push({
        name: routeName,
        type: type,
        passProps : {
          cameFrom: 'login'
        }
      });
    }

  render (){
      console.log('render');
      return (
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
              <TouchableOpacity onPress={ this.navigate.bind(this,'registerUser', 'Modal') } >
                <Text style={styles.buttonTextSignInStyle}>
                  CREAR CUENTA
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.navigate.bind(this, 'resetPassword', 'Modal')}>
                <Text style={styles.forgotPasswordStyle}>
                  Recuperar usuario/contraseña?
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

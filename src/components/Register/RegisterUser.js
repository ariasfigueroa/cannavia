import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Alert,
  Platform
} from 'react-native';

import { firebaseApp } from '../../services/database/FirebaseService';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Spinner from 'react-native-spinkit';

export default class RegisterUser extends Component {

constructor (props) {
  super(props);

  this.state = {
    name: '',
    userName: '',
    password: '',
    passwordConfirmation: '',
    token: '',
    imagePath: 'https://firebasestorage.googleapis.com/v0/b/cannavia-e2b7b.appspot.com/o/profile%2FCameraAnalog.png?alt=media&token=909ef9f8-f9ad-4bfb-b990-45d1b9fe7796',
    imageHeight: null,
    imageWidth: null,
    hasUpdatedPhoto: false,
    loading: false
  }
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

async save(){
  try {
    this.changeVisibility();
    if (this.state.name == ''){
      Alert.alert('Alerta', 'Nombre no ingresado.',
                  [{text: 'OK', onPress: () => this.nameInput.focus()}]);
    } else if (this.state.userName == '') {
      Alert.alert('Alerta', 'Usuario o email no ingresado.',
                  [{text: 'OK', onPress: () => this.userNameInput.focus()}]);
    } else if (this.state.password == ''){
      Alert.alert('Alerta', 'Contraseña no ingresada.',
                  [{text: 'OK', onPress: () => this.passwordInput.focus()}]);
    } else if (this.state.passwordConfirmation == ''){
      Alert.alert('Alerta', 'Confirmación de contraseña no ingresada.',
                  [{text: 'OK', onPress: () => this.passwordConfirmationInput.focus()}]);
    } else if (this.state.password != this.state.passwordConfirmation){
      Alert.alert('Alerta', 'Confirmación de contraseña no coincide.',
                  [{text: 'OK', onPress: () => this.passwordConfirmationInput.focus()}]);
    }else {
      await this.singupFirebase (this.state.userName, this.state.password);
      //this.navigateTo('Home');
      if (this.state.token != ''){
        this.navigate('home', 'Normal');
      }
    }
    this.changeVisibility();
  } catch (error) {
    console.log(error);
  }

}

async singupFirebase(userName, password) {
  try {
    let userNameInput = this.userNameInput;
    let passwordInput = this.passwordInput;
    let imagePath = this.state.imagePath;
    let hasUpdatedPhoto = this.state.hasUpdatedPhoto;
    let name = this.state.name;
    var token = '';

    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const uploadImage = (uri, uid, imageName, mime = 'image/jpg') => {
      return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          let uploadBlob = null
          const imageRef = firebaseApp.storage().ref('profile').child(uid).child(imageName)
          fs.readFile(uploadUri, 'base64')
          .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
          })
          .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob, { contentType: mime })
          })
          .then(() => {
            uploadBlob.close()
            return imageRef.getDownloadURL()
          })
          .then((url) => {
            resolve(url)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }

    await firebaseApp.auth().createUserWithEmailAndPassword(this.state.userName, this.state.password).then (function (result) {
       token = result.uid;
      // Here goes the image upload
      if (hasUpdatedPhoto){
       uploadImage(imagePath, token, 'profile.jpg').then( url => {
         // Updates the user attributes:
          result.updateProfile({
            displayName: name,
            photoURL: url
          }).then(function() {
            // Profile updated successfully!
            // set the new profile pic
            imagePath = url;
          }, function(error) {
            // An error happened.
            Alert.alert('Uploaded failed', error, [{text: 'OK', onPress: () => console.log(error)}]);
          });
        }, error => {
          Alert.alert('Uploaded failed', error, [{text: 'OK', onPress: () => console.log(error)}]);
        }
        ).done();
      }
    }, function (error) {
      var typeOfError = 0;
      var errorMessage = '';
      switch (error.code) {
        case 'auth/email-already-in-use': errorMessage = 'Usuario/email ya existe'; break;
        case 'auth/invalid-email' : errorMessage = 'Usuario/email invalido'; break;
        case 'auth/operation-not-allowed' : errorMessage = 'Operación no permitida'; break;
        case 'auth/weak-password' : errorMessage = 'Contraseña no segura'; typeOfError = 1; break;
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
      this.setState({token, imagePath});
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


  takePicture = () => {
     const cam_options = {
       mediaType: 'photo',
       maxWidth: 200,
       maxHeight: 200,
       quality: 1,
       noData: true,
       cameraType: 'front'
     };

    ImagePicker.launchCamera(cam_options, (response) => {
       if (response.didCancel) {
       }
       else if (response.error) {
         Alert.alert('Error!', response.error,
                     [{text: 'OK', onPress: () => console.log(response.error)}]);
       }
       else {
         this.setState({
           imagePath: response.uri,
           imageHeight: response.height,
           imageWidth: response.width,
           hasUpdatedPhoto: true
         })
       }
     });
 }

  render (){
    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <View style={styles.logoContainer}>
          <TouchableOpacity onPress={this.takePicture}>
            <Image
              style={styles.profilePhotoStyle}
              source={{ uri: this.state.imagePath }}
              resizeMode='cover'
              />
            </TouchableOpacity>
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
              placeholder="NOMBRE"
              style={styles.textInputStyle}
              onSubmitEditing={() => this.userNameInput.focus()}
              ref={input => {this.nameInput = input}}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
            />
          </View>
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
                GUARDAR
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
  profilePhotoStyle: {
    width: 120,
    height: 120,
    borderColor: '#1ABC9C',
    borderWidth: 4,
    borderRadius: 60,
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
  logoContainerSpinner:{
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 10,
  }
});

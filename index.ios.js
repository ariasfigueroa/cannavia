import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Alert
} from 'react-native';

import Login from './src/components/Login/Login';
import Home from './src/components/Home/Home';
import RegisterUser from './src/components/Register/RegisterUser';
import ResetPassword from './src/components/ResetPassword/ResetPassword';
import PasswordConfirmation from './src/components/ResetPassword/PasswordConfirmation'
import { defaultPreference } from './src/services/userPreferences/UserPreferences';
import Spinner from 'react-native-spinkit';

export default class cannavia extends Component {

  constructor(props){
    super(props);

    this.state = {
      logged: false,
      loading: true,
    }
}

  componentWillMount(){
    defaultPreference.get('token').then((value) => {
     if (value){
       this.setState({
         logged: true,
         loading: false
       });
     } else {
       this.setState({
         logged: false,
         loading: false
       });
     }
   });
}

  componentDidMount(){
    console.log('componentDidMount');
  }

  renderScene(route, navigator){
    console.log(this.state.logged);
    switch (route.name) {
      case 'login': return <Login navigator={navigator}/>
      case 'registerUser': return <RegisterUser navigator={navigator}/>
      case 'resetPassword': return <ResetPassword navigator={navigator}/>
      case 'passwordConfirmation': return <PasswordConfirmation navigator={navigator}/>
      case 'home': <Home navigator={navigator} {...route.passProps}/>
      default: return <Home navigator={navigator} {...route.passProps}/>
    }
  }

  render() {
    if (this.state.loading){
      return (
        <View style={{ flex: 1 }}>
          <Spinner isVisible={this.state.loading} size={100} color={'#F5FCFF'} type={'Circle'}/>
        </View>);
    } else if (this.state.logged){
      return (
        <Navigator
          configureScene={this.configureScene.bind(this)}
          initialRoute={{name: 'home'}}
          renderScene={this.renderScene.bind(this)}
        />
      );
    } else {
      return (
        <Navigator
          configureScene={this.configureScene.bind(this)}
          initialRoute={{name: 'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      );
    }
  }

  configureScene(route, routeStack){
      if(route.type === 'Modal') {
        return Navigator.SceneConfigs.FloatFromBottom
      } else if (route.type === 'Left'){
        return Navigator.SceneConfigs.SwipeFromLeft
      }
      return Navigator.SceneConfigs.PushFromRight
  }

}

AppRegistry.registerComponent('cannavia', () => cannavia);

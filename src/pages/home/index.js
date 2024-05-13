import React from 'react';
import {Image, View} from 'react-native';
import {Button, Card, Icon, Text} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OdooApi from '../../services/odoo';

import styles from './style';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: ' ',
      server: ' ',
      db: ' ',
      image_small: '',
      // password: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    var server = await AsyncStorage.getItem('server_backend_url');
    var user_name = await AsyncStorage.getItem('user_display_name');
    var image_small = await AsyncStorage.getItem('image_small');
    var db = await AsyncStorage.getItem('database');
    // var password = await AsyncStorage.getItem('password');
    this.setState({
      server: server,
      user_name: user_name,
      db: db,
      image_small: image_small,
      // password: password,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Card title={this.state.user_name}>
          <Image
            style={styles.image_badge}
            source={{uri: `data:image;base64,${this.state.image_small}`}}
          />
          <Text style={styles.text_badge}>{this.state.server}</Text>
          <Text style={styles.text_badge}>Database: {this.state.db}</Text>
          <Button
            title="Dashboard"
            onPress={this._showMoreApp}
            buttonStyle={styles.loginButton}
            icon={<Icon name="home" color="#ffffff" />}
          />
          <Button
            title="Logout"
            onPress={this._signOutAsync}
            buttonStyle={styles.loginButton}
            icon={<Icon name="exit-to-app" color="#ffffff" />}
          />
        </Card>
      </View>
    );
  }

  _showMoreApp = async () => {
    this.props.navigation.navigate('Dashboard');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

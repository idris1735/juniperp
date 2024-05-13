/* eslint-disable prettier/prettier */
import React from 'react';
import {APP_SITE, APP_SITE_TITLE} from '@env';
import {
  Keyboard,
  Image,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Linking,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
// import {Header} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
// import styles from './style';
import OdooApi from '../../services/odoo';
import {StatusBar} from 'expo-status-bar';
import {Header} from 'react-native-elements';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    port: 443,
    error: '',
    protocol: 'https',
  };

  handleServerChange = (server) => {
    this.setState({server}); // Clear the error state
  };
  handleUserChange = (user) => {
    this.setState({user}); // Update user state
  };

  handlePasswordChange = (password) => {
    this.setState({password}); // Update password state
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={-400}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <View style={styles.headingTitle}>
              <Image
                source={require('../../images/assets/jun-logo-dark.png')}
                style={styles.image}
              />
            </View>

            <View style={styles.allInputContainer}>
              {/* Server Address Input */}
              <View style={styles.inputContainer}>
                <Icon name="server" type="font-awesome" color="#E0774F" />
                <TextInput
                  placeholder="Server URL"
                  style={styles.input}
                  placeholderTextColor="#E0774F"
                  value={this.state.server}
                  onChangeText={this.handleServerChange}
                />
              </View>

              {/* Email/Username Input */}
              <View style={styles.inputContainer}>
                <Icon name="user" type="font-awesome" color="#E0774F" />
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  placeholderTextColor="#E0774F"
                  value={this.state.user}
                  onChangeText={this.handleUserChange}
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Icon name="lock" type="font-awesome" color="#E0774F" />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor="#E0774F"
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={this.handlePasswordChange}
                />
              </View>

              {/* Login Button */}
              <Button
                title="Login"
                buttonStyle={styles.button}
                titleStyle={{color: '#fff', fontSize: 19, fontWeight: '700'}}
                onPress={() => this._signInAsync()} // Call sign-in method
                icon={
                  this.state.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null
                }
              />

              {/* <Button
                buttonStyle={styles.authorButton}
                onPress={() => {
                  Linking.openURL(APP_SITE);
                }}
                type="clear"
                title={APP_SITE_TITLE}
                color="#3897f1"
              /> */}
              {/* Create New Account Link */}
              {/* <Text style={styles.createNewAccountText}>
            Create New Account{' '}
            <Text
              style={{
                color: 'blue',
                fontWeight: 900,
                fontSize: 17,
                textDecorationLine: 'underline',
              }}
              onPress={() => navigation.navigate('Registration')}
            >
              Here
            </Text>
          </Text> */}
            </View>
            <StatusBar style="auto" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  _signInAsync = async () => {
    // Check if the Odoo URL is provided
    // this.setState({loading: true});
    if (!this.state.server) {
      alert('Please provide the Odoo URL');
      this.setState({loading: false});
      return;
    }
    if (!this.state.user) {
      alert('Username must be provided');
      this.setState({loading: false});
      return;
    }
    if (!this.state.password) {
      alert('Password must be more than 6 characters');
      this.setState({loading: false});
      return;
    }

    // Extract the base URL from the provided server URL
    const baseUrl = this.extractBaseUrl(this.state.server);

    // Create an instance of OdooApi with the provided credentials and extracted database name
    var odoo_api = new OdooApi(
      baseUrl, // Use the extracted base URL as the database name
      this.state.user,
      this.state.password,
    );

    // Connect to Odoo using the provided credentials
    var connection = await odoo_api.connect(baseUrl);
    console.log('====================================');
    console.log('checking connection: ', connection.name);
    console.log('usertoken: ', connection.userToken);
    console.log('====================================');
    // Check if the connection is successful
    if (typeof connection.uid === 'number') {
      // Store user information in AsyncStorage
      await AsyncStorage.setItem('user_display_name', connection.name);
      await AsyncStorage.setItem('user_uid', connection.uid.toString());
      // await AsyncStorage.setItem('userToken', connection.session_id);
      await AsyncStorage.setItem('database', connection.db);
      // await AsyncStorage.setItem('password', this.state.password);
      await AsyncStorage.setItem(
        'server_backend_url',
        odoo_api.server_backend_url,
      );
      console.log('====================================');
      console.log('connection successful');
      console.log('====================================');
      this.props.navigation.navigate('Home', {
        url: odoo_api.server_backend_url,
      });
    } else {
      // Invalid credentials
      // this.setState({loading: false});
      console.log('====================================');
      console.log('no connections');
      console.log('====================================');
      alert('Invalid credentials');
      // this.setState({error: 'Invalid credentials', loading: false});
    }
  };

  // Function to extract the base URL from the provided server URL
  extractBaseUrl = (url) => {
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0774F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '80%',
  },
  headingTitle: {
    marginBottom: 30,
    width: '100%',
    height: 120,
    // paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allInputContainer: {
    height: 350,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // Slightly transparent background color
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#E0774F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E0774F',
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  image: {width: '100%', height: '100%', resizeMode: 'contain'},
});

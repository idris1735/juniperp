/* eslint-disable prettier/prettier */
import React from 'react';

import {ActivityIndicator, Vibration} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WebView} from 'react-native-webview';

import styles from './style';

const DURATION = 10000;
const PATTERN = [1000, 2000, 3000, 4000];

export default class OdooBackend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    header: null,
  };

  StartVibrationFunction = () => {
    // Device Will Vibrate for 10 seconds.
    Vibration.vibrate(DURATION);

    // Android Device Will Vibrate in pattern : Wait 1sec -> vibrate 2sec -> wait 3sec.
    // iOS Device Will Vibrate in pattern : Wait 1sec -> Vibrate -> wait 2sec -> Vibrate -> wait 3sec -> Vibrate

    Vibration.vibrate(PATTERN);

    // Android Device Will Vibrate in above pattern Infinite Time.
    // iOS Device Will Vibrate in above pattern Infinite Time.

    // Vibration.vibrate(PATTERN, true)
    // Vibration.cancel();
  };

  async componentDidMount() {
    const sessionId = await AsyncStorage.getItem('session_id');
    console.log('sessionid: ', sessionId);
    if (sessionId) {
      this.setState({url: `${this.state.url}&session_id=${sessionId}`});
    } else {
      AsyncStorage.getItem('server_backend_url')
        .then((url) => {
          if (url) {
            this.setState({url: url});
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  _onNavigationStateChange(webViewState) {
    AsyncStorage.setItem('last_url', webViewState.url);
  }

  _backendMessage(message) {
    switch (message) {
      case 'REACT_EXIT':
        this.StartVibrationFunction();
        this.props.navigation.navigate('Home');
        break;
      case 'OTHER_MESSAGE':
        this.props.navigation.navigate('Home');
        break;
      default:
        console.log(message);
    }
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color="#009688"
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  render() {
    const runFirst = `
      $("[data-menu=logout]").attr('data-menu','logout_custom');
      $("[data-menu=logout_custom]").click(()=>{
          window.ReactNativeWebView.postMessage("REACT_EXIT");
      });
    `;

    console.log(this.state.cookie);

    return (
      <WebView
        source={{uri: this.state.url}}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        androidProps={{
          usesCleartextTraffic: true,
        }}
        renderLoading={this.ActivityIndicatorLoadingView}
        injectedJavaScript={`
    $("[data-menu=logout]").attr('data-menu','logout_custom');
    $("[data-menu=logout_custom]").click(()=>{
      window.ReactNativeWebView.postMessage("REACT_EXIT");
    });
  `}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'REACT_EXIT') {
            AsyncStorage.removeItem('session_id');
            this.props.navigation.navigate('Home');
          }
        }}
      />
    );
  }
}

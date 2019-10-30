/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform
} from "react-native";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AsyncStorage } from "react-native";
import Storage from "react-native-storage";
import TabNav from './src/router/router'
import { Provider } from "@ant-design/react-native"

import { getAd } from "./src/requests";
import { WebView } from "react-native-webview";
import { ASSET_IMAGES } from "./src/config";
var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true
});
// 全局变量
global.storage = storage;

console.disableYellowBox = true // 关闭全部黄色警告

global.bookIdList = []
global.bookDetailList = [];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAd: true,
      adUrl: null
    };
  }

  componentDidMount() {
    this.requestLocalAd();
    this.requestAd();
    this.timer = setTimeout(() => {
      this.setState({
        showAd: false
      });
    }, 5000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  render() {

    const htmlContent = `<html>
      <script type="text/javascript" charset="utf-8"">
        if(!document.__defineGetter__) {
          Object.defineProperty(document, 'cookie', {
              get: function(){return ''},
              set: function(){return true},
          });
        } else {
          document.__defineGetter__("cookie", function() { return '';} );
          document.__defineSetter__("cookie", function() {} );
        }
      </script></html>`;

    const iosHtml = `<html><script type="text/javascript" src="${this.state.adUrl}"></script></html>`;

    return (
      <Provider>
        {this.state.showAd ? (
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {Platform.OS == "ios" ? (
              <WebView
                source={{ html: iosHtml }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : this.state.adUrl == null ? (
              <View style={{ width: "100%", height: "100%" }} />
            ) : (
              <WebView
                thirdPartyCookiesEnabled={true}
                sharedCookiesEnabled={true}
                source={{ html: htmlContent }}
                javaScriptEnabled={true}
                injectedJavaScript={`document.write('<script src="${this.state.adUrl}"></script>')`}
              />
            )}
          </View>
        ) : (
          <TabNav />
        )}
      </Provider>
    );
  }

  requestLocalAd() {
    global.storage
      .load({
        key: "adUrl"
      })
      .then(ret => {
        console.log("ret url", ret);
        this.setState({
          adUrl: ret
        });
      })
      .catch(err => {});
  }

  requestAd() {
    const data = {
      callback: this.requestAdCallback.bind(this),
      adType: 1
    };
    getAd(data);
  }

  requestAdCallback(res) {
    const { state, data } = res;
    console.log('requestad', res)
    if (state == 1) {
      const { Url = null } = data;
      this.setState({
        adUrl: Url,
      });

      if (Url != null) {
        global.storage.save({
          key: "adUrl",
          data: Url
        });
      }
    } else {
      this.setState({
        showAd: false
      });
    }
  }
}
// const App = () => {
  
//   return (
//     <Provider>
//       <TabNav />
//     </Provider>
//   );
// }

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

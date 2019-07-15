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
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from "react-native";

import {
  Colors
} from "react-native/Libraries/NewAppScreen";

import { Header, Line, ReadHistoryItem, SetItem } from "../components"
import { px } from "../utils"
class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { age = 17, time = 3, bookNum = 2 } = this.props
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headBg}>
          <View style={styles.info}>
            <View style={styles.headImage}>

            </View>
            <View style={styles.subInfo}>
              <Text style={styles.userName}>一粒沙</Text>
              <View style={styles.genderInfoLine}>
                <View style={styles.genderImage}></View>
                <Text style={styles.ageInfo}>{age}岁</Text>
              </View>
            </View>
          </View>
          <View style={styles.readInfo}>
            <Text style={styles.readTime}>阅读{time}分</Text>
            <Text style={styles.readNums}>读过{bookNum}本书</Text>
          </View>
        </View>
        <View style={styles.content}>
          {/* 阅读历史 */}
          <View style={styles.history}>
            <View style={styles.historyHead}>
              <View style={styles.historyImage}>

              </View>
              <Text style={styles.historyText}>阅读历史</Text>
            </View>
            <Line />
            <ReadHistoryItem title={"白发皇妃"} />
            <Line />
            <ReadHistoryItem />
            <Line />
          </View>
          {/* 清除缓存 */}
          <View style={styles.clearCache}>
            <SetItem action={this.clearCache} />
          </View>
          <View style={styles.about}>
            <SetItem title={"关于该阅读APP"}  action={this.gotoAbout}/>
          </View>
          {/* 关于该阅读APP */}
        </View>
        
        {/* 推出登录 */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={this.logout}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // actions
  clearCache = () => {
    console.log('clearCache')
  }

  gotoAbout = () => {
    console.log('goto about')
  }

  logout = () => {
    console.log('logout')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB'
  },
  headBg: {
    height: px(360),
    backgroundColor: 'red'
  },
  info: {
    marginLeft: px(47),
    marginTop: px(120),
    flexDirection: 'row',
    alignItems: 'center',
  },
  subInfo: {
    marginLeft: px(22)
  },
  headImage: {
    height: px(110),
    width: px(110),
    backgroundColor: 'black',
    borderRadius: px(55),
    borderWidth: px(2),
    borderColor: 'white',
  },
  userName: {
    fontSize: px(34),
    color: 'white',
  },
  genderInfoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(6)
  },
  genderImage: {
    width: px(38),
    height: px(38),
    backgroundColor: 'blue',
    borderRadius: px(19),
    borderWidth: px(2),
    borderColor: 'white'
  },
  ageInfo: {
    marginLeft: px(10),
    fontSize: px(30),
    color: 'white'
  },
  readInfo: {
    marginLeft: px(87),
    marginTop: px(16),
    flexDirection: 'row'
  },
  readTime: {
    fontSize: px(26),
    color: 'white'
  },
  readNums: {
    marginLeft: px(40),
    fontSize: px(26),
    color: 'white'
  },
  content: {
    backgroundColor: 'white'
  },
  history: {
    
  },
  historyHead: {
    marginTop: px(50),
    paddingBottom: px(18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyImage: {
    width: px(40),
    height: px(40),
    backgroundColor: 'red',
    alignItems: 'center',
    marginLeft: px(30),
    marginRight: px(24),
  },
  historyText: {
    fontSize: px(36),
    color:'#101010',
    fontWeight: 'bold',
  },
  clearCache: {
    marginTop: px(30)
  },
  about: {
    marginBottom: px(18),
  },
  logoutButton: {
    height: px(102),
    backgroundColor: 'white',
    marginTop: px(20),
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    fontSize: px(36),
    color: '#4ABD76'
  }
});

export default My;

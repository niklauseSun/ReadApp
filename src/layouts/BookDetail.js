import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { px } from '../utils'
import { Header } from '../components';
export default class BookDetail extends Component {

    render() {
        return (
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeView}>
              <Header
                showBackButton={true}
                title="test"
                navigation={this.props.navigation}
              />
              <View style={styles.content}>
                <ScrollView>
                  <View style={styles.headView}>
                    <View style={styles.image}>
                      <Text>test</Text>
                    </View>
                    <View style={styles.headInfo}>
                      <Text style={styles.name}>name</Text>
                      <Text style={styles.author}>author</Text>
                      <Text style={styles.textNum}>共多少字</Text>
                    </View>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.infoText}>
                      西启公主，为结盟北临奉命嫁给北临王子无忧，却被无忧拒婚。后来为解开自己的身世秘密，容乐化名茶楼掌柜漫夭，过程中她和无忧不打不相西启公主，为结盟北临奉命嫁给北临王子无忧，却被无忧拒婚。后来为解开自己的身世秘密，容乐化名茶楼掌…
                    </Text>
                  </View>
                  <View style={styles.menu}>
                    <Text style={styles.menuText}>目录</Text>
                    <Text style={styles.menuInfoText}>共多少张</Text>
                    <View style={styles.menuIcon}>
                      <Text>目录图标</Text>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.bottomView}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.addButton}
                  >
                    <View style={styles.addButtonView}>
                      <Text style={styles.addText}>加入书架</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.readButton}
                  >
                    <Text style={styles.readText}>免费试读</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  safeView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  content: {
    flex: 1,
    backgroundColor: "#F6F7FB"
  },
  headView: {
    flexDirection: "row",
    paddingTop: px(30),
    paddingBottom: px(50),
    backgroundColor: "#fff"
  },
  image: {
    height: px(256),
    width: px(171),
    backgroundColor: "red",
    marginLeft: px(38),
    marginRight: px(54)
  },
  headInfo: {
    height: px(256),
    justifyContent: "space-evenly"
  },
  name: {
    fontSize: px(38),
    color: "#333333"
  },
  author: {
    fontSize: px(26),
    color: "#999999"
  },
  textNum: {
    fontSize: px(30),
    color: "#5C6672"
  },
  info: {
    marginTop: px(20),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: px(30),
    paddingVertical: px(30)
  },
  infoText: {
    fontSize: px(28),
    color: "#656E79",
    lineHeight: px(52),
    // height: px(260),
  },
  bottomView: {
    height: px(153),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  addButton: {
    // marginLeft: px(40)
    width: px(120),
    height: px(120)
  },
  addButtonView: {},
  addText: {
    fontSize: px(26),
    color: "#A8ACB2"
  },
  readButton: {
    //   marginRight: px(40)
    height: px(94),
    width: px(500),
    backgroundColor: "#5C6672",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: px(8)
  },
  readText: {
    color: "#FFFFFF",
    fontSize: px(36)
  }
});

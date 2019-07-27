import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, StatusBar } from "react-native";

export default class RankList extends Component {

  constructor(props) {
    super(props)

    const { rankType } = props.navigation.state.params || {}
    this.state = {
      rankType: rankType,
      pageIndex: 1,
      pageSize: 10
    }
  }

  render() {
    console.log("rankType", this.state.rankType)
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          {/* <Text>排行榜</Text> */}
        </SafeAreaView>
      </View>
    )
  }

  getRankListAction() {

  }

  getRankListCallback() {
    
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
  }
});

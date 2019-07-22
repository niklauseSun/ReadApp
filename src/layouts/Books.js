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
  TouchableOpacity
} from "react-native";

import {
  Colors
} from "react-native/Libraries/NewAppScreen";

import { Header, SearchBar, RankHeadItem, RankItem, AddBookItem } from "../components"
import { px } from "../utils";

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header title={"书库"} />
          <View style={styles.container}>
            <SearchBar />
            <ScrollView style={styles.content}>
              <View style={styles.rank}>
                <Text style={styles.booksHeadText}>主排行</Text>
                <RankHeadItem />
                <View style={styles.rankListView}>
                  <View style={styles.rankItems}>
                    <RankItem/>
                    <RankItem/>
                  </View>
                  <View style={styles.rankItems}>
                    <RankItem/>
                    <RankItem/>
                  </View>
                </View>
                <TouchableOpacity style={styles.rankListChangeButton}>
                  <Text style={styles.rankListBtnText}>换一批</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.predict}>
                <Text style={styles.predictText}>仙侠</Text>
                <View style={styles.predictContent}>
                  <AddBookItem />
                  <AddBookItem />
                  <AddBookItem />
                </View>
                <TouchableOpacity style={styles.rankListChangeButton}>
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB'
  },
  safeView: {
    flex: 1
  },
  content: {
    flex: 1,
    marginTop: px(42)
  },
  rank: {
    width: '100%',
    height: px(873),
    backgroundColor: 'white',
  },
  predict: {
    marginTop: px(20),
    width: '100%',
    height: px(895),
    backgroundColor: 'white',
    marginBottom: px(36)
  },
  booksHeadText: {
    fontSize: px(38),
    color: '#646C75',
    marginTop: px(42),
    marginLeft: px(30),
    marginBottom: px(28)
  },
  rankItems: {
    flexDirection: 'row',
    marginTop: px(40)
  },
  rankListView: {
    marginTop: px(10),
    flex: 1
  },
  rankListChangeButton: {
    height: px(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankListBtnText: {
    fontSize: px(30),
    color: '#4ABD76'
  },
  predictText: {
    marginLeft: px(30),
    marginTop: px(36),
    marginBottom: px(10),
    fontSize: px(38),
    color: '#646C75'
  },
  predictContent: {
    flex: 1
  }
});

export default Books;

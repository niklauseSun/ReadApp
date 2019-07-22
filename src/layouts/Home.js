/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList
} from "react-native";

import { Header, SearchBar, BookItem } from "../components"
import { px } from '../utils';

let bookList = [
  {
    name: 'test1',
    subTitle: 'test1'
  },
  {
    name: 'test2',
    subTitle: 'test1'
  },
  {
    name: 'test3',
    subTitle: 'test1'
  },
  {
    name: 'test4',
    subTitle: 'test4'
  },
]

class Home extends Component {
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
          <Header />
          <View style={styles.container}>
            <SearchBar />
            {/* <Text>home</Text> */}
            <FlatList
              style={{
                marginTop: px(42)
              }}
              data={bookList}
              renderItem={({ item, index }) => {
                return <BookItem item={item} />
              }}
              numColumns={3}
            />
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
    height: '100%',
    backgroundColor: '#F6F7FB'
  }

});

export default Home;

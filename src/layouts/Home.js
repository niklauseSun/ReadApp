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
import { getBookList, getBookIdList } from '../requests'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookIdList: [],
      bookDetailList: []
    };
  }

  componentDidMount() {
    this.getAllBookDetailList()
  }


  render() {
    const { bookDetailList } = this.state;
    console.log('render', bookDetailList)
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
              data={bookDetailList}
              renderItem={({ item, index }) => {
                return <BookItem item={item} />;
              }}
              numColumns={3}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // action
  getAllBookDetailList() {
    this.requestBookIdList();
    this.requestBookList();
  }

  requestBookIdList() {
    const data = {
      callback: this.requestBookIdListCallback.bind(this)
    }

    getBookIdList(data);
  }

  requestBookList() {
    const data = {
      callback: this.requestBookListCallback.bind(this)
    }

    getBookList(data);
  }

  requestBookIdListCallback(res) {
    const { error, data } = res;
    if (error == null) {
      global.bookIdList = data || [];
      this.setState({
        bookIdList: data
      })
    }
  }

  requestBookListCallback(res) {
    const { error, data } = res;
    console.log('requestbookdetail', res)
    if (error == null) {
      global.bookDetailList = data || [];
      console.log("????ddd")
      this.setState({
        bookDetailList: data
      });
    }
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

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
  FlatList,
  DeviceEventEmitter
} from "react-native";

import { Header, SearchBar, BookItem } from "../components"
import { px } from '../utils';
import { getBookList, getBookIdList } from '../requests'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookIdList: [],
      bookDetailList: [],
      isLongSelect: false,
      selectIds: []
    };
  }

  componentDidMount() {
    this.getAllBookDetailList();
    // 添加通知消息
    this.subscription = DeviceEventEmitter.addListener(
      "updateBookListEmit",
      this.updateBookList.bind(this)
    );
  }

  render() {
    const { bookDetailList } = this.state;
    console.log("render", bookDetailList);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header
            showRightButton={this.state.isLongSelect}
            rightButtonText={"取消"}
            rightButtonAction={this.cancelDelete.bind(this)}
          />
          <View style={styles.container}>
            <SearchBar />
            {/* <Text>home</Text> */}
            <FlatList
              style={{
                marginTop: px(42)
              }}
              data={bookDetailList}
              renderItem={({ item, index }) => {
                return (
                  <BookItem
                    changeLongSelect={this.changeLongSelect.bind(this)}
                    isLongSelect={this.state.isLongSelect}
                    navigation={this.props.navigation}
                    changeSelect={this.changeSelect.bind(this)}
                    item={item}
                    selectIds={this.state.selectIds}
                  />
                );
              }}
              numColumns={3}
            />
            {this.state.isLongSelect ? (
              <TouchableOpacity
                onPress={this.deleteAction.bind(this)}
                activeOpacity={0.7}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  // action
  getAllBookDetailList() {
    this.requestBookIdList();
    this.requestBookList();
  }

  changeLongSelect() {
    console.log("changeLongSelect");
    this.setState({
      isLongSelect: true
    });
  }

  changeSelect(articleid, isRemove) {
    let tmpArray = this.state.selectIds || [];
    if (isRemove) {
      let index = tmpArray.indexOf(articleid);
      if (index > -1) {
        tmpArray.splice(index, 1);
        this.setState({
          selectIds: tmpArray
        });
      }
    } else {
      tmpArray.push(articleid);
    }
  }

  cancelDelete() {
    this.setState({
      isLongSelect: false
    });
  }

  deleteAction() {
    if (this.state.selectIds.length == 0) {
      tshi.setState({
        isLongSelect: false
      })
    } else {
      
    }
  }

  requestBookIdList() {
    const data = {
      callback: this.requestBookIdListCallback.bind(this)
    };

    getBookIdList(data);
  }

  requestBookList() {
    const data = {
      callback: this.requestBookListCallback.bind(this)
    };

    getBookList(data);
  }

  requestBookIdListCallback(res) {
    const { error, data } = res;
    if (error == null) {
      global.bookIdList = data || [];
      this.setState({
        bookIdList: data
      });
    }
  }

  requestBookListCallback(res) {
    const { error, data } = res;
    console.log("requestbookdetail", res);
    if (error == null) {
      global.bookDetailList = data || [];
      console.log("????ddd");
      this.setState({
        bookDetailList: data
      });
    }
  }

  updateBookList() {
    console.log("updateBookList");
    this.setState({
      bookIdList: global.bookIdList,
      bookDetailList: global.bookDetailList
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB"
  },
  safeView: {
    flex: 1
  },
  content: {
    flex: 1,
    height: "100%",
    backgroundColor: "#F6F7FB"
  },
  deleteButton: {
    height: px(127),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  deleteButtonText: {
    color: "#4ABD76",
    fontSize: px(34)
  }
});

export default Home;

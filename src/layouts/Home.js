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
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";

import { Header, SearchBar, BookItem, AddItem } from "../components"
import { px } from '../utils';
import { getBookList, getBookIdList, saveBookIdList, saveBookDetailList } from '../requests'
import { _ } from 'lodash'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookIdList: [],
      bookDetailList: [],
      isLongSelect: false,
      selectIds: [],
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

    let dataArray = bookDetailList

    if (dataArray.length == 0 || dataArray[dataArray.length - 1].type != 1) {
      dataArray.push({type: 1})
    }

    console.log("render", bookDetailList, dataArray);
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
            <SearchBar
              onSearch={this.onSearch.bind(this)}
              goToHistory={this.goToHistory.bind(this)}
            />
            {/* <Text>home</Text> */}
            <FlatList
              style={{
                marginTop: px(42)
              }}
              extraData={this.state.selectIds}
              data={dataArray}
              renderItem={({ item, index }) => {
                console.log('item', item)
                if (item.type == 1) {
                  return <AddItem addBook={this.addBook.bind(this)} />
                }
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
      this.setState({
        isLongSelect: false
      });
    } else {
      const { selectIds, bookDetailList } = this.state;
      // for (let  )
      let lastDetails = _.remove(bookDetailList, (n) => {
        const { articleid } = n;
        console.log('removes', n, this.state.bookIdList)
        return selectIds.indexOf(articleid) > -1;
      })

      const ids = _.difference(this.state.bookIdList, selectIds)
      console.log('ids', ids, selectIds, this.state.bookDetailList)

      this.setState({
        bookIdList: ids,
        bookDetailList: bookDetailList,
        isLongSelect: false
      })
      saveBookIdList({ data: ids })
      saveBookDetailList({ data: bookDetailList })
      // console.log('lastDetails', lastDetails)
    }
  }

  onSearch() {
    console.log("search", this.props.navigation);
    this.props.navigation.navigate("SearchView");
  }

  addBook() {
    this.props.navigation.navigate("SearchView")
  }

  goToHistory() {
    console.log("goToHistory")
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
    backgroundColor: "#F6F7FB",
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

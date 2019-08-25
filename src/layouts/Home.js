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
  TouchableOpacity,
  NativeModules,
  Modal,
  Platform
} from "react-native";

import { Header, SearchBar, BookItem, AddItem } from "../components"
import { px } from '../utils';
import { getBookList, getBookIdList, saveBookIdList, saveBookDetailList, getAd } from '../requests'
import { _ } from 'lodash'
import { WebView } from 'react-native-webview';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookIdList: [],
      bookDetailList: [],
      isLongSelect: false,
      selectIds: [],
      showAd:true,
      adUrl: null
    };
  }

  componentDidMount() {
    this.getAllBookDetailList();
    this.requestAd();

    this.gotoBookContent();
    // 添加通知消息
    this.subscription = DeviceEventEmitter.addListener(
      "updateBookListEmit",
      this.updateBookList.bind(this)
    );
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.subscription.remove();
    this.bookTimer && clearTimeout(this.bookTimer);
  }

  render() {
    const { bookDetailList, showAd } = this.state;

    let dataArray = bookDetailList

    if (dataArray.length == 0 || dataArray[dataArray.length - 1].type != 1) {
      dataArray.push({type: 1})
    }

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
      </script></html>`


    const iosHtml = `<html><script type="text/javascript" src="${this.state.adUrl}"></script></html>`

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header
            showRightButton={this.state.isLongSelect}
            rightButtonText={"取消"}
            rightButtonAction={this.cancelDelete.bind(this)}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showAd}
            >
              <SafeAreaView style={{
                height: '100%',
                width: '100%'
              }}>

              {
                Platform.OS == "ios" ? <WebView
                  source={{ html: iosHtml}}
                  style={{ width: '100%', height: '100%' }}
                /> : this.state.adUrl == null ? null : <WebView
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                    source={{ html: htmlContent }}
                    javaScriptEnabled={true}
                    injectedJavaScript={`document.write('<script src="${this.state.adUrl}"></script>')`}
                  />
              }
              
              </SafeAreaView>
            </Modal>
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

  // action
  getAllBookDetailList() {
    // this.requestBookIdList();
    this.requestBookList();
  }

  changeLongSelect() {
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
        return selectIds.indexOf(articleid) > -1;
      })

      const ids = _.difference(this.state.bookIdList, selectIds)

      this.setState({
        bookDetailList: lastDetails,
        isLongSelect: false
      })
      saveBookDetailList({ data: bookDetailList })

      DeviceEventEmitter.emit("updateBookListEmit");
    }
  }

  onSearch() {
    this.props.navigation.navigate("SearchView");
  }

  addBook() {
    this.props.navigation.navigate("SearchView")
  }

  goToHistory() {
    this.props.navigation.navigate('ReadHistory')
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
    if (error == null) {
      global.bookDetailList = data || [];

      let tmpArray = global.bookDetailList.filter((item) => {
        return item.isAdded;
      })

      console.log('tmpArray', tmpArray)

      this.setState({
        bookDetailList: tmpArray
      });
    }
  }

  updateBookList() {
    let tmpArray = global.bookDetailList.filter((item) => {
      return item.isAdded;
    })
    this.setState({
      // bookIdList: global.bookIdList,
      bookDetailList: tmpArray
    });
  }

  requestAd() {
    const data = {
      callback: this.requestAdCallback.bind(this),
      adType: 1
    }
    getAd(data)
  }

  requestAdCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      const { Url= null} = data;
      this.setState({
        adUrl: Url,
        showAd: true
      })

      this.timer = setTimeout(() => {
        this.setState({
          showAd: false,
        })
      }, 5000)
    } else {
      this.setState({
        showAd: false
      })
    }
  }

  getLocalAd() {

  }

  gotoBookContent() {
    this.bookTimer = setTimeout(() => {
      if (global.bookDetailList.length != 0) {
        const bookItem = global.bookDetailList[0];
        const {
          chapterIndex,
          articleid
        } = bookItem

        this.props.navigation.navigate("BookContent", {
          articleid: articleid,
          chapterIndex: chapterIndex
        });
      }
    }, 5000)
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

import React, { Component } from 'react'
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter
} from "react-native";
import { getMenuList, saveBookDetailList, getBookDetail } from "../requests";
import { px } from '../utils'
import { Header, FooterView, Hud } from '../components';
import { _ } from 'lodash'
import { Toast } from '@ant-design/react-native'

export class MenuList extends Component {
  constructor(props) {
      super(props);
      const { articleid } = props.navigation.state.params || {};
      this.state = {
        pageIndex: 1,
        articleid: articleid,
        totalPage: null,
        menuList: [],
        isRefresh: false,
        bookDetail: null,
        chapterIndex: 0
      };
  }

  componentDidMount() {
    this.getMenuListAction();
  }

    render() {
        const { menuList } = this.state;
        console.log("menuList", menuList);
        return (
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeView}>
              <Header title={""} showBackButton={true} navigation={this.props.navigation} />
              <Text style={styles.menuText}>目录</Text>
              <FlatList
                data={menuList}
                renderItem={this.renderItem.bind(this)}
                refreshControl={
                  <RefreshControl
                    title={"Loading"}
                    refreshing={this.state.isRefresh}
                    onRefresh={() => {
                      this._onRefresh();
                    }}
                  />
                }
                onEndReached={this.loadMore.bind(this)}
                // onEndReachedThreshold={0.1}
                refreshing={this.state.isRefresh}
                ListFooterComponent={() => <FooterView />}
              />
            </SafeAreaView>
          </View>
        );
    }

    // render
    renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={this.requestBookDetail.bind(this, {item})}
          style={styles.itemContent}>
          <Text style={styles.chapterName}>{item.chaptername}</Text>
        </TouchableOpacity>
      );
    };

    // method

    // request
    getMenuListAction() {
      Hud.show()
      const data = {
          pageSize: 10,
          pageIndex: this.state.pageIndex,
          callback: this.getMenuListCallback.bind(this),
          articleid: this.state.articleid
      };
      getMenuList(data);
    }

    _onRefresh() {

        this.setState({
            menuList: []
        })

        const data = {
            pageSize: 10,
            pageIndex: 1,
            callback: this.getMenuListCallback.bind(this),
            articleid: this.state.articleid
        }
        getMenuList(data);

        setTimeout(() => {
            this.setState({
              isRefresh: false
            });
        }, 6000)

    }

    loadMore() {
      const data = {
        pageSize: 10,
        pageIndex: this.state.pageIndex + 1,
        callback: this.getMenuListCallback.bind(this),
        articleid: this.state.articleid
      };
      getMenuList(data);
    }

    getMenuListCallback(res) {
      Hud.hidden();
      console.log("getMenuListCallback", res);
      const { state, page, data } = res;
      if (state == 1) {
        const { totalPage, pageIndex } = page;
        this.setState({
          totalPage: totalPage,
          pageIndex: pageIndex,
          menuList: this.state.menuList.concat(data),
          isRefresh: false
        });
      }
    }

  itemToArrayTop(Arr, index) {
    console.log('itemtoArrayTop', Arr, index)
    let tmp = Arr[index];
    if (index == 0) {
      return Arr;
    }
    for (let i = 0; i < Arr.length; i++) {
      if (Arr[i].articleid == Arr[index].articleid) {
        Arr.splice(i, 1);
        break;
      }
    }
    tmp.nowDate = new Date();
    Arr.unshift(tmp);
    return Arr;
  }

  // request
  requestBookDetail({item}) {
    const { articleid, chapterorder } = item
    this.setState({
      chapterIndex: chapterorder - 1
    }, () => {
      const data = {
        articleid: articleid,
        callback: this.bookDetailCallback.bind(this)
      }
      getBookDetail(data);
    })
  }

  // callback
  bookDetailCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      console.log('bookdetailcallback', data)
      this.setState({
        bookDetail: data
      }, () => {
        this.goToBookContent()
      });
    }
  }

  goToBookContent() {
    const { chaptername, articleid } = this.state.bookDetail;
    let testArray = [...global.bookDetailList]
    let bookIndex = _.findIndex(testArray, {
      'articleid': articleid
    });

    if (bookIndex == -1) {
      // 未添加
      let nowDate = new Date();
      const data = {
        nowDate: nowDate,
        chapterIndex: this.state.chapterIndex,
        isAdded: false,
        ...this.state.bookDetail
      }

      global.bookDetailList.unshift(data);
      saveBookDetailList({ data: global.bookDetailList })
      DeviceEventEmitter.emit("updateBookListEmit");
    } else {
      let tmpArray = this.itemToArrayTop(testArray, bookIndex)
      
      global.bookDetailList = tmpArray;
      global.bookDetailList[0].chapterIndex = this.state.chapterIndex
      global.bookDetailList[0].nowDate = new Date();

      saveBookDetailList({
        data: global.bookDetailList
      })
      DeviceEventEmitter.emit("updateBookListEmit");
    }
    this.props.navigation.navigate("BookContent", {
      articleid: articleid,
      chapterIndex: this.state.chapterIndex,
      chaptername: chaptername
    })
  }
  componentWillUnmount() {
    this.timer = null;
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
  menuText: {
    marginLeft: px(120),
    fontSize: px(38),
    color: "#656E79",
    marginTop: px(30),
    marginBottom: px(30)
  },
  itemContent: {
    height: px(100),
    //   alignItems: "center"
    justifyContent: "center",
    paddingLeft: px(120)
  },
  chapterName: {
    color: "#656E79",
    fontSize: px(30)
  }
});

export default MenuList

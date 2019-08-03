import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} from "react-native";
import { px } from '../utils'
import { Header, Hud } from '../components';
import { getBookDetail, saveBookIdList, saveBookDetailList } from "../requests";
import { Toast } from "@ant-design/react-native";
import { ASSET_IMAGES } from '../config';
import {
  _
} from 'lodash'

export default class BookDetail extends Component {

  constructor(props) {
    super(props);
    const { articleid, chapterid = 0 } = props.navigation.state.params || {};
    this.state = {
      articleid: articleid,
      chapterid: chapterid,
      bookDetail: null
    };
  }

  componentDidMount() {
    this.requestBookDetail()
  }

  render() {
    const { bookDetail } = this.state;

    if (bookDetail == null) {
      return null;
    }

    const {
      articlename,
      author,
      image,
      intro,
      chapters,
      size
    } = bookDetail

    const htmlStr = `<div style="white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;">${intro}</div>`;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header
            showBackButton={true}
            title=""
            navigation={this.props.navigation}
          />
          <View style={styles.content}>
            <ScrollView>
              <View style={styles.headView}>
                {/* <View style={styles.image}>
                  <Text>test</Text>
                </View> */}
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.headInfo}>
                  <Text style={styles.name}>{articlename}</Text>
                  <Text style={styles.author}>{author}</Text>
                  <Text style={styles.textNum}>共{size}字</Text>
                </View>
              </View>
              <View style={styles.info}>
                <Text numberOfLines={5} style={styles.infoText}>
                  {intro}
                </Text>
                {/* <HTML
                  baseFontStyle={{
                    lineHeight: px(52),
                    fontSize: px(32),
                  }}
                  // numberOfLines={5}
                  // conta={styles.infoText}
                  html={htmlStr}
                /> */}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.goToMenuList.bind(this)}
                style={styles.menu}
              >
                <Text style={styles.menuText}>目录</Text>
                <Text style={styles.menuInfoText}>共{chapters}章</Text>
                <View style={styles.menuIcon}>
                  <Image source={ASSET_IMAGES.ICON_ARROW_RIGHT} />
                </View>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottomView}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.addButton}
                onPress={this.addBookAction.bind(this)}
              >
                <View style={styles.addButtonView}>
                  <Image source={ASSET_IMAGES.ICON_BOOK_ADD} />
                  <Text style={styles.addText}>加入书架</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.readButton}
                onPress={this.goToBookContent.bind(this)}
              >
                <Text style={styles.readText}>免费阅读</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // method 
  goToMenuList() {
    const { articleid } = this.state.bookDetail
    this.props.navigation.navigate("MenuList", { articleid: articleid });
    // getMenuList = ({articleid, pageIndex = 1, pageSize = 10, callback = null})
  }

  goToBookContent() {
    console.log('gotoContent', this.state.bookDetail, this.state.chapterid)
    const {
      articleid
    } = this.state.bookDetail
    if (global.bookIdList.indexOf(articleid) == -1) {
      console.log('test')
    } else {
      let testArray = [...global.bookDetailList]
      let index = _.findIndex(testArray, {
        'articleid': articleid
      });
      // let index = testArray.indexOf(this.props.bookDetail);
      let tmpArray = this.itemToArrayTop(testArray, index)

      console.log('item temp Array', testArray, indexedDB)

      global.bookDetailList = tmpArray;

      saveBookDetailList({
        data: global.bookDetailList
      })
      DeviceEventEmitter.emit("updateBookListEmit");
    }

    this.props.navigation.navigate("BookContent", {
      articleid: articleid,
      chapterid: this.state.chapterid
    })
  }

  addBookAction() {
    const { articleid } = this.state.bookDetail;
    let nowDate = new Date()
    const data = {
      nowDate: nowDate,
      charterIndex: 0,
      ...this.state.bookDetail
    }

    if (global.bookIdList.indexOf(articleid) == -1) {

      global.bookIdList.push(articleid);
      global.bookDetailList.unshift(data);
      saveBookIdList({data: global.bookIdList })
      saveBookDetailList({data: global.bookDetailList })
      Toast.show("添加成功！")
      DeviceEventEmitter.emit("updateBookListEmit");
    } else {
      Toast.show("本书已添加到书库中！")
    }

  }


  // request
  requestBookDetail() {
    const data = {
      articleid: this.state.articleid,
      callback: this.bookDetailCallback.bind(this)
    }
    getBookDetail(data);
    Hud.show();
  }

  // callback
  bookDetailCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        bookDetail: data
      });
      Hud.hidden()
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
    paddingVertical: px(30),
    height: px(326)
  },
  infoText: {
    fontSize: px(32),
    lineHeight: px(52),
  },
  menu: {
    height: px(140),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginTop: px(20),
    alignItems: "center",
    marginBottom: px(20)
  },
  menuText: {
    marginLeft: px(30),
    marginRight: px(30),
    color: "#656E79",
    fontSize: px(32)
  },
  menuInfoText: {
    flex: 1,
    color: "#656E79",
    fontSize: px(32)
  },
  menuIcon: {
    marginRight: px(30)
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
    height: px(120),
    justifyContent: 'center'
  },
  addButtonView: {
    alignItems: 'center'
  },
  addText: {
    marginTop: px(10),
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

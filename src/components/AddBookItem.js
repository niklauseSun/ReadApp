import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { px } from '../utils';
import { ASSET_IMAGES } from '../config'
import { Toast } from '@ant-design/react-native'
import { saveBookIdList, saveBookDetailList, getBookDetail } from '../requests'
import { Hud } from '../components'

export default class AddBookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDetail: null
    };
  }

  render() {

    const {
      articlename = "",
      intro = "",
      image
    } = this.props.item || {};

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.goToDetail.bind(this)}
        style={styles.container}>
        {/* <View style={styles.image}>
          <Text>test</Text>
        </View> */}
        <Image style={styles.image} source={{ uri: image }} />
        {this.renderTagView()}
        <View style={styles.detail}>
          <Text style={styles.name}>{articlename}</Text>
          <Text style={styles.info} numberOfLines={2}>
            {intro}
          </Text>
          <View style={styles.addButtonView}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.requestBookDetail.bind(this)}
              style={styles.addButton}>
              <Text style={styles.addButtonText}>加入书架</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  renderTagView() {
    const { rate } = this.props;
    switch(rate) {
      case 0:
        return <Image source={ASSET_IMAGES.ICON_RATE_ONE} />
      case 1:
        return <Image source={ASSET_IMAGES.ICON_RATE_TWO} />
      case 2:
        return <Image source={ASSET_IMAGES.ICON_RATE_THREE} />
    }
  }

  goToDetail() {
    const { articleid } = this.props.item || {};
    this.props.navigation.navigate("BookDetail", {
      articleid: articleid
    });
  }

  addBookAction() {
    const { articleid } = this.state.bookDetail;
    let nowDate = new Date()
    const data = {
      nowDate: nowDate,
      charterIndex: 0,
      ...this.state.bookDetail
    }

    console.log('addBookAction', data)

    if (global.bookIdList.indexOf(articleid) == -1) {
      console.log("数据中没有这个数据")

      global.bookIdList.push(articleid);
      global.bookDetailList.unshift(data);

      console.log('dddd', global.bookDetailList, global.bookIdList)
      saveBookIdList({ data: global.bookIdList })
      saveBookDetailList({ data: global.bookDetailList })
      Toast.show("添加成功！")
      DeviceEventEmitter.emit("updateBookListEmit");
    } else {
      Toast.show("本书已添加到书库中！")
    }

  }

  // request
  requestBookDetail() {
    const { articleid } = this.props.item
    const data = {
      articleid: articleid,
      callback: this.bookDetailCallback.bind(this)
    }
    getBookDetail(data);
    Hud.show();
  }

  // callback
  bookDetailCallback(res) {
    console.log('bookDetail', res)
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        bookDetail: data
      }, () => {
        this.addBookAction()
      });
      Hud.hidden()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: px(30),
    paddingRight: px(30),
    flexDirection: 'row',
    marginTop: px(43),
  },
  image: {
    height: px(180),
    width: px(122),
  },
  tagView: {
    height: px(140),
    width: px(64),
    marginLeft: px(-6),
    marginRight: px(28)
  },
  detail: {
    flex: 1
  },
  name: {
    marginTop: px(11),
    fontSize: px(34),
    color: '#333333'
  },
  info: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(6)
  },
  addButtonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  addButton: {
    height: px(56),
    width: px(156),
    borderColor: '#4FBF7A',
    borderWidth: px(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(8),
  },
  addButtonText: {
    color: '#4FBF7A',
    fontSize: px(30)
  }
});
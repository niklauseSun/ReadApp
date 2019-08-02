import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';
import { saveBookDetailList } from '../requests'

export default class BookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
      index : -1,
    };
  }

  componentDidMount() {
    const {
      articleid
    } = this.props.item || {};
    let ind = this.props.selectIds.indexOf(articleid)
    this.setState({
      index: ind,
    })
  }

  render() {
    console.log("bookItem", this.props.item);
    const {
      articlename = "name",
      charterIndex,
      chapters,
      image,
      articleid
    } = this.props.item || {};

    const { isLongSelect, selectIds } = this.props;

    console.log('isLongSelect',this.props, isLongSelect)

    const { index } = this.state;
    // let index = selectIds.indexOf(articleid);
    // index > -1 时被选中
    return (
      <TouchableOpacity
        onLongPress={this.onLongAction.bind(this)}
        onPress={this.goToBookContent.bind(this)}
        style={styles.container}
        activeOpacity={isLongSelect ? 1 : 0.7}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.selectButton}
          onPress={this.selectBook.bind(this)}
        >
          {isLongSelect ? <View style={styles.selectView}>
            {index > -1 ? <Image source={ASSET_IMAGES.ICON_SELECTED} />: <Image source={ASSET_IMAGES.ICON_SELECT} />}
          </View> : null}
        </TouchableOpacity>
        <View style={styles.detail}>
          <Image style={styles.image} source={{ uri: image }} />
          <Text numberOfLines={1} style={styles.name}>
            {articlename}
          </Text>
          <Text style={styles.subTitle}>
            还剩{chapters - charterIndex}章未读
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  goToBookContent() {
    if (!this.state.isLongSelect) {
      let testArray = [ ...global.bookDetailList ]
      let index = testArray.indexOf(this.props.item);
      let tmpArray = this.itemToArrayTop(testArray, index)

      global.bookDetailList = tmpArray;

      saveBookDetailList({ data: global.bookDetailList })
      DeviceEventEmitter.emit("updateBookListEmit");

      const {
        charterIndex,
        articleid
      } = this.props.item

      this.props.navigation.navigate("BookContent", {
        articleid: articleid,
        chapterid: charterIndex
      });
    }
  }

  onLongAction() {
    const { changeLongSelect } = this.props
    console.log('longAction')
    changeLongSelect()
  }

  selectBook() {
    const { changeSelect, selectIds } = this.props;
    const { articleid } = this.props.item || {};

    console.log('selectBook')
    if (selectIds.indexOf(articleid) > -1) {
      changeSelect(articleid, true)
      
    } else {
      changeSelect(articleid, false)
    }
    this.setState({
      index: selectIds.indexOf(articleid)
    })
  }

  itemToArrayTop(Arr, index) {
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
    width: '33%',
    // alignItems: 'center',
    paddingTop: px(20),
    // backgroundColor: 'blue'
  },
  detail: {
    paddingLeft: px(30),
    // backgroundColor: 'yellow'
  },
  selectButton: {
    width: px(60),
    height: px(60),
    position: 'relative',
    marginBottom: px(-30),
    marginLeft: px(170),
    zIndex: 999,
    borderRadius: px(30),
  },
  selectView: {
    width: '100%',
    height: '100%',
    borderRadius: px(30)
  },
  image: {
    height: px(256),
    width: px(176),
  },
  name: {
    marginTop: px(20),
    fontSize: px(28),
    color: '#333333'
  },
  subTitle: {
    marginTop: px(6),
    marginBottom: px(30),
    fontSize: px(26),
    color: '#999999'
  },
});
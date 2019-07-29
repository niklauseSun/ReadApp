import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';

export default class BookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false
    };
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

    let index = selectIds.indexOf(articleid);
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
      this.props.navigation.navigate("BookContent");
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

    if (selectIds.indexOf(articleid) > -1) {
      changeSelect(articleid, true)
    } else {
      changeSelect(articleid, false)
    }

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
    // backgroundColor: 'red',
    position: 'relative',
    marginBottom: px(-30),
    marginLeft: px(170),
    zIndex: 999,
    borderRadius: px(30),
  },
  selectView: {
    backgroundColor: 'red',
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
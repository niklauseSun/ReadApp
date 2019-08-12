import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { px } from "../utils"

export default class ReadHistoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { articlename = "", nowDate = "" } = this.props.item
    return (
      <TouchableOpacity onPress={this.goToBookDetail.bind(this)} style={styles.container}>
        <Text style={styles.titleStyle}>{articlename}</Text>
        <Text style={styles.subStyle}>{new Date(nowDate).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  }

  goToBookDetail() {
    const { index = 0 } = this.props;

    if (global.bookDetailList.length != 0) {
      const bookDetail = global.bookDetailList[index];

      console.log('bookDetail', bookDetail);

      const {
        chapterIndex,
        articleid
      } = bookDetail;

      this.props.navigation.navigate("BookDetail", {
        articleid: articleid,
        chapterIndex: chapterIndex
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: px(113),
    justifyContent: 'center'
  },
  titleStyle: {
    fontSize: px(30),
    color: '#333333',
    marginLeft: px(90),
  },
  subStyle: {
    marginTop: px(10),
    fontSize: px(26),
    color: '#999999',
    marginLeft: px(90),
  }
})

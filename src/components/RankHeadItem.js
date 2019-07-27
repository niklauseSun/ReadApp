import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px } from '../utils';

export default class RankHeadItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      articlename = "",
      author = "",
      info = "",
      image
    } = this.props.item || {};
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.gotoBookDetail.bind(this)}
        style={styles.container}
      >
        <Image style={styles.image} source={{ uri: image }} />
        <View style={styles.detail}>
          <Text style={styles.name}>{articlename}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.info}>{info}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  gotoBookDetail() {
    if (this.props.navigation) {
      const { articleid } = this.props.item || {}
      this.props.navigation.navigate("BookDetail", {
        articleid: articleid
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: px(169),
    paddingLeft: px(30),
    paddingRight: px(30),
    flexDirection: 'row',
    width: '100%'
  },
  image: {
    width: px(113),
    marginRight: px(42)
  },
  detail: {
    flex: 1
  },
  name: {
    fontSize: px(34),
    color: '#333333',
    marginTop: px(8)
  },
  author: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(8)
  },
  info: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(8)
  }
})

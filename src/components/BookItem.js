import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { px } from '../utils'

export default class BookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('bookItem', this.props.item)
    const { articlename = "name", charterIndex, chapters, image } =
      this.props.item || {};
    return (
      <View style={styles.container}>
        <View style={styles.detail}>
          <Image style={styles.image} source={{ uri: image }} />
          <Text numberOfLines={1} style={styles.name}>{articlename}</Text>
          <Text style={styles.subTitle}>还剩{chapters-charterIndex}章未读</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '33%',
    alignItems: 'center',
    paddingTop: px(60),
  },
  detail: {
    paddingLeft: px(30)
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
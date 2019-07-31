import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { px } from '../utils'
import { ASSET_IMAGES } from '../config'

export default class SetItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title = "清除缓存", action = null, img } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={action}
        style={styles.container}>
        <Image style={styles.itemImg} source={img} />
        <Text style={styles.title}>{title}</Text>
        <Image style={styles.arrow} source={ASSET_IMAGES.ICON_ARROW_RIGHT} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: px(113),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImg: {
    width: px(40),
    height: px(40),
    marginLeft: px(30),
  },
  title: {
    flex: 1,
    marginLeft: px(24),
    fontSize: px(32),
    color: '#404040'
  },
  arrow: {
    width: px(20),
    height: px(20),
    marginRight: px(30),
  }
})
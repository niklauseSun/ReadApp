import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { px } from '../utils'

export default class SetItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title = "清除缓存", action = null } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={action}
        style={styles.container}>
        <View style={styles.itemImg}></View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.arrow}></View>
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
    backgroundColor: 'blue',
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
    backgroundColor: 'red',
    marginRight: px(30),
  }
})
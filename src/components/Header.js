import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { px } from '../utils'

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title = "首页" } = this.props

    return (
      <View style={styles.header}>
        <Text style={styles.titleStyle}>{title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 45,
    alignItems: "center",
    justifyContent: "center"
  },
  titleStyle: {
    fontSize: px(32)
  }
});

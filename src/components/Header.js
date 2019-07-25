import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { px } from '../utils'

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title = "首页", showBackButton = false } = this.props

    return (
      <View style={styles.header}>
        <View style={styles.left}>
          {
            showBackButton? <TouchableOpacity onPress={this.goBack.bind(this)}><Text>返回</Text></TouchableOpacity>: null
          }
        </View>
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.right} />
      </View>
    );
  }

  goBack() {
    if (this.props.navigation) {
      this.props.navigation.goBack();
    }
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  titleStyle: {
    fontSize: px(32)
  },
  left: {
    flex: 1,
    marginLeft: px(30)
  },
  right: {
    flex: 1,
    marginRight: px(30)
  }
});

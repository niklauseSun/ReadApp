import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { px } from '../utils'

export default class FooterView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> - 没有更多了 - </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: px(100),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: px(26),
    color: '#d7d7d7'
  }
})

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { px } from "../utils"

export default class ReadHistoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { articlename = "", nowDate = "" } = this.props.item
    console.log('item', this.props)
    return (
      <View style={styles.container}>
        <Text style={styles.titleStyle}>{articlename}</Text>
        <Text style={styles.subStyle}>{new Date(nowDate).toLocaleString()}</Text>
      </View>
    );
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

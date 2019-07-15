import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { px } from '../utils'

export default class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{
        backgroundColor: '#EBEBEB',
        height: px(1),
        // width: '100%',
        marginLeft: px(30),
        marginRight: px(30)
      }}>
      </View>
    );
  }
}

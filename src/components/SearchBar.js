import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { px } from '../utils'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} />
        <Text style={styles.history}>历史记录</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: px(30),
    marginRight: px(21),
    height: px(80),
    borderRadius: px(8),
    shadowColor: 'gray',
  },
  history: {
    marginRight: px(30)
  }
});
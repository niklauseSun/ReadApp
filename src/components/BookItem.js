import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { px } from '../utils'

export default class BookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { name = "name", subTitle = "subTitle" } = this.props.item || {}
    return (
      <View style={styles.container}>
        <View style={styles.detail}>
          <View style={styles.image}>
            <Text>test</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '33%',
    backgroundColor:'blue',
    alignItems: 'center',
    paddingTop: px(60),

  },
  detail: {

  },
  image: {
    height: px(256),
    width: px(176),
    backgroundColor: 'red',
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
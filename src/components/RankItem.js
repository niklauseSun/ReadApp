import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px } from '../utils';

export default class RankItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { name = "白发王妃", author = "lisa", image } = this.props.item || {}
    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.container}>
        {/* <View style={styles.image}> */}
        {/* <Text>test</Text> */}
        <Image style={styles.image} source={{ uri: image }} />
        {/* </View> */}
        <View style={styles.detail}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    flexDirection: 'row'
  },
  image: {
    height: px(168),
    width: px(113),
    marginLeft: px(30),
    marginRight: px(42),
    backgroundColor: 'red'
  },
  detail: {

  },
  name: {
    fontSize: px(34),
    color: '#333333',
    marginTop: px(35),
  },
  author: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(36)
  }
});
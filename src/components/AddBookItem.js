import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { px } from '../utils';

export default class AddBookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    const { name = "天极", info = "不远处的中年妇女身影轻轻一动， 那惊人的速度又再次展现出来…" } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.image}>
          <Text>test</Text>
        </View>
        <View style={styles.tagView}>

        </View>
        <View style={styles.detail}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>{info}</Text>
          <View style={styles.addButtonView}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>加入书架</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: px(30),
    paddingRight: px(30),
    flexDirection: 'row',
    marginTop: px(43),
  },
  image: {
    height: px(180),
    width: px(122),
    backgroundColor: 'red'
  },
  tagView: {
    height: px(140),
    width: px(64),
    marginLeft: px(-6),
    backgroundColor: 'blue',
    marginRight: px(28)
  },
  detail: {
    flex: 1
  },
  name: {
    marginTop: px(11),
    fontSize: px(34),
    color: '#333333'
  },
  info: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(6)
  },
  addButtonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  addButton: {
    height: px(56),
    width: px(156),
    borderColor: '#4FBF7A',
    borderWidth: px(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(8),
  },
  addButtonText: {
    color: '#4FBF7A',
    fontSize: px(30)
  }
});
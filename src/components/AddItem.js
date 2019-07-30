import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';
export default class AddItem extends Component {
  render() {
    const { addBook } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={addBook} activeOpacity={0.7} style={styles.addButton}>
          <View style={styles.addIcon}>
            <Image source={ASSET_IMAGES.ICON_ADD} />
          </View>
          <Text style={styles.addButtonText}>发现更多好书</Text>
        </TouchableOpacity>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '33%',
    paddingTop: px(20),
    paddingLeft: px(30),
    marginTop: px(30)
  },
  addButton: {
    height: px(256),
    width: px(176),
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  addIcon: {
    height: px(186),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BABBBF',
    width: '100%'
  },
  addIconText: {
    fontSize: px(100)
  },
  addButtonText: {
    marginTop: px(18),
    fontSize: px(24),
    color: '#999999'
  }
})

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title = "首页", showBackButton = false, showRightButton = false, rightButtonText, rightButtonAction } = this.props

    return (
      <View style={styles.header}>
        <View style={styles.left}>
          {showBackButton ? (
            <TouchableOpacity style={styles.goBack} onPress={this.goBack.bind(this)}>
              <Image style={{ width: px(48), height: px(48)}} source={ASSET_IMAGES.ICON_GO_BACK} />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.right}>{showRightButton ? (
          <TouchableOpacity activeOpacity={0.7} style={styles.rightButton} onPress={rightButtonAction}>
            <Text style={styles.rightButtonText}>{rightButtonText}</Text>
          </TouchableOpacity>
        ): null}</View>
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
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
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
  },
  rightButton: {
    alignItems: 'flex-end'
  },
  rightButtonText: {
    fontSize: px(30),
    color: '#333'
  },
  goBack: {
    width: px(120),
    height: px(120),
  }
});

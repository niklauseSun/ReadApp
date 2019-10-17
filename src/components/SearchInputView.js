import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput } from "react-native";
import { px } from "../utils";
import { ASSET_IMAGES } from "../config";

export default class SearchInputView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onCancel, onSearchAction, onChangeText, value } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputContent}>
          <Image source={ASSET_IMAGES.ICON_SEARCH} />
          <TextInput
            placeholder={"搜索你感兴趣的内容"}
            placeholderTextColor={"#999999"}
            style={styles.input}
            returnKeyType={"search"}
            onSubmitEditing={onSearchAction}
            onChangeText={onChangeText}
            clearButtonMode={"while-editing"}
            value={value}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onCancel}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: px(80),
    width: "100%",
  },
  inputContent: {
    flexDirection: 'row',
    marginLeft: px(30),
    marginRight: px(21),
    height: px(80),
    borderRadius: px(8),
    // borderWidth: px(1),
    shadowColor: "#333",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingLeft: px(30),
  },
  input: {
    flex: 1,
    marginLeft: px(20)
  }, 
  history: {
    marginRight: px(30)
  },
  cancelText: {
    marginRight: px(30),
    fontSize: px(32),
    color: "#333333"
  }
});

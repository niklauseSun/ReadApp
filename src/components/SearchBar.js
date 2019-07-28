import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text
} from "react-native";
import { px } from '../utils'
import { ASSET_IMAGES } from '../config'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { onSearch, goToHistory, isSearchStatus = false } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onSearch}
          activeOpacity={0.8}
          style={styles.input}
        >
          <Image source={ASSET_IMAGES.ICON_SEARCH} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={goToHistory}>
          { isSearchStatus? <Text style={styles.cancelText}>取消</Text>: <Image
            source={ASSET_IMAGES.ICON_HISTORY}
            style={styles.history}
          />  }
          
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
    width: "100%"
  },
  input: {
    marginLeft: px(30),
    marginRight: px(21),
    height: px(80),
    borderRadius: px(8),
    shadowColor: "gray",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: px(30)
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
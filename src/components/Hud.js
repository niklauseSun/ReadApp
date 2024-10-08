import React, { PureComponent } from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions, Text } from "react-native";
import RootSiblings from "react-native-root-siblings"
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import { px } from '../utils'

let sibling = undefined;

const HUD = {

  show: () => {
    sibling = new RootSiblings(
      <View style={styles.maskStyle}>
        <View style={styles.backViewStyle}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.hubText}>正在加载</Text>
        </View>
      </View>
    )
  },

  hidden: ()=> {
    if (sibling instanceof RootSiblings) {
      sibling.destroy()
    }
  }

}

const styles = StyleSheet.create({
  maskStyle: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center"
  },
  backViewStyle: {
    backgroundColor: "#111",
    width: 120,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  hubText: {
    color: 'white',
    fontSize: px(28),
    marginTop: px(6)
  }
});

export default HUD
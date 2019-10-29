import React, { Component } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native'
import { ASSET_IMAGES } from "../config";
import { px } from "../utils";


export default class RankHead extends Component {
    render() {
        const { title = "主排行" } = this.props
        return (
          <View
            style={{
              alignItems: "center",
              width: "100%",
              marginBottom: px(30),
              height: px(80)
            }}
          >
            <Image
              style={{
                width: px(160),
                height: px(24),
                marginTop: px(70)
              }}
              source={ASSET_IMAGES.ICON_RANK_BACKGROUND}
            />
            <Text
              style={{
                fontSize: px(38),
                color: "#646C75",
                marginTop: px(-50)
              }}
            >
              {title}
            </Text>
          </View>
        );
    }
}

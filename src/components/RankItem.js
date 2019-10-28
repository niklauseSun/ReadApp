import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px } from '../utils';
import { ASSET_IMAGES } from '../config';

export default class RankItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDefault: false
    };
  }

  render() {
    const { articlename = "", author = "", image } =
      this.props.item || {};
    return (
      <TouchableOpacity
        onPress={this.goToNext.bind(this)}
        activeOpacity={0.7}
        style={styles.container}
      >
        {/* <View style={styles.image}> */}
        {/* <Text>test</Text> */}
        {/* {image == null ? <Image style={styles.image} source={ASSET_IMAGES.ICON_DEFAULT} /> : <Image style={styles.image} source={{ uri: image }} />} */}
        {image == null ? (
          <Image style={styles.image} source={ASSET_IMAGES.ICON_DEFAULT} />
        ) : (
          <Image
            onError={error => {
              this.setState({
                showDefault: true
              });
            }}
            style={styles.image}
            source={this.state.showDefault? ASSET_IMAGES.ICON_DEFAULT : { uri: image }}
          />
        )}
        {/* </View> */}
        <View style={styles.detail}>
          <Text numberOfLines={1} style={styles.name}>
            {articlename}
          </Text>
          <Text style={styles.author}>{author}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  goToNext() {
    const { articleid } = this.props.item || {};
    this.props.navigation.navigate("BookDetail", {
      articleid: articleid
    });
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
  },
  detail: {
    flex: 1
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
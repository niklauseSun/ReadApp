import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px } from '../utils';
import { ASSET_IMAGES } from '../config';

export default class RankHeadItem extends Component {
  constructor(props) {
    super(props);
    const {item = {}} = props;
    const { image = null} = item;
    this.state = {
      stateImage: { uri: image }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item = {}} = this.props;
    const { image: propsImage = null } = item;

    const { item: nextItem = null } = nextProps;
    const { image: nextImage = null } = nextItem;

    console.log("receive", propsImage, nextImage, nextProps);

    if (propsImage != nextImage) {
      this.setState({
        stateImage: { uri: nextImage }
      });
    }
  }

  render() {
    const {
      articlename = "",
      author = "",
      info = "",
      image = null
    } = this.props.item || {};

    console.log("render111", this.state.stateImage, this.props.item, image);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.gotoBookDetail.bind(this)}
        style={styles.container}
      >
        {/* {image == null ? <Image style={styles.image} source={ASSET_IMAGES.ICON_DEFAULT} /> : <Image
            style={styles.image}
            source={this.state.stateImage == null ? {uri: image} : this.state.stateImage }
            onError={err => {
              console.log("err", err, this.props.item);
              this.setState({
                stateImage: ASSET_IMAGES.ICON_DEFAULT
              });
            }}
          />
        } */}
        <Image style={styles.image} source={this.state.stateImage} onError={(error) => {
          this.setState({
            stateImage: ASSET_IMAGES.ICON_DEFAULT
          })
        }} />
        <View style={styles.detail}>
          <Text style={styles.name}>{articlename}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.info}>{info}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  gotoBookDetail() {
    if (this.props.navigation) {
      const { articleid } = this.props.item || {}
      this.props.navigation.navigate("BookDetail", {
        articleid: articleid
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: px(169),
    paddingLeft: px(30),
    paddingRight: px(30),
    flexDirection: 'row',
    width: '100%'
  },
  image: {
    width: px(113),
    height: px(169),
    marginRight: px(42)
  },
  detail: {
    flex: 1
  },
  name: {
    fontSize: px(34),
    color: '#333333',
    marginTop: px(8)
  },
  author: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(8)
  },
  info: {
    fontSize: px(28),
    color: '#999999',
    marginTop: px(8)
  }
})

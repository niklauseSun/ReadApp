import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, StatusBar, FlatList } from "react-native";
import { getSubRanks } from '../requests'
import { RankHeadItem, Header } from '../components';
import { px } from '../utils';

export default class RankList extends Component {

  constructor(props) {
    super(props)

    const { rankType } = props.navigation.state.params || {}
    this.state = {
      rankType: rankType,
      pageIndex: 1,
      pageSize: 10,
      subData: []
    }
  }

  componentDidMount() {
    this.getRankListAction()
  }

  render() {
    console.log("rankType", this.state.rankType)
    const { subData } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
        <Header title={"排行榜"} showBackButton={true} navigation={this.props.navigation}/>
          <FlatList
            data={subData}
            renderItem={({item}) => <RankHeadItem navigation={this.props.navigation} item={item} />}
            ItemSeparatorComponent={() => {
              return <View style={{ height: px(30)}} />
            }}
          />
        </SafeAreaView>
      </View>
    )
  }

  getRankListAction() {
    const data = {
      callback: this.getRankListCallback.bind(this),
      pageSize: 10,
      type: this.state.rankType
    }

    getSubRanks(data)
  }

  getRankListCallback(res) {
    console.log('getRankListCallback', res);
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        subData: data
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  safeView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  content: {
    flex: 1,
    backgroundColor: "#F6F7FB"
  }
});

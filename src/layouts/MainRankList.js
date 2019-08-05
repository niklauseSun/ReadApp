import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, FlatList } from 'react-native'
import { getMainRanks, getSubRanks } from '../requests'
import { Header, RankHeadItem, FooterView } from '../components';
import { px } from '../utils'

export default class MainRankList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageIndex: 1,
      pageSize: 10,
      mainData: []
    }
  }

  componentDidMount() {
    this.getMainRankListAction()
  }
  
  render() {
    const { mainData } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header
            title={"主排行列表"}
            showBackButton={true}
            navigation={this.props.navigation}/>
            <FlatList
              data={mainData}
              renderItem={({ item }) => <RankHeadItem navigation={this.props.navigation} item={item} />}
              ItemSeparatorComponent={() => {
                return <View style={{ height: px(30)}} />
              }}
              onEndReached={
                this.loadMoreMainRankList.bind(this)
              }
              onEndReachedThreshold={0.1}
              ListFooterComponent={<FooterView />}
            />
        </SafeAreaView>
      </View>
    )
  }

  getMainRankListAction() {
    const data = {
      callback: this.mainRankListCallback.bind(this),
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    }

    getMainRanks(data);
  }

  loadMoreMainRankList() {
    const data = {
      callback: this.mainRankListCallback.bind(this),
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    }
    getMainRanks(data);
  }

  mainRankListCallback(res) {
    const { state, data, page } = res;
    if (state == 1) {
      this.setState({
        mainData: [...this.state.mainData, ...data],
        pageIndex: this.state.pageIndex
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB"
  },
  safeView: {
    flex: 1,
    backgroundColor: '#f6f7fb'
  },
  content: {
    flex: 1,
    backgroundColor: '#f6f7fb'
  }
})
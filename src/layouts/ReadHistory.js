import React, { Component } from 'react'
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  DeviceEventEmitter
} from 'react-native'
import {
  ReadHistoryItem,
  Line,
  Header,
  FooterView
} from '../components'

export default class ReadHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      historyList: []
    }
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      "updateBookListEmit",
      this.updateHistoryList.bind(this)
    );
    this.updateHistoryList()
  }

  componentWillUnmount() {
    this.subscription = null
  }

  render() {
    console.log('renddddd', this.state.historyList)
    return (
       <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header title="阅读历史" navigation={this.props.navigation} showBackButton={true} />
          <FlatList
            style={{ backgroundColor: '#fff'}}
            data={this.state.historyList}
            renderItem = {
              ({
                item,
                index
              }) => {
                console.log('render', item)
                if (item.type != 1) {
                  return <ReadHistoryItem navigation = {
                    this.props.navigation
                  }
                  item = {
                    item
                  }
                  index = {
                    index
                  }
                  />
                }
              }
            }
            ItemSeparatorComponent={() => <Line />}
            ListFooterComponent={() => <FooterView/>}
          />
        </SafeAreaView>
      </View>
    )
  }

  updateHistoryList() {
    this.setState({
      historyList: [...global.bookDetailList]
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  safeView: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    flex: 1,
    height: "100%",
    backgroundColor: "#F6F7FB"
  },
})

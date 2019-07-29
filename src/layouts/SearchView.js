import React, { Component, Fragment } from 'react'
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import { SearchInputView, Header } from '../components';
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';
import {
  getSearchList,
  saveSearchList,
  clearSearchList,
  getSearchResult
} from "../requests";

export default class SearchView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      historyList: [],
      searchWord: null,
      showSearchResult: false,
      searchResultList: [],
      pageIndex: 1,
    }
  }

  componentDidMount() {
    this.requestSearchHistory()
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          {/* <Header navigation={this.props.navigation} showBackButton={true}/> */}
          <View style={styles.content}>
            <SearchInputView onCancel={this.onCancel.bind(this)} />
            {this.renderHistory()}
          </View>
        </SafeAreaView>
      </View>
    )
  }

  renderHistory = () => {
    return (
      <Fragment>
        <View style={styles.historyHead}>
          <Text style={styles.historyHeadText}>搜索历史</Text>
          <TouchableOpacity onPress={this.deleteHistory.bind(this)}>
            <Image
              source={ASSET_IMAGES.ICON_DELETE}
              style={styles.deleteImage}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.historyList}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.historyButton}
                onPress={this.addToSearch.bind(this, item)}
              >
                <Text numberOfLines={1} style={styles.historyText}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          numColumns={3}
        />
      </Fragment>
    );
  }

  renderSearchResult = () => {
    return (
      <Fragment>
        <FlatList
          data={this.state.searchResultList}
          renderItem={({ item }) => {
            return <Text>test</Text>
          }}
        />
      </Fragment>
    )
  }

  // action
  onCancel() {
    this.props.navigation.pop()
  }

  addToSearch(item) {
    console.log('addToSearch', item)
  }

  deleteHistory() {
    console.log('deleteHistory')
    clearSearchList();
    this.setState({
      historyList: []
    })
  }

  // requests
  requestSearchHistory() {
    const data = {
      callback: this.searchHistoryCallback.bind(this)
    }

    getSearchList(data);
  }

  searchHistoryCallback(res) {
    const { error, data } = res;
    if (error != null) {
      this.setState({
        historyList: data
      })
    }
  }

  requestSearchList() {
    const data = {
      callback: this.requestSearchHistory.bind(this),
      keyword: this.state.searchWord
    }

    getSearchResult(data)
  }

  loadMoreSearchList() {

  }

  requestSearchListCallback(res) {
    const { data, state } = res;
    if (state == 1) {
      this.setState({
        searchResultList: data
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
    flex: 1
  },
  content: {
    flex: 1
    // backgroundColor: '#fff'
  },
  historyHead: {
    height: px(90),
    flexDirection: "row",
    alignItems: "center"
  },
  historyHeadText: {
    fontSize: px(38),
    color: "#333333",
    lineHeight: px(50),
    marginLeft: px(30),
    flex: 1
  },
  deleteImage: {
    width: px(40),
    height: px(40),
    marginRight: px(30)
  },
  historyButton: {
    paddingHorizontal: px(34),
    backgroundColor: "#ECFBF1",
    borderRadius: px(44),
    height: px(88),
    marginTop: px(30),
    alignItems: "center",
    marginLeft: px(30),
    justifyContent: 'center',
    maxWidth: '33%'
  },
  historyText: {
    fontSize: px(34),
    color: "#71A783"
  }
});

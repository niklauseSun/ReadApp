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
import { SearchInputView, Header, RankHeadItem, FooterView } from '../components';
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
            <SearchInputView
              onSearchAction={this.onSearchAction.bind(this)}
              onCancel={this.onCancel.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              value={this.state.searchWord || ""}
              />
              {this.state.searchWord == null || this.state.searchWord.length == 0 ? this.renderHistory(this.state.historyList): 
              this.renderSearchResult(this.state.searchResultList)}
            {/* {this.renderHistory(this.state.historyList)} */}

            {/* {this.renderSearchResult(this.state.searchResultList)} */}
          </View>
        </SafeAreaView>
      </View>
    )
  }

  renderHistory = (historyList) => {
    return (
      <View style={{ flex: 1}}>
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
          style={{ marginTop: px(30), paddingTop: px(30) }}
          data={historyList}
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
      </View>
    );
  }

  renderSearchResult = (searchResultList) => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{marginTop: px(30) }}
          data={searchResultList}
          renderItem={({ item }) => {
            return <RankHeadItem item={item} navigation={this.props.navigation} />
          }}
          ItemSeparatorComponent={() => {
            return <View style={{ height: px(30) }} />
          }}

          ListEmptyComponent={() => {
            return (
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: px(60)}}><Text style={{ color: '#999'}}>暂无数据</Text></View>
            )
          }}
          onEndReached={this.loadMoreSearchList.bind(this)}
          onEndReachedThreshold = {0.1}
          ListFooterComponent={<FooterView />}
        />
      </View>
    )
  }

  // action
  onCancel() {
    this.props.navigation.pop()
  }

  addToSearch(item) {
    console.log('addToSearch', item)
    this.setState({
      searchWord: item
    }, () => {
      this.onSearchAction()
    })
  }

  onSearchAction() {
    console.log('search 111',this.state.searchWord)
    if (this.state.searchWord == null || this.state.searchWord.length == 0 || this.state.searchWord.trim().length == 0) {
      return;
    }
    console.log('test')
    this.requestSearchList()
  }

  onChangeText(text) {
    console.log('onChangeText', text)
    this.setState({
      searchWord: text
    })
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
    if (error == null) {
      console.log('searchHistory', data)
      this.setState({
        historyList: data || []
      })
    }
  }

  requestSearchList() {
    const data = {
      callback: this.requestSearchListCallback.bind(this),
      keyword: this.state.searchWord,
      pageIndex: this.state.pageIndex,
      pageSize: 10
    }

    getSearchResult(data);
  }

  loadMoreSearchList() {
    const data = {
      callback: this.loadMoreResultCallback.bind(this),
      keyword: this.state.searchWord,
      pageIndex: this.state.pageIndex,
      pageSize: 10
    }

    console.log('loadMore', data)

    getSearchResult(data);
  }

  requestSearchListCallback(res) {
    const { data, state } = res;
    if (state == 1) {
      const { historyList = [] } = this.state;
      console.log('history', historyList)
      if (historyList.indexOf(this.state.searchWord) > -1) {
        let index = historyList.indexOf(this.state.searchWord)
        let tmpArray = this.itemToArrayTop(historyList, index)
        this.setState({
          searchResultList: data,
          historyList: tmpArray,
          pageIndex: this.state.pageIndex + 1
        })
        saveSearchList({
          data: tmpArray
        })
      } else {
        this.setState({
          searchResultList: data,
          pageIndex: this.state.pageIndex + 1,
          historyList: [this.state.searchWord, ...historyList]
        }, ()=> {
            saveSearchList({
              data: this.state.historyList
            })
        })
      }
    }
  }

  loadMoreResultCallback(res) {
    const { data, state } =res;

    if (state == 1) {
      const { historyList = [] } = this.state;
      if (historyList.indexOf(this.state.searchWord) > -1) {
        let index = historyList.indexOf(this.state.searchWord)
        let tmpArray = this.itemToArrayTop(historyList, index)
        this.setState({
          searchResultList: [...this.state.searchResultList, ...data],
          historyList: tmpArray,
          pageIndex: this.state.pageIndex+ 1
        })
        saveSearchList({
          data: tmpArray
        })
      } else {
        this.setState({
          searchResultList: [...this.state.searchResultList, ...data],
          pageIndex: this.state.pageIndex + 1,
          historyList: [this.state.searchWord, ...historyList]
        }, () => {
          saveSearchList({
            data: this.state.historyList
          })
        })
      }
    }
  }

  itemToArrayTop(Arr, index) {
    let tmp = Arr[index];
    if (index == 0) {
      return Arr;
    }
    for (let i = 0; i < Arr.length; i++) {
      if (Arr[i] == Arr[index]) {
        Arr.splice(i, 1);
        break;
      }
    }
    Arr.unshift(tmp);
    return Arr;
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
    alignItems: "center",
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

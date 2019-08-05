/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList
} from "react-native";

import { Header, SearchBar, RankHeadItem, RankItem, AddBookItem } from "../components"
import { px } from "../utils";
import {
  getMainRanks,
  getSubRanks,
  getBookIdList,
  saveBookDetailList,
  saveBookIdList
} from "../requests";

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainRankData: null,
      subRankData: null,
      secondRankData: null,
      thirdRankData: null,
      fourRankData: null,
      fiveRankData: null,
      sixRankData: null,
      bookIdList: []
    };
  }

  componentDidMount() {
    this.getMainRankAction();
    this.getSubRankAction();
    this.getSecondRankAction();
    this.getThirdRankAction();
    this.getFourRankAction();
    this.getFiveRankAction();
    this.getSixRankAction();
  }

  render() {
    const {
      mainRankData,
      subRankData,
      secondRankData,
      thirdRankData,
      fourRankData,
      fiveRankData,
      sixRankData
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
          <Header title={"书库"} />
          <View style={styles.container}>
            <SearchBar
              onSearch={this.onSearch.bind(this)}
              goToHistory={this.goToHistory.bind(this)}
            />
            <ScrollView style={styles.content}>
              <View style={styles.rank}>
                <Text style={styles.booksHeadText}>主排行</Text>

                <RankHeadItem
                  item={mainRankData == null ? {} : mainRankData.length >= 1? mainRankData[0]: {}}
                  navigation={this.props.navigation}
                />
                <View style={styles.rankListView}>
                  <View style={styles.rankItems}>
                    <RankItem
                      item={mainRankData == null ? {} : mainRankData.length >= 2 ? mainRankData[1] : {}}
                      navigation={this.props.navigation}
                    />
                    <RankItem
                      item={mainRankData == null ? {} : mainRankData.length >= 3 ? mainRankData[2] : {}}
                      navigation={this.props.navigation}
                    />
                  </View>
                  <View style={styles.rankItems}>
                    <RankItem
                      item={mainRankData == null ? {} : mainRankData.length >= 4 ? mainRankData[3] : {}}
                      navigation={this.props.navigation}
                    />
                    <RankItem
                      item={mainRankData == null ? {} : mainRankData.length >= 5 ? mainRankData[4] : {}}
                      navigation={this.props.navigation}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.goToMainRankList()
                  }}
                  style={styles.rankListChangeButton}>
                  <Text style={styles.rankListBtnText}>主排行列表</Text>
                </TouchableOpacity>
              </View>

              {/* 仙侠 1 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>仙侠</Text>
                <View style={styles.predictContent}>
                  <FlatList
                  scrollEnabled={false}
                    data={subRankData}
                    renderItem={({item, index}) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 1)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>

              {/* 修真 2 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>修真</Text>
                <View style={styles.predictContent}>
                  <FlatList
                    scrollEnabled={false}
                    data={secondRankData}
                    renderItem={({ item, index }) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 2)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>

              {/* 都市 3 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>都市</Text>
                <View style={styles.predictContent}>
                  <FlatList
                    scrollEnabled={false}
                    data={thirdRankData}
                    renderItem={({ item, index }) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 3)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>

              {/* 穿越 4 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>穿越</Text>
                <View style={styles.predictContent}>
                  <FlatList
                    scrollEnabled={false}
                    data={fourRankData}
                    renderItem={({ item, index }) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 4)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>
              {/* 网游 5 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>网游</Text>
                <View style={styles.predictContent}>
                  <FlatList
                    scrollEnabled={false}
                    data={fiveRankData}
                    renderItem={({ item, index }) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 5)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>

              {/* 科幻 6 */}
              <View style={styles.predict}>
                <Text style={styles.predictText}>科幻</Text>
                <View style={styles.predictContent}>
                  <FlatList
                    scrollEnabled={false}
                    data={sixRankData}
                    renderItem={({ item, index }) => {
                      return <AddBookItem
                        item={item}
                        navigation={this.props.navigation}
                        rate={index}
                      />
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.goToRankList.bind(this, 6)}
                  style={styles.rankListChangeButton}
                >
                  <Text style={styles.rankListBtnText}>查看完整榜</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // private method
  goToRankList(type) {
    this.props.navigation.navigate("RankList", { rankType: type });
  }

  goToMainRankList() {
    this.props.navigation.navigate("MainRankList");
  }

  getMainRankAction = () => {
    const data = {
      callback: this.getMainRankCallback.bind(this)
    };
    getMainRanks(data);
  }

  getSubRankAction = () => {
    const data = {
      callback: this.getSubRankCallback.bind(this),
      type: 1
    };
    getSubRanks(data);
  }

getSecondRankAction = () => {
    const data = {
      callback: this.getSecondRandCallback.bind(this),
      type: 2
    };
    getSubRanks(data);
  }

  getThirdRankAction = () => {
    const data = {
      callback: this.getThirdRandCallback.bind(this),
      type: 3
    };
    getSubRanks(data);
  }

  getFourRankAction = () =>  {
    const data = {
      callback: this.getFourRandCallback.bind(this),
      type: 4
    };
    getSubRanks(data);
  }

  getFiveRankAction = () => {
    const data = {
      callback: this.getFiveRandCallback.bind(this),
      type: 5
    };
    getSubRanks(data);
  }

  getSixRankAction = () =>  {
    const data = {
      callback: this.getSixRandCallback.bind(this),
      type: 6
    };
    getSubRanks(data);
  }
  // callback
  getMainRankCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        mainRankData: data
      });
    }
  }

  getSubRankCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        subRankData: data
      });
    }
  }

  getSecondRandCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        secondRankData: data
      });
    }
  }

  getThirdRandCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        thirdRankData: data
      });
    }
  }
  getFourRandCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        fourRankData: data
      });
    }
  }
  getFiveRandCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        fiveRankData: data
      });
    }
  }

  getSixRandCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        sixRankData: data
      });
    }
  }

  onSearch() {
    this.props.navigation.push("SearchView")
  }

  goToHistory() {
    this.props.navigation.navigate('ReadHistory')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB'
  },
  safeView: {
    flex: 1
  },
  content: {
    flex: 1,
    marginTop: px(42)
  },
  rank: {
    width: '100%',
    height: px(873),
    backgroundColor: 'white',
  },
  predict: {
    marginTop: px(20),
    width: '100%',
    height: px(895),
    backgroundColor: 'white',
    marginBottom: px(20)
  },
  booksHeadText: {
    fontSize: px(38),
    color: '#646C75',
    marginTop: px(42),
    marginLeft: px(30),
    marginBottom: px(28)
  },
  rankItems: {
    flexDirection: 'row',
    marginTop: px(40)
  },
  rankListView: {
    marginTop: px(10),
    flex: 1
  },
  rankListChangeButton: {
    height: px(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankListBtnText: {
    fontSize: px(30),
    color: '#4ABD76'
  },
  predictText: {
    marginLeft: px(30),
    marginTop: px(36),
    marginBottom: px(10),
    fontSize: px(38),
    color: '#646C75'
  },
  predictContent: {
    flex: 1
  }
});

export default Books;

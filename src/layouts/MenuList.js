import React, { Component } from 'react'
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { getMenuList } from "../requests";
import { px } from '../utils'
import { Header } from '../components';

export class MenuList extends Component {
    constructor(props) {
        super(props);
        const { articleid } = props.navigation.state.params || {};
        this.state = {
          pageIndex: 1,
          articleid: articleid,
          totalPage: null,
          menuList: [],
          isRefresh: false
        };
    }

    componentDidMount() {
    this.getMenuListAction();
    }

    render() {
        const { menuList } = this.state;
        console.log("menuList", menuList);
        return (
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeView}>
              <Header title={""} showBackButton={true} navigation={this.props.navigation} />
              <Text style={styles.menuText}>目录</Text>
              <FlatList
                data={menuList}
                renderItem={this.renderItem.bind(this)}
                refreshControl={
                  <RefreshControl
                    title={"Loading"}
                    refreshing={this.state.isRefresh}
                    onRefresh={() => {
                      this._onRefresh();
                    }}
                  />
                }
                onEndReached={this.loadMore.bind(this)}
                onEndReachedThreshold={0.1}
                refreshing={this.state.isRefresh}
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{
                        height: px(60),
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text style={{ color: "#999" }}>没有更多了~</Text>
                    </View>
                  );
                }}
              />
            </SafeAreaView>
          </View>
        );
    }

    // render
    renderItem = ({ item }) => {
      return (
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("BookContent")
        }} style={styles.itemContent}>
          <Text style={styles.chapterName}>{item.chaptername}</Text>
        </TouchableOpacity>
      );
    };

    // method

    // request
    getMenuListAction() {
        const data = {
            pageSize: 10,
            pageIndex: this.state.pageIndex,
            callback: this.getMenuListCallback.bind(this),
            articleid: this.state.articleid
        };
        getMenuList(data);
    }

    _onRefresh() {

        this.setState({
            menuList: []
        })

        const data = {
            pageSize: 10,
            pageIndex: 1,
            callback: this.getMenuListCallback.bind(this),
            articleid: this.state.articleid
        }
        getMenuList(data);

        setTimeout(() => {
            this.setState({
              isRefresh: false
            });
        }, 6000)

    }

    loadMore() {
        const data = {
          pageSize: 10,
          pageIndex: this.state.pageIndex + 1,
          callback: this.getMenuListCallback.bind(this),
          articleid: this.state.articleid
        };
        getMenuList(data);
    }

    getMenuListCallback(res) {
        console.log("getMenuListCallback", res);
        const { state, page, data } = res;
        if (state == 1) {
            const { totalPage, pageIndex } = page;
            this.setState({
              totalPage: totalPage,
              pageIndex: pageIndex,
              menuList: this.state.menuList.concat(data),
              isRefresh: false
            });
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
  },
  menuText: {
    marginLeft: px(120),
    fontSize: px(38),
    color: "#656E79",
    marginTop: px(30),
    marginBottom: px(30)
  },
  itemContent: {
    height: px(100),
    //   alignItems: "center"
    justifyContent: "center",
    paddingLeft: px(120)
  },
  chapterName: {
    color: "#656E79",
    fontSize: px(30)
  }
});

export default MenuList

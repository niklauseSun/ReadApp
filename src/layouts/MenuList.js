import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native'
import { getMenuList } from "../requests";

export class MenuList extends Component {

    constructor(props) {
        super(props);
        const { articleid } = props.navigation.state.params || {}
        this.state = {
          pageIndex: 1,
          articleid: articleid,
          totalPage: null,
          menuList: []
        }
    }

    componentDidMount() {
        this.getMenuListAction()
    }

    render() {
        
        const { menuList } = this.state;
        console.log("menuList", menuList);
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.safeView}>
                <FlatList
                    data={menuList}
                    renderItem={this.renderItem.bind(this)}
                />
                </SafeAreaView>
            </View>
        )
    }

    // render
    renderItem = ({ item }) => {
        return (
          <TouchableOpacity>
            <Text>{item.chaptername}</Text>
          </TouchableOpacity>
        );
    }

    // method

    // request
    getMenuListAction() {
        const data = {
          pageSize: 10,
          pageIndex: this.state.pageIndex,
          callback: this.getMenuListCallback.bind(this),
          articleid: this.state.articleid
        };
        getMenuList(data)
    }

    getMenuListCallback(res) {
        console.log("getMenuListCallback", res);
        const { state, page, data } = res;
        if (state == 1) {
            const { totalPage, pageIndex } = page;
            this.setState({
                totalPage: totalPage,
                pageIndex: pageIndex + 1,
                menuList: this.state.menuList.concat(data)
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

export default MenuList

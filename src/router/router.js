import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import React, { Component } from "react";
import { Image, StyleSheet } from 'react-native'
import { ASSET_IMAGES } from '../config'
import { px } from "../utils";

import My from '../layouts/My'
import Home from '../layouts/Home'
import Books from '../layouts/Books'
import BookDetail from '../layouts/BookDetail'
import MenuList from '../layouts/MenuList'
import BookContent from '../layouts/BookContent'
import RankList from '../layouts/RankList'
import SearchView from '../layouts/SearchView'
import ReadHistory from '../layouts/ReadHistory'
import MainRankList from '../layouts/MainRankList'

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  BookContent: {
    screen: BookContent,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  BookDetail: {
    screen: BookDetail,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  MenuList: {
    screen: MenuList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  SearchView: {
    screen: SearchView,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  ReadHistory: {
    screen: ReadHistory,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
});

const BookStack = createStackNavigator({
  Books: {
    screen: Books,
    navigationOptions: {
      header: null
    }
  },
  BookDetail: {
    screen: BookDetail,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  MenuList: {
    screen: MenuList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  BookContent: {
    screen: BookContent,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  RankList: {
    screen: RankList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  SearchView: {
    screen: SearchView,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  ReadHistory: {
    screen: ReadHistory,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  MainRankList: {
    screen: MainRankList,
    navigationOptions: {
      header: null,
      tabBarVisible: false,
    }
  }
});

const SetStack = createStackNavigator({
  Settings: {
    screen: My,
    navigationOptions: {
      header: null
    }
  },
  BookDetail: {
    screen: BookDetail,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  BookContent: {
    screen: BookContent,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  ReadHistory: {
    screen: ReadHistory,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
})

BookStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
}

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

SetStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};



const TabNavigator = createBottomTabNavigator(
  {
    Books: {
      screen: BookStack,
      navigationOptions: {
        header: null,
        tabBarLabel: "书库",
        tabBarIcon: ({ tintColor, focused }) => {
          if (focused) {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_MY_BOOK_SELECTED}
              />
            );
          } else {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_MY_BOOK_UN_SELECTED}
              />
            );
          }
        }
      }
    },
    Home: {
      screen: HomeStack,
      navigationOptions: {
        header: null,
        tabBarLabel: "我的书架",
        tabBarIcon: ({ tintColor, focused }) => {
          if (focused) {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_BOOK_SELECTED}
              />
            );
          } else {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_BOOK_UN_SELECTED}
              />
            );
          }
        }
      }
    },
    Settings: {
      screen: SetStack,
      navigationOptions: {
        header: null,
        tabBarLabel: "个人中心",
        tabBarIcon: ({ tintColor, focused }) => {
          if (focused) {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_PERSONAL_SELECTED}
              />
            );
          } else {
            return (
              <Image
                style={styles.styles}
                source={ASSET_IMAGES.ICON_PERSONAL_UN_SELECT}
              />
            );
          }
        }
      }
    }
  },
  {
    lazy: true,
    tabBarOptions: {
      activeTintColor: "#4ABD76"
    }
  }
);

const styles = StyleSheet.create({
  iconStyle: {
    height: px(18),
    width: px(18)
  }
})

export default createAppContainer(TabNavigator);
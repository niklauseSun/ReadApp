import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";

import My from '../layouts/My'
import Home from '../layouts/Home'
import Books from '../layouts/Books'
import BookDetail from '../layouts/BookDetail'
import MenuList from '../layouts/MenuList'
import BookContent from '../layouts/BookContent'
import RankList from '../layouts/RankList'

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
  }
});

const SetStack = createStackNavigator({
  Settings: {
    screen: My,
    navigationOptions: {
      header: null
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



const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      header: null
    }
  },
  Books: {
    screen: BookStack,
    navigationOptions: {
      header: null
    }
  },
  Settings: {
    screen: SetStack,
    navigationOptions: {
      header: null
    }
  }
});

// const nav = createStackNavigator({
//   TabNav : TabNavigator,
//   BookDetail: {
//     screen: BookDetail
//   }
// })

export default createAppContainer(TabNavigator);
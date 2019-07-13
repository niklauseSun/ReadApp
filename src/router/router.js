import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import My from '../layouts/My'
import Home from '../layouts/Home'
import Books from '../layouts/Books'

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: '我的书架',
    }
  },
  Books: {
    screen: Books,
    navigationOptions: {
      tabBarLabel: '书库',
    }
  },
  Settings: {
    screen: My,
    navigationOptions: {
      tabBarLabel: '个人中心',
    }
  }
});

export default createAppContainer(TabNavigator);
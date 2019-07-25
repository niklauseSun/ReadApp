import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";

import My from '../layouts/My'
import Home from '../layouts/Home'
import Books from '../layouts/Books'
import BookDetail from '../layouts/BookDetail'

const HomeStack = createStackNavigator({
  Home: {
    screen: Home
  }
})

const BookStack = createStackNavigator({
  Books: {
    screen: Books,
  },
  BookDetail: {
    screen: BookDetail
  }
})

const SetStack = createStackNavigator({
  Settings: {
    screen: My
  }
})



const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Books: BookStack,
  Settings:SetStack
});

// const nav = createStackNavigator({
//   TabNav : TabNavigator,
//   BookDetail: {
//     screen: BookDetail
//   }
// })

export default createAppContainer(TabNavigator);
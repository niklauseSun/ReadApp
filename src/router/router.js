import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import My from '../layouts/My'
import Home from '../layouts/Home'
import Books from '../layouts/Books'

const TabNavigator = createBottomTabNavigator({
  Home: Home,
  Books: Books,
  Settings: My
});

export default createAppContainer(TabNavigator);
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {tab} from './navigationName';
import HomeScreen from '../screens/homeScreen';

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={tab.search} component={HomeScreen} />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTab;

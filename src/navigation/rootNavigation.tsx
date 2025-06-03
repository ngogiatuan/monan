import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { nav } from './navigationName';
import BottomTab from './bottomNavigation';
import AddDishScreen from '../screens/AddDish/AddDishScreen';
import SettingsScreen from '../screens/Setting/SettingsScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';


const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddDish" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AddDish" component={AddDishScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    );
};
export default RootNavigation;
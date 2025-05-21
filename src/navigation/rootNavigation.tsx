import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { nav } from './navigationName';
import BottomTab from './bottomNavigation';

const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={nav.home} component={BottomTab} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
      </NavigationContainer>
    );
  };
export default RootNavigation;
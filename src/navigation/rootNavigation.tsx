import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { nav } from './navigationName';
import BottomTab from './bottomNavigation';
import HelperScreen from '../screens/HelperScreen';


const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name={nav.home} component={BottomTab} />
        <Stack.Screen name="Helper" component={HelperScreen} options={{title: 'Hướng dẫn nấu ăn'}} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
      </NavigationContainer>
    );
  };
export default RootNavigation;
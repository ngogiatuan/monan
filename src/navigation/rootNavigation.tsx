import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AddDishScreen from '../screens/AddDish/AddDishScreen';
import SettingsScreen from '../screens/Setting/SettingsScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import DeleteAccountScreen from '../screens/DeleteAccount/DeleteAccountScreen';
import LanguageScreen from '../screens/Language/LanguagueScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RankingScreen from '../screens/Ranking/RankingScreen';
import { nav } from './navigationName';


const Stack = createNativeStackNavigator();

const RootNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={nav.profile} screenOptions={{ headerShown: false }}>
          <Stack.Screen name={nav.profile} component={ProfileScreen} />
          <Stack.Screen name="AddDish" component={AddDishScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name={nav.deleteAccount} component={DeleteAccountScreen} />
          <Stack.Screen name={nav.language} component={LanguageScreen} />
          <Stack.Screen name={nav.recipe} component={RecipeScreen} />
          <Stack.Screen name={nav.rank} component={RankingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
};
export default RootNavigation;
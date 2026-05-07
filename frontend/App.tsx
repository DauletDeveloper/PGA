import './global.css'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/pages/Home';
import ProfileScreen from './src/pages/Profile';   
import PasswordsScreen from './src/pages/Passwords';
import PinScreen from './src/pages/PinScreen';
const Stack = createNativeStackNavigator();

const App = () => {

  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Pin' 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Pin" component={PinScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Passwords" component={PasswordsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;

import {useColorScheme} from 'react-native';
import { ThemeProvider } from 'styled-components';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './source/Components/HomeScreen';
import StockDataScreen from './source/Components/StockDataScreen';
import ResultsScreen from './source/Components/ResultsScreen';
import HeaderLogo from './source/Components/HeaderLogo';
import styles from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  console.log(colorScheme)
  return (
    <ThemeProvider theme={colorScheme === 'dark' ? styles.darkTheme : styles.lightTheme}>
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
          }}
          >
            <Stack.Screen name="Home" component={HomeScreen} 
              options={{ 
                title: 'Stocks',
                // headerTitle: () => <HeaderLogo /> 
              }}
            />
            <Stack.Screen name="Results" component={ResultsScreen} 
              options={{ 
                title: 'Search Results',
                // headerTitle: () => <HeaderLogo /> 
              }}
            />
            <Stack.Screen name="Details" component={StockDataScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </ThemeProvider>
  );
}
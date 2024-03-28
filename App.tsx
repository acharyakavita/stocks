import { useColorScheme } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './source/Components/HomeScreen'
import StockDataScreen from './source/Components/StockDataScreen'
import ResultsScreen from './source/Components/ResultsScreen'
import HeaderLogo from './source/Components/HeaderLogo'
import styles from './theme'
import FavouritesProvider from './source/Components/FavouritesProvider'
import { AppRegistry } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Stack = createNativeStackNavigator()

export default function App() {
  const colorScheme = useColorScheme()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        theme={colorScheme === 'dark' ? styles.darkTheme : styles.lightTheme}
      >
        <FavouritesProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#3EB489',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: 'Stocks',
                  headerTitleAlign: 'left',
                  // headerTitle: () => <HeaderLogo />
                }}
              />
              <Stack.Screen
                name="Results"
                component={ResultsScreen}
                options={{
                  title: 'Search Results',
                  // headerTitle: () => <HeaderLogo />
                }}
              />
              <Stack.Screen name="Details" component={StockDataScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavouritesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

AppRegistry.registerComponent('appName', () => App)

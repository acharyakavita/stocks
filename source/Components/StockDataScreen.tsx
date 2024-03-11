import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,SafeAreaView } from 'react-native';
import { REACT_APP_API_KEY } from '@env';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function StockDataScreen({navigation,route}) {
  const getMovies = () => {
  const output =  fetch(`https://finnhub.io/api/v1/search?q=apple&token=${REACT_APP_API_KEY}`, 
  //const output = fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${REACT_APP_API_KEY}`,
  {
    method:"GET",
  })
  .then(resp => resp.json())
  .then(function(data) {
    //console.log(data.map(item=>item.displaySymbol),'\n',)
    console.log(data.result.map(item=>item.symbol));
  })
  .catch(error => {
    console.log(error);
  });
  return output
  }
  //getMovies()
  return (
    <View>
      <Text>this screen will have {route.params.name} data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

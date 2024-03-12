import { useState } from 'react';
import { StyleSheet, Text, View,SafeAreaView, Pressable, Button, TextInput } from 'react-native';
import { REACT_APP_API_KEY } from '@env';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {styled} from 'styled-components'

const SearchBar =styled(TextInput)`
  border-radius: 3px;
  border-width: 2px;
`;

const SearchBarContainer = styled(View)`
  flex: 1;
  justify-content: space-between;

`;

const Stack = createNativeStackNavigator();

export default function HomeScreen({navigation}:any) {
  const [searchValue,setSearchValue] = useState('');

  const onChangeTextHandle = (text:string)=>{
    setSearchValue(text);
  } 
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
    <SafeAreaView style={styles.container}>
      <SearchBarContainer>
       <SearchBar
        editable
        maxLength={40}
        onChangeText={text => onChangeTextHandle(text)}
        value={searchValue}
        autoFocus
        blurOnSubmit
        placeholder='Enter the Stock name'
      />
      <Button  
        title="Go to ABC Stocks data"
        onPress={() =>
          navigation.navigate('Details', {name: 'ABC'})
        }
      />
      </SearchBarContainer>
    </SafeAreaView>
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

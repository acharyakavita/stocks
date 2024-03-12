import { useState } from 'react';
import { StyleSheet, Text, View,SafeAreaView, Pressable, Platform,Button, TouchableOpacity,TextInput } from 'react-native';
import { REACT_APP_FIN_MODELING_KEY } from '@env';
import {styled} from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';

const SearchBar =styled(TextInput)`
  flex: 1;
  padding: 0 10px 0 10px;
`;

const SearchBarContainer = styled(View)`
  justify-content: space-between;
  flex-direction: row;
  margin: 20px 10px 20px 10px;
  height :40px;
  border-radius: 3px;
  border-width: 2px;
  padding: 5px 10px 5px 10px;
`;

export default function HomeScreen({navigation}:any) {
  const [searchValue,setSearchValue] = useState('');
  const [stockSearchData,setStockSearchData] = useState([]);

  const onChangeTextHandle = (text:string)=>{
    setSearchValue(text);
  } 

  const clearInputHandle = ()=>{
    setSearchValue('');
  }
  const onSubmitHandle = async() => {
    try{
      const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${searchValue}&apikey=${REACT_APP_FIN_MODELING_KEY}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      await setStockSearchData(data);
      navigation.navigate('Results', { stockSearchData });
    }
   catch (error) {
    console.error(error);
  }
}

  //getMovies()
  return (
    <SafeAreaView style={styles.container}>
      <SearchBarContainer>
      <Icon
            name="search"
            size={24}
            color="#3EB489"
          />
       <SearchBar
        editable
        maxLength={40}
        onChangeText={text => onChangeTextHandle(text)}
        value={searchValue}
        autoFocus
        blurOnSubmit
        placeholder='Search'
        onSubmitEditing={()=>onSubmitHandle()}
      />
      { searchValue.length ? 
      <TouchableOpacity onPress={()=>clearInputHandle()}>
      <AntIcon
            name="closecircle"
            size={24}
            color="grey"
          /> 
           </TouchableOpacity>
          :null}
         
      {/* <Button  
        title="Go to ABC Stocks data"
        onPress={() =>
          navigation.navigate('Details', {name: 'ABC'})
        }
      /> */}
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

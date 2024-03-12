import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,SafeAreaView ,FlatList, ScrollView} from 'react-native';
import { REACT_APP_API_KEY } from '@env';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styled from 'styled-components';

const ResultItemContainer = styled(View)`
  padding: 10px;
  color: #fff;


`;

const ResultsDataItem = ({item})=>{
return(
  <View>
    <Text>{item.symbol}</Text>
    <Text>{item.currency}</Text>
    <Text>{item.exchangeShortName}</Text>
    <Text>{item.name}</Text>
  </View>
)
}
export default function ResultsScreen({route}:any) {
  const {stockSearchData} =   route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
    {/* <FlatList
      data={stockSearchData}
      renderItem={({item}) => <ResultsDataItem item={item}/>}
    /> */}
    {stockSearchData.map((item)=><ResultsDataItem item={item}/>)}
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

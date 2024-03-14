import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Platform,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { REACT_APP_FIN_MODELING_KEY, REACT_APP_EODHD_KEY } from '@env'
import { styled } from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { Reanimated } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper'

const SearchBar = styled(TextInput)`
  flex: 1;
  padding: 0 10px 0 10px;
`

const SearchBarContainer = styled(View)`
  justify-content: space-between;
  flex-direction: row;
  margin: 20px 10px 20px 10px;
  height: 40px;
  border-radius: 3px;
  border-width: 2px;
  padding: 5px 10px 5px 10px;
`

export default function HomeScreen({ navigation }: any) {
  const [searchValue, setSearchValue] = useState('')
  const [stockSearchData, setStockSearchData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandle = async () => {
    setIsLoading(true)
    const url = `https://eodhd.com/api/search/${searchValue}?api_token=${REACT_APP_EODHD_KEY}&fmt=json`
    //fetch(`https://financialmodelingprep.com/api/v3/search?query=${searchValue}&apikey=${REACT_APP_FIN_MODELING_KEY}`)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setStockSearchData(data))
      .catch((e) => {
        console.error(e)
      })
  }
  useEffect(() => {
    if (stockSearchData.length) {
      setIsLoading(false)
      setSearchValue('')
      const resultInputdata = [...stockSearchData]
      setStockSearchData([])
      navigation.navigate('Results', { resultInputdata })
    }
  }),
    [stockSearchData]

  return (
    <SafeAreaView style={styles.container}>
      <SearchBarContainer>
        <Icon name="search" size={24} color="#3EB489" />
        <SearchBar
          onChangeText={(text) => setSearchValue(text)}
          value={searchValue}
          autoFocus
          autoCorrect={false}
          placeholder="Search"
          onSubmitEditing={() => onSubmitHandle()}
        />
        {searchValue.length ? (
          <TouchableOpacity onPress={() => setSearchValue('')}>
            <AntIcon name="closecircle" size={24} color="grey" />
          </TouchableOpacity>
        ) : null}
      </SearchBarContainer>
      {isLoading ? <ActivityIndicator size={'small'} /> : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

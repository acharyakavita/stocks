import { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  I18nManager,
} from 'react-native'
import { REACT_APP_YAHOO, REACT_APP_YAHOO2 } from '@env'
import { styled } from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import FavouritesProvider, { ContextType } from './FavouritesProvider'
import getSymbolFromCurrency from 'currency-symbol-map'
import SwipeableRow from './SwipeableRow'
import { RectButton } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList, StockSearchItem, StockItemObject } from './types'

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false)

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

const MySymbolsHeader = styled(Text)`
  font-size: 15px;
  font-weight: bold;
  color: #3eb489;
`

const Favourites = styled(View)`
  padding: 5px 10px 5px 10px;
`

const FavItemContainer = styled(View)`
  ${() =>
    StyleSheet.create({
      container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 10,
        width: '100%',
        borderBottomColor: 'grey',
        flexDirection: 'row',
      },
    }).container}
`

const StockCode = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`

const Xchg = styled(Text)`
  font-size: 12px;
  opacity: 0.5;
`

const Currency = styled(Text)`
  font-size: 12px;
  opacity: 0.5;
`

const Date = styled(Text)`
  font-size: 12px;
  opacity: 0.5;
`

const LeftContainer = styled(View)`
  width: 70%;
`

const RightContainer = styled(View)`
  width: 30%;
`

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const favoritesContext = useContext(FavouritesProvider.Context) as ContextType
  const { searchValue, setSearchValue, favourites, storage, setFavourites } =
    favoritesContext

  useEffect(() => {
    async function fetchAPI() {
      const key = storage.getString('favourites')
      if (key) {
        const favouriteItems = JSON.parse(key)
        if (favouriteItems.length) {
          setIsLoading(true)

          try {
            const apiCallPromises = favouriteItems.map((item: string) => {
              return fetch(
                `https://yfapi.net/v6/finance/quote?symbols=${item}`,
                {
                  method: 'GET',
                  headers: { 'X-Api-Key': REACT_APP_YAHOO2 },
                }
              )
            })
            const response = await Promise.all(apiCallPromises)
            const prices = await Promise.all(
              response.map((item) => item.json())
            )
            const data = prices.map((item) => {
              if (item.quoteResponse.result[0]) {
                const currencySymbol = getSymbolFromCurrency(
                  item.quoteResponse.result[0].currency
                )
                return { ...item.quoteResponse.result[0], currencySymbol }
              }
            })
            setFavourites(data)
            setIsLoading(false)
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
    fetchAPI()
  }, [])

  const onSubmitHandle = async () => {
    setIsLoading(true)

    try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${searchValue}&
    quotesCount=5&newsCount=0&enableFuzzyQuery=true`
      const response1 = await fetch(url)
      const data = await response1.json()
      if (data && data.quotes && data.quotes.length) {
        const items = data.quotes.map((item: StockSearchItem) => item.symbol)
        const apiCallPromises = items.map((item: string) => {
          return fetch(`https://yfapi.net/v6/finance/quote?symbols=${item}`, {
            method: 'GET',
            headers: { 'X-Api-Key': REACT_APP_YAHOO2 },
          })
        })
        const response = await Promise.all(apiCallPromises)
        const prices = await Promise.all(response.map((item) => item.json()))
        const resultInputData = prices.map(
          (item) => item.quoteResponse.result[0]
        )
        if (resultInputData.length) {
          setIsLoading(false)
          setSearchValue('')
          navigation.navigate('Results', { resultInputData })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        {searchValue && searchValue.length ? (
          <TouchableOpacity onPress={() => setSearchValue('')}>
            <AntIcon name="closecircle" size={24} color="grey" />
          </TouchableOpacity>
        ) : null}
      </SearchBarContainer>
      {isLoading ? <ActivityIndicator size={'small'} /> : null}
      <Favourites>
        <MySymbolsHeader>My Stocks</MySymbolsHeader>
        {favourites.map((item, index) => {
          return (
            <SwipeableRow item={item} key={index}>
              <RectButton
                onPress={() =>
                  navigation.navigate('Details', { stockItem: item })
                }
              >
                <FavItemContainer>
                  <LeftContainer>
                    <StockCode>{item.symbol}</StockCode>
                    <Text>{item.longName}</Text>
                    <Xchg>XCHG : {item.exchange}</Xchg>
                  </LeftContainer>
                  <RightContainer>
                    <Text>
                      {item.currencySymbol}
                      {item.regularMarketPrice}
                    </Text>
                    <Currency>{item.currency}</Currency>
                    {/* <Date>{item.previousCloseDate}</Date> */}
                  </RightContainer>
                </FavItemContainer>
              </RectButton>
            </SwipeableRow>
          )
        })}
      </Favourites>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default HomeScreen

import { useState, useEffect, useContext } from 'react'
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
import {
  REACT_APP_ALPHA,
  REACT_APP_YAHOO,
  REACT_APP_YAHOO2,
  REACT_APP_EODHD_KEY,
  REACT_APP_API_KEY,
} from '@env'
import { styled } from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import FavouritesProvider from './FavouritesProvider'

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

export default function HomeScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false)
  const favoritesContext = useContext(FavouritesProvider.Context)
  const {
    stockSearchData,
    setStockSearchData,
    searchValue,
    setSearchValue,
    favourites,
  } = favoritesContext

  const onSubmitHandle = async () => {
    setIsLoading(true)

    try {
      //const url = `https://eodhd.com/api/search/${searchValue}?api_token=${REACT_APP_EODHD_KEY}&fmt=json`
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${searchValue}&
    quotesCount=5&newsCount=0&enableFuzzyQuery=true`
      //fetch(`https://financialmodelingprep.com/api/v3/search?query=${searchValue}&apikey=${REACT_APP_FIN_MODELING_KEY}`)
      // const url = `https://finnhub.io/api/v1/search?q=${searchValue}&token=${REACT_APP_API_KEY}`
      const response1 = await fetch(url)
      const data = await response1.json()
      if (data && data.quotes && data.quotes.length) {
        const items = data.quotes.map((item) => item.symbol)

        const apiCallPromises = items.map((item, index) => {
          // const url =`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${item}&fields=currency,fromCurrency,toCurrency,
          // exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,
          // regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=${crumb}`
          if (index % 2 === 0) {
            return fetch(`https://yfapi.net/v6/finance/quote?symbols=${item}`, {
              method: 'GET',
              headers: { 'X-Api-Key': REACT_APP_YAHOO2 },
            })
          } else {
            return fetch(`https://yfapi.net/v6/finance/quote?symbols=${item}`, {
              method: 'GET',
              headers: { 'X-Api-Key': REACT_APP_YAHOO2 },
            })
          }
        })

        const response2 = await Promise.all(apiCallPromises)
        const prices = await Promise.all(response2.map((item) => item.json()))
        const newData = prices.map((item) => item.quoteResponse.result[0])
        setStockSearchData(newData)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const tempSubmitHandle = () => {
    const data = [
      {
        Code: 'MSFT',
        Exchange: 'US',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'USA',
        Currency: 'USD',
        ISIN: 'US5949181045',
        previousClose: 415.1,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSFT',
        Exchange: 'BA',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Argentina',
        Currency: 'ARS',
        ISIN: 'US5949181045',
        previousClose: 14593.5,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: '0QYP',
        Exchange: 'IL',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'UK',
        Currency: 'USD',
        ISIN: 'US5949181045',
        previousClose: 415,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: '0QYP',
        Exchange: 'LSE',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'UK',
        Currency: 'USD',
        ISIN: 'US5949181045',
        previousClose: 415,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSF',
        Exchange: 'XETRA',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Germany',
        Currency: 'EUR',
        ISIN: 'US5949181045',
        previousClose: 378.95,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: '3MSF',
        Exchange: 'LSE',
        Name: 'Leverage Shares 3x Microsoft ETP Securities GBP',
        Type: 'ETF',
        Country: 'UK',
        Currency: 'GBX',
        ISIN: 'IE00BK5BZV36',
        previousClose: 5742.25,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSFT',
        Exchange: 'NEO',
        Name: 'Microsoft Corp CDR',
        Type: 'Common Stock',
        Country: 'Canada',
        Currency: 'CAD',
        ISIN: 'CA59516M1041',
        previousClose: 30.68,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: '2MSF',
        Exchange: 'LSE',
        Name: 'Leverage Shares 2x Microsoft ETC A GBP',
        Type: 'ETF',
        Country: 'UK',
        Currency: 'GBX',
        ISIN: 'IE00BF03XY85',
        previousClose: 18670.5,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSFT34',
        Exchange: 'SA',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Brazil',
        Currency: 'BRL',
        ISIN: null,
        previousClose: 86.12,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSF',
        Exchange: 'F',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Germany',
        Currency: 'EUR',
        ISIN: 'US5949181045',
        previousClose: 379.55,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSFT',
        Exchange: 'MX',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Mexico',
        Currency: 'MXN',
        ISIN: null,
        previousClose: 6925.3501,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: '3SMF',
        Exchange: 'LSE',
        Name: 'Leverage Shares 3x Short Microsoft (MSFT) ETP Securities GBP',
        Type: 'ETF',
        Country: 'UK',
        Currency: 'GBX',
        ISIN: 'XS2472334239',
        previousClose: 97.98,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSF',
        Exchange: 'STU',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Germany',
        Currency: 'EUR',
        ISIN: 'US5949181045',
        previousClose: 379.85,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSF',
        Exchange: 'HM',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Germany',
        Currency: 'EUR',
        ISIN: 'US5949181045',
        previousClose: 377.55,
        previousCloseDate: '2024-03-13',
      },
      {
        Code: 'MSF',
        Exchange: 'MU',
        Name: 'Microsoft Corporation',
        Type: 'Common Stock',
        Country: 'Germany',
        Currency: 'EUR',
        ISIN: 'US5949181045',
        previousClose: 379.3,
        previousCloseDate: '2024-03-13',
      },
    ]
    setStockSearchData(data)
  }

  useEffect(() => {
    if (stockSearchData.length) {
      setIsLoading(false)
      setSearchValue('')
      const resultInputData = [...stockSearchData]
      setStockSearchData([])
      navigation.navigate('Results', { resultInputData })
    }
  }, [stockSearchData])

  const stockDetailsHandler = (stockItem: any) => {
    navigation.navigate('Details', { stockItem })
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
          //onSubmitEditing={() => tempSubmitHandle()}
        />
        {searchValue.length ? (
          <TouchableOpacity onPress={() => setSearchValue('')}>
            <AntIcon name="closecircle" size={24} color="grey" />
          </TouchableOpacity>
        ) : null}
      </SearchBarContainer>
      {isLoading ? <ActivityIndicator size={'small'} /> : null}
      <Favourites>
        <MySymbolsHeader>My Symbols</MySymbolsHeader>
        {favourites.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => stockDetailsHandler(item)}
              key={index}
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
            </TouchableOpacity>
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

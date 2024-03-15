import { StatusBar } from 'expo-status-bar'
import { useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { css, styled } from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome6'
import getSymbolFromCurrency from 'currency-symbol-map'
import FavouritesProvider from './FavouritesProvider'
const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`

const ResultItemContainer = styled(View)`
  ${() =>
    StyleSheet.create({
      container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 10,
        marginLeft: 15,
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
  width: 60%;
`

const RightContainer = styled(View)`
  width: 30%;
`

const AddToFavouritesButton = styled(TouchableOpacity)`
  margin: 10px 10px 10px 0;
  width: 10%;
`

const ResultsDataItem = ({ item }) => {
  const currencySymbol = getSymbolFromCurrency(item.Currency)
  const favoritesContext = useContext(FavouritesProvider.Context)
  const { addToFavourites, alreadyExistsInFavourites } = favoritesContext
  const itemWithCurrencySymbol = { ...item, currencySymbol }
  const alreadyExists = alreadyExistsInFavourites(itemWithCurrencySymbol)
  return (
    <ResultItemContainer>
      <AddToFavouritesButton
        onPress={() => addToFavourites(item)}
        disabled={alreadyExists}
      >
        {alreadyExists ? (
          <Icon name="circle-check" size={22} color={'#3EB489'} />
        ) : (
          <Icon name="circle-plus" size={22} color={'#454545'} />
        )}
      </AddToFavouritesButton>
      <LeftContainer>
        <StockCode>{item.Code}</StockCode>
        <Text>{item.Name}</Text>
        <Xchg>XCHG : {item.Exchange}</Xchg>
      </LeftContainer>
      <RightContainer>
        <Text>
          {currencySymbol}
          {item.previousClose.toFixed(2)}
        </Text>
        <Currency>{item.Currency}</Currency>
        <Date>{item.previousCloseDate}</Date>
      </RightContainer>
    </ResultItemContainer>
  )
}

export default function ResultsScreen({ route }: any) {
  const { resultInputData } = route.params
  return (
    <StyledSafeAreaView style={styles.container}>
      <ScrollView>
        {resultInputData.map((item, index) => (
          <ResultsDataItem key={index} item={item} />
        ))}
      </ScrollView>
    </StyledSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

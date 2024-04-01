import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
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
import FavouritesProvider, { ContextType } from './FavouritesProvider'
import { StockItemObject } from './types'

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

const ResultsDataItem = (props: any) => {
  const item: StockItemObject = props.item
  const currencySymbol = getSymbolFromCurrency(item.currency)
  const favoritesContext = useContext(FavouritesProvider.Context)
  const { addToFavourites, alreadyExistsInFavourites } =
    favoritesContext as ContextType
  const itemWithCurrencySymbol: StockItemObject = { ...item, currencySymbol }
  const alreadyExists = alreadyExistsInFavourites(itemWithCurrencySymbol)
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Details', { stockItem: itemWithCurrencySymbol })
      }
    >
      <ResultItemContainer>
        <AddToFavouritesButton
          onPress={() => addToFavourites(itemWithCurrencySymbol)}
          disabled={alreadyExists}
        >
          {alreadyExists ? (
            <Icon name="circle-check" size={22} color={'#3EB489'} />
          ) : (
            <Icon name="circle-plus" size={22} color={'#454545'} />
          )}
        </AddToFavouritesButton>

        <LeftContainer>
          <StockCode>{item.symbol}</StockCode>
          <Text>{item.longName}</Text>
          <Xchg>XCHG : {item.exchange}</Xchg>
        </LeftContainer>
        <RightContainer>
          <Text>
            {currencySymbol}
            {item.regularMarketPrice}
          </Text>
          <Currency>{item.currency}</Currency>
          {/* <Date>{item.previousCloseDate}</Date> */}
        </RightContainer>
      </ResultItemContainer>
    </TouchableOpacity>
  )
}

export default function ResultsScreen({ route }: any) {
  const { resultInputData } = route.params
  return (
    <StyledSafeAreaView style={styles.container}>
      <ScrollView>
        {resultInputData.map((item: StockItemObject, index: number) => (
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

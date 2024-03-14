import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native'
import { REACT_APP_API_KEY } from '@env'
import { css, styled } from 'styled-components/native'

interface ResultItemContainerProps {
  firstChild?: boolean
}

const ResultItemContainer = styled(View)<ResultItemContainerProps>`
  padding: 10px;
  color: white;
  background-color: #fff;
  border-top-color: #f5f5dc;
  border-top-width: 1px;
  height: 150px;
  margin-left: 15px;
  ${(props) =>
    props.firstChild &&
    css`{
      background-color: red;
    }
  `}
`

const ResultsDataItem = ({ item, firstChild }) => {
  return (
    <ResultItemContainer firstChild={firstChild}>
      <Text>{item.Code}</Text>
      <Text>{item.Currency}</Text>
      <Text>{item.previousClose}</Text>
      <Text>{item.Name}</Text>
      <Text>{item.Exchange}</Text>
    </ResultItemContainer>
  )
}
export default function ResultsScreen({ route }: any) {
  const { resultInputdata } = route.params
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {resultInputdata.map((item, index) => (
          <ResultsDataItem
            key={item.symbol}
            item={item}
            firstChild={index === 0}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
  },
})

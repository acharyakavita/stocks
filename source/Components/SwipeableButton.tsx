import React, { Component, useContext } from 'react'
import { StyleSheet, Text, View, I18nManager } from 'react-native'

import { FlatList, RectButton } from 'react-native-gesture-handler'

import AppleStyleSwipeableRow from './AppleStyleSwipeableRow'
import FavouritesProvider from './FavouritesProvider'

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false)

type DataRow = {
  from: string
  message: string
}

const Row = ({ item }: { item: DataRow }) => (
  // eslint-disable-next-line no-alert
  <RectButton style={styles.rectButton} onPress={() => window.alert(item.from)}>
    <Text style={styles.fromText}>{item.from}</Text>
    <Text numberOfLines={2} style={styles.messageText}>
      {item.message}
    </Text>
  </RectButton>
)

const SwipeableButton = () => {
  const favoritesContext = useContext(FavouritesProvider.Context)

  return (
    <FlatList
      data={DATA}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => {
        return (
          <AppleStyleSwipeableRow>
            <Row item={item} />
          </AppleStyleSwipeableRow>
        )
      }}
      keyExtractor={(_item, index) => `message ${index}`}
    />
  )
}

const styles = StyleSheet.create({
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
})

const DATA: DataRow[] = [
  {
    from: "D'Artagnan",
    message:
      'Unus pro omnibus, omnes pro uno. Nunc scelerisque, massa non lacinia porta, quam odio dapibus enim, nec tincidunt dolor leo non neque',
  },
]
export default SwipeableButton

import React, { useContext, PropsWithChildren } from 'react'
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native'

import { RectButton } from 'react-native-gesture-handler'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import FavouritesProvider from './FavouritesProvider'

const SwipeableRow = (props) => {
  const { deleteFromFavourites } = useContext(FavouritesProvider.Context)
  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    })
    const pressHandler = (item) => {
      // close()
      // eslint-disable-next-line no-alert
      deleteFromFavourites(item)
    }

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={() => pressHandler(props.item)}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    )
  }

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {renderRightAction('Delete', '#dd2c00', 128, progress)}
    </View>
  )

  // const swipeableRow?: Swipeable

  // const updateRef = (ref: Swipeable) => {
  //   swipeableRow = ref
  // }
  // const close = () => {
  //   swipeableRow?.close()
  // }
  return (
    <Swipeable
      // ref={updateRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {props.children}
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

export default SwipeableRow

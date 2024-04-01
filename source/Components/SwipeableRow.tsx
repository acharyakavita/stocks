import React, { useContext } from 'react'
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native'

import { RectButton } from 'react-native-gesture-handler'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import FavouritesProvider, { ContextType } from './FavouritesProvider'
import { StockItemObject } from './types'

interface SwipeableRowProps {
  item: StockItemObject
  children: React.ReactNode
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({ item, children }) => {
  const { deleteFromFavourites } = useContext(
    FavouritesProvider.Context
  ) as ContextType
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

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={() => deleteFromFavourites(item)}
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

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
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

import React, { useMemo, useState } from 'react'
import { MMKV, NativeMMKV } from 'react-native-mmkv'
import { StockItemObject } from './types'

export interface ContextType {
  favourites: StockItemObject[]
  setFavourites: React.Dispatch<React.SetStateAction<StockItemObject[]>>
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
  addToFavourites: (item: StockItemObject) => void
  alreadyExistsInFavourites: (item: StockItemObject) => boolean
  storage: NativeMMKV
  deleteFromFavourites: (item: StockItemObject) => void
}

const Context = React.createContext<ContextType | null>(null)
function FavouritesProvider({ children }: any) {
  const storage: NativeMMKV = new MMKV()
  const [favourites, setFavourites] = useState<StockItemObject[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  const alreadyExistsInFavourites = (item: StockItemObject) => {
    return favourites.some(function (el: StockItemObject) {
      return el.symbol === item.symbol
    })
  }
  const addToFavourites = (item: StockItemObject) => {
    const newFav: StockItemObject[] = [...favourites, item]
    setFavourites(newFav)
    const key = storage.getString('favourites')
    let favouritesKey = []
    if (key) {
      favouritesKey = JSON.parse(key)
    }
    if (!favouritesKey.includes(item.symbol)) {
      favouritesKey.push(item.symbol)
    }
    const arrayString = JSON.stringify(favouritesKey)
    storage.set('favourites', arrayString)
  }

  const deleteFromFavourites = (item: StockItemObject) => {
    setFavourites((favourites) =>
      favourites.filter((el) => el.symbol !== item.symbol)
    )
    const key = storage.getString('favourites')
    let favouritesKey = []
    if (key) {
      favouritesKey = JSON.parse(key)
      const index = favouritesKey.indexOf(item.symbol)
      favouritesKey.splice(index, 1)
      const arrayString = JSON.stringify(favouritesKey)
      storage.set('favourites', arrayString)
    }
  }

  const value = useMemo(
    () => ({
      favourites,
      setFavourites,
      searchValue,
      setSearchValue,
      addToFavourites,
      alreadyExistsInFavourites,
      storage,
      deleteFromFavourites,
    }),
    [
      favourites,
      setFavourites,
      searchValue,
      setSearchValue,
      addToFavourites,
      alreadyExistsInFavourites,
      storage,
      deleteFromFavourites,
    ]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

FavouritesProvider.Context = Context

export default FavouritesProvider

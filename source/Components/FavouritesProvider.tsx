import React, { useMemo, useState } from 'react'

const Context = React.createContext({})
import { MMKV } from 'react-native-mmkv'

function FavouritesProvider({ children }) {
  const storage = new MMKV()
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const alreadyExistsInFavourites = (item) => {
    return favourites.some(function (el) {
      return el.symbol === item.symbol
    })
  }
  const addToFavourites = (item) => {
    setFavourites([...favourites, item])
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

  const deleteFromFavourites = (item) => {
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

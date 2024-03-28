import React, { useMemo, useState } from 'react'

const Context = React.createContext({})
import { MMKV } from 'react-native-mmkv'

function FavouritesProvider({ children }) {
  const storage = new MMKV()
  const [favourites, setFavourites] = useState([])
  const [stockSearchData, setStockSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [symbols, setSymbols] = useState([])

  const alreadyExistsInFavourites = (item) => {
    return favourites.some(function (el) {
      return el.symbol === item.symbol && el.exchange === item.exchange
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
      setSymbols(favouritesKey)
    }
    const arrayString = JSON.stringify(favouritesKey)
    storage.set('favourites', arrayString)
  }

  const value = useMemo(
    () => ({
      favourites,
      setFavourites,
      stockSearchData,
      setStockSearchData,
      searchValue,
      setSearchValue,
      addToFavourites,
      alreadyExistsInFavourites,
      storage,
      symbols,
      setSymbols,
    }),
    [
      favourites,
      setFavourites,
      stockSearchData,
      setStockSearchData,
      searchValue,
      setSearchValue,
      addToFavourites,
      alreadyExistsInFavourites,
      storage,
      symbols,
      setSymbols,
    ]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

FavouritesProvider.Context = Context

export default FavouritesProvider

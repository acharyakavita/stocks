import React, { useMemo, useState } from 'react'

const Context = React.createContext({})

function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([])
  const [stockSearchData, setStockSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const alreadyExistsInFavourites = (item) => {
    return favourites.some(function (el) {
      return el.symbol === item.symbol && el.exchange === item.exchange
    })
  }
  const addToFavourites = (item) => {
    setFavourites([...favourites, item])
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
    ]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

FavouritesProvider.Context = Context

export default FavouritesProvider

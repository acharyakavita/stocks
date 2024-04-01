export type StockSearchItem = {
  dispSecIndFlag: boolean
  exchDisp: string
  exchange: string
  index: string
  industry: string
  industryDisp: string
  isYahooFinance: boolean
  longname: string
  quoteType: string
  score: number
  sector: string
  sectorDisp: string
  shortname: string
  symbol: string
  typeDisp: string
}

export type StockItemObject = {
  ask: number
  askSize: number
  averageAnalystRating: string
  averageDailyVolume10Day: number
  averageDailyVolume3Month: number
  bid: number
  bidSize: number
  bookValue: number
  cryptoTradeable: boolean
  currency: string
  customPriceAlertConfidence: string
  displayName: string
  dividendDate: number
  dividendRate: number
  dividendYield: number
  earningsTimestamp: number
  earningsTimestampEnd: number
  earningsTimestampStart: number
  epsCurrentYear: number
  epsForward: number
  epsTrailingTwelveMonths: number
  esgPopulated: boolean
  exchange: 'NMS'
  exchangeDataDelayedBy: number
  exchangeTimezoneName: string
  exchangeTimezoneShortName: string
  fiftyDayAverage: number
  fiftyDayAverageChange: number
  fiftyDayAverageChangePercent: number
  fiftyTwoWeekChangePercent: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekHighChange: number
  fiftyTwoWeekHighChangePercent: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekLowChange: number
  fiftyTwoWeekLowChangePercent: number
  fiftyTwoWeekRange: string
  financialCurrency: string
  firstTradeDateMilliseconds: number
  forwardPE: number
  fullExchangeName: string
  gmtOffSetMilliseconds: number
  hasPrePostMarketData: boolean
  language: string
  longName: string
  market: string
  marketCap: number
  marketState: string
  messageBoardId: string
  priceEpsCurrentYear: number
  priceHint: number
  priceToBook: number
  quoteSourceName: string
  quoteType: string
  region: string
  regularMarketChange: number
  regularMarketChangePercent: number
  regularMarketDayHigh: number
  regularMarketDayLow: number
  regularMarketDayRange: string
  regularMarketOpen: number
  regularMarketPreviousClose: number
  regularMarketPrice: number
  regularMarketTime: number
  regularMarketVolume: number
  sharesOutstanding: number
  shortName: string
  sourceInterval: number
  symbol: string
  tradeable: boolean
  trailingAnnualDividendRate: number
  trailingAnnualDividendYield: number
  trailingPE: number
  triggerable: boolean
  twoHundredDayAverage: number
  twoHundredDayAverageChange: number
  twoHundredDayAverageChangePercent: number
  typeDisp: string
  currencySymbol?: string
}

export type RootStackParamList = {
  Home: undefined
  Results: { resultInputData: StockItemObject[] }
  Details: { stockItem: StockItemObject }
}

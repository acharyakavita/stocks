import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import {
  CartesianChart,
  useChartPressState,
  useAnimatedPath,
  type PointsArray,
  useLinePath,
} from 'victory-native'
import { type SharedValue, useDerivedValue } from 'react-native-reanimated'
import { useState, useEffect } from 'react'
import {
  useFont,
  Circle,
  Line as SkiaLine,
  Path,
  Text as SkiaText,
  vec,
} from '@shopify/react-native-skia'
import inter from '../../assets/inter-medium.ttf'
import { AnimatedText } from './AnimatedText'
import { format } from 'date-fns'
import styled, { css } from 'styled-components'

const Name = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin: 10px;
  color: #3eb489;
`

const Price = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  margin: 10px;
  color: rgba(0, 0, 0, 0.62);
`

const Currency = styled(Text)`
  font-size: 10px;
  font-weight: 300;
`

const MarketChange = styled(Text)`
  color: ${(props) => (props.price < 0 ? '#d93025' : '#188038')};
  font-size: 14px;
  font-weight: 400;
`

const Scroll = styled(ScrollView)`
  max-height: 30px;
  margin: 10px;
  /* &.active {
    color: #3eb489;
  } */
`
const Button = styled(TouchableOpacity)`
  padding-right: 20px;
`

const ButtonText = styled(Text)`
  color: ${(props) => (props.isButtonActive ? 'blue' : 'black')};
  font-weight: ${(props) => (props.isButtonActive ? 600 : 400)};
`

const MarketDataView = styled(View)`
  padding: 10px 10px 10px 10px;
  border-right-width: 1px;
  border-right-color: grey;
`
const ItemView = styled(View)`
  justify-content: space-between;
  flex-direction: row;
  width: 200px;
`

const RANGE = ['1D', '5D', '1MO', '3MO', '6MO', 'YTD', '1Y', '2Y', '5Y', 'MAX']
function ToolTip({
  xPosition,
  yPosition,
  top,
  bottom,
  activeValue,
  textColor,
  lineColor,
  indicatorColor,
  topOffset = 0,
}: {
  xPosition: SharedValue<number>
  yPosition: SharedValue<number>
  activeValue: SharedValue<number>
  bottom: number
  top: number
  textColor: string
  lineColor: string
  indicatorColor: string
  topOffset?: number
}) {
  const FONT_SIZE = 16
  const font = useFont(inter, FONT_SIZE)
  const start = useDerivedValue(() => vec(xPosition.value, bottom))
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset)
  )
  // Text label
  const activeValueDisplay = useDerivedValue(
    () => '$' + activeValue.value.toFixed(2)
  )
  const activeValueWidth = useDerivedValue(
    () => font?.getTextWidth(activeValueDisplay.value) || 0
  )
  const activeValueX = useDerivedValue(
    () => xPosition.value - activeValueWidth.value / 2
  )

  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={indicatorColor} />
      <SkiaText
        color={textColor}
        font={font}
        text={activeValueDisplay}
        x={activeValueX}
        y={top + FONT_SIZE + topOffset}
      />
    </>
  )
}

const StockArea = ({ points }: { points: PointsArray }) => {
  const { path: linePath } = useLinePath(points)
  const animPath = useAnimatedPath(linePath)
  return (
    <Path path={animPath} style="stroke" strokeWidth={2} color={'orange'} />
  )
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatXLabel = (time, activeTimeRange) => {
  switch (activeTimeRange) {
    case '1D':
      return format(time * 1000, 'HH:mm')
    case '5D':
      return format(time * 1000, 'eee')
    case '1MO':
      return new Date(time * 1000).getDate().toLocaleString()
    case '3MO':
    case '6MO':
    case 'YTD':
    case '1Y':
    case '2Y':
      return format(time * 1000, 'MMM')
    case '5Y':
    case 'MAX':
      return format(time * 1000, 'yyyy')
  }
}
export default function StockDataScreen({ route }: any) {
  const { stockItem } = route.params
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } })
  const [activeTimeRange, setActiveTimeRange] = useState(RANGE[0])
  const [chartData, setChartData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const font = useFont(inter, 12)

  const formatDate = (ms: number) => {
    'worklet'
    const date = new Date(ms * 1000)
    const M = MONTHS[date.getMonth()]
    const D = date.getDate()
    const Y = date.getFullYear()
    var hour = date.getHours()
    var min = date.getMinutes()
    if (hour > 0) {
      return `${M} ${D}, ${Y} - ${hour}:${min}`
    } else {
      return `${M} ${D}, ${Y}`
    }
  }
  // Active date display
  const activeDate = useDerivedValue(() => {
    if (!isActive) return ''
    return formatDate(state.x.value.value)
  })

  // Active high display
  const activePrice = useDerivedValue(() => {
    if (!isActive) return '—'
    else return stockItem.currencySymbol + state.y.price.value.value.toFixed(2)
  })

  useEffect(() => {
    setIsLoading(true)
    let interval
    switch (activeTimeRange) {
      case '1D':
        interval = '2m'
        break
      case '5D':
        interval = '15m'
        break
      case '1MO':
        interval = '30m'
        break
      case '3MO':
        interval = '1d'
        break
      case '6MO':
        interval = '1d'
        break
      case 'YTD':
        interval = '1wk'
        break
      case '1Y':
        interval = '1mo'
        break
      case '2Y':
        interval = '1mo'
        break
      case '5Y':
        interval = '1mo'
        break
      case 'MAX':
        interval = '1mo'
        break
    }

    //const url=`https://query1.finance.yahoo.com/v7/finance/chart/${stockItem.Code}.IL?period1=${startofTheDayTimestamp}&period2=${currentTimeStamp}&interval=5m&events=history&includeAdjustedClose=true`
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stockItem.symbol}?interval=${interval}&range=${activeTimeRange.toLocaleLowerCase()}`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.chart && data.chart.result && data.chart.result[0]) {
          const formattedInput = []
          data.chart.result[0].timestamp.forEach((date, index) => {
            if (data.chart.result[0].indicators.quote[0].close[index] && date) {
              const obj = {}
              obj['time'] = date
              obj['price'] = parseFloat(
                data.chart.result[0].indicators.quote[0].close[index].toFixed(2)
              )
              formattedInput.push(obj)
            }
          })

          const chartDump = {
            data: formattedInput,
            labelX: 'time',
            labelY: 'price',
            metaData: data.chart.result[0].meta,
          }
          setChartData({ ...chartDump })
        }
      })
      .then(() => setIsLoading(false))
      .catch((e) => {
        console.error(e)
      })
  }, [activeTimeRange])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2, maxHeight: 500, marginBottom: 20 }}>
        {isLoading ? <ActivityIndicator size={'small'} /> : null}
        {chartData && chartData.data ? (
          <>
            <Name>
              {stockItem.longName}({stockItem.symbol})
            </Name>
            <Price>
              {stockItem.regularMarketPrice}
              <Currency> {stockItem.currency} </Currency>
              <MarketChange price={stockItem.regularMarketChange}>
                ({stockItem.regularMarketChangePercent.toFixed(2)} %)
              </MarketChange>
            </Price>
            <Scroll horizontal={true}>
              {RANGE.map((time, index) => (
                <Button onPress={() => setActiveTimeRange(time)} key={index}>
                  <ButtonText isButtonActive={activeTimeRange === time}>
                    {time}
                  </ButtonText>
                </Button>
              ))}
            </Scroll>
            <CartesianChart
              data={chartData.data}
              chartPressState={[state]}
              xKey={chartData.labelX}
              yKeys={[chartData.labelY]}
              curve="linear"
              axisOptions={{
                font,
                tickCount: 5,
                labelOffset: { x: 12, y: 8 },
                labelPosition: { x: 'outset', y: 'inset' },
                axisSide: { x: 'bottom', y: 'left' },
                formatXLabel: (time) => formatXLabel(time, activeTimeRange),
                formatYLabel: (v) => `${stockItem.currencySymbol}${v}`,
                lineColor: '#3EB489',
                labelColor: 'black',
              }}
              renderOutside={({ chartBounds }) => (
                <>
                  {isActive && (
                    <ToolTip
                      xPosition={state.x.position}
                      yPosition={state.y.price.position}
                      bottom={chartBounds.bottom}
                      top={chartBounds.top}
                      activeValue={state.y.price.value}
                      textColor={'black'}
                      lineColor={'#454546'}
                      indicatorColor={'navy'}
                    />
                  )}
                </>
              )}
            >
              {({ points }) => <StockArea points={points.price} />}
            </CartesianChart>
          </>
        ) : null}
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            paddingBottom: 10,
            paddingTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
            width: '100%',
          }}
        >
          <>
            <AnimatedText
              text={activeDate}
              style={{
                fontSize: 14,
                color: 'black',
              }}
            />
            <AnimatedText
              text={activePrice}
              style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}
            />
          </>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.contentContainer}>
          <MarketDataView>
            <ItemView>
              <Text>Previous Close : </Text>
              <Text>{stockItem.regularMarketPreviousClose}</Text>
            </ItemView>
            <ItemView>
              <Text>Bid : </Text>
              <Text>{stockItem.bid} </Text>
            </ItemView>
            <ItemView>
              <Text>Ask : </Text><Text>{stockItem.ask}</Text>
              
            </ItemView>
            <ItemView>
              <Text>Open : </Text>
              <Text>{stockItem.regularMarketOpen}</Text>
            </ItemView>
          </MarketDataView>
          <MarketDataView>
            <ItemView>
              <Text>High : </Text>
              <Text>{stockItem.regularMarketDayHigh}</Text>
            </ItemView>
            <ItemView>
              <Text>Low : </Text>
              <Text>{stockItem.regularMarketDayLow}</Text>
            </ItemView>
            <ItemView>
              <Text>Volume : </Text>
              <Text>{stockItem.regularMarketVolume}</Text>
            </ItemView>
            <ItemView>
              <Text>Mkt Cap : </Text>
              <Text>
           
      {stockItem.marketCap} 
    </Text>
            </ItemView>
          </MarketDataView>
          <MarketDataView>
            <ItemView>
              <Text>52 Week High : </Text>
              <Text>{stockItem.fiftyTwoWeekHigh}</Text>
            </ItemView>
            <ItemView>
              <Text>52 Week Low : </Text>
              <Text>{stockItem.fiftyTwoWeekLow}</Text>
            </ItemView>
          </MarketDataView>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    margin: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  scrollView: {
    flex: 1,
  },
  optionsScrollView: {
    flex: 1,
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contentContainer: {
    padding: 10,
    paddingLeft: 0,
  },
})

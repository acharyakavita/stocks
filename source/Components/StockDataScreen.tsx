import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
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
import { REACT_APP_FIN_MODELING_KEY, REACT_APP_ALPHA } from '@env'

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
  console.log(points[0])
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

const formatDate = (ms: number) => {
  'worklet'
  const date = new Date(ms)
  const M = MONTHS[date.getMonth()]
  const D = date.getDate()
  const Y = date.getFullYear()
  return `${M} ${D}, ${Y}`
}

export default function StockDataScreen({ route }: any) {
  const { stockItem } = route.params

  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } })
  const [chartData, setChartdata] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    // const currentDate:Date = new global.Date();
    // currentDate.setHours(0, 0, 0, 0);
    // const startofTheDayTimestamp = currentDate.getTime() / 1000;
    // const currentTimeStamp = Math.floor( new global.Date().getTime() / 1000);
    //const url=`https://query1.finance.yahoo.com/v7/finance/chart/${stockItem.Code}.IL?period1=${startofTheDayTimestamp}&period2=${currentTimeStamp}&interval=5m&events=history&includeAdjustedClose=true`
    //const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${item.Code}&interval=5min&outputsize=compact&apikey=${REACT_APP_ALPHA}`;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stockItem.symbol}?interval=2m&range=1d`
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.chart && data.chart.result && data.chart.result[0]) {
          const chartData = {
            data: getData(data),
            //   time: data.chart.result[0].timestamp.map((date) =>
            //   {
            //     const resultDate = new Date(date * 1000)
            //     const hour = resultDate.getHours();
            //     const min = resultDate.getMinutes();
            //     return `${hour}:${min}`;
            //   }),
            //   price: data.chart.result[0].indicators.quote[0].close.map((price) => parseFloat(price).toFixed(2)),
            // ,
            labelX: 'time',
            labelY: 'price',
          }
          // console.log(chartData.data)
          setChartdata(chartData)

          function getData(data) {
            const formattedInput = []
            data.chart.result[0].timestamp.forEach((date, index) => {
              if (
                data.chart.result[0].indicators.quote[0].close[index] &&
                date
              ) {
                const obj = {}
                // const resultDate = new Date(date * 1000)
                // const hour = resultDate.getHours();
                // const min = resultDate.getMinutes();
                obj['time'] = date
                obj['price'] = parseFloat(
                  data.chart.result[0].indicators.quote[0].close[index].toFixed(
                    2
                  )
                )
                formattedInput.push(obj)
              }
            })
            return formattedInput
          }
        }
      })
      .then(() => setIsLoading(false))
      .catch((e) => {
        console.error(e)
      })
  }, [])
  const font = useFont(inter, 12)
  // Active date display
  const activeDate = useDerivedValue(() => formatDate(state.x.value.value))

  // Active high display
  const activeHigh = useDerivedValue(() => {
    if (!isActive) return '—'
    else return '$' + state.y.price.value.value.toFixed(2)
  })
  console.log(state)
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2, maxHeight: 500, marginBottom: 20 }}>
        {isLoading ? <ActivityIndicator size={'small'} /> : null}
        {chartData && chartData.data ? (
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
              formatXLabel: (time) => format(new Date(time * 1000), 'HH:mm'),
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
        ) : null}
      </View>
      {/* <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            paddingBottom: 16,
            paddingTop: 0,
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            width: "100%",
          }}
        >
          <>
            <AnimatedText
              text={activeDate}
              style={{
                fontSize: 16,
                color: 'black',
              }}
            />
            <AnimatedText
              text={activeHigh}
              style={{ fontSize: 24, fontWeight: "bold", color: 'black' }}
            />
          </>
        </View>
      </ScrollView> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    margin: 10,
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
})

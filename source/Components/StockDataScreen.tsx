import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { REACT_APP_API_KEY } from '@env'
import { CartesianChart, Line,useChartPressState } from "victory-native";
import type { SharedValue } from "react-native-reanimated";

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

export default function StockDataScreen() {
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  return (
    <SafeAreaView style={styles.container}>
    <CartesianChart data={DATA} 
    xKey="x"
     yKeys={["highTmp"]}  
    chartPressState={state} 
    axisOptions={{ font }}>
      {({ points }) => (
        <>
        <Line
          points={points.highTmp}
          color="red"
          strokeWidth={3}
          animate={{ type: "timing", duration: 300 }}
        />
        
        {isActive ? (
          <ToolTip x={state.x.position} y={state.y.highTmp.position} />
        ) : null}
          </>
      )}
    </CartesianChart>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

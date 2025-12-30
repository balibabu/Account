import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

export default function LineGraph({ data, filter }) {
  const chartData = useMemo(() => {
    const groupedData = {};
    const now = new Date();

    [...data].reverse().forEach(item => {
      const date = new Date(item.date);
      let match = false;
      if (filter === 'Yearly') match = date.getFullYear() === now.getFullYear();
      else if (filter === 'Monthly') match = date.getMonth() === now.getMonth();
      else {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        match = date >= oneWeekAgo;
      }

      if (match) {
        const label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        if (!groupedData[label]) groupedData[label] = { income: 0, expense: 0 };
        if (item.type === 'Income') groupedData[label].income += item.amount;
        else groupedData[label].expense += item.amount;
      }
    });

    const incomePoints = Object.keys(groupedData).map(key => ({ value: groupedData[key].income, label: key }));
    const expensePoints = Object.keys(groupedData).map(key => ({ value: groupedData[key].expense }));

    return { incomePoints, expensePoints };
  }, [data, filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cash Flow Trend</Text>
      <LineChart
        data={chartData.incomePoints}
        data2={chartData.expensePoints}
        height={180}
        showVerticalLines={false}
        hideRules={true} // Removes the background grid lines
        initialSpacing={10}
        color1="#2E7D32"
        color2="#C62828"
        thickness={3}
        curved
        hideDataPoints
        areaChart
        stepHeight={40}
        startFillColor1="#2E7D32"
        startFillColor2="#C62828"
        startOpacity={0.2}
        endOpacity={0}
        xAxisColor="transparent"
        yAxisColor="transparent"
        yAxisTextStyle={{color: '#999', fontSize: 10}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginVertical: 10, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 }
});
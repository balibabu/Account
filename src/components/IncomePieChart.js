import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export default function IncomePieChart({ income, expense }) {
  const total = income + expense;
  
  const pieData = [
    { value: income, color: '#2E7D32', text: 'Income' },
    { value: expense, color: '#C62828', text: 'Expense' }
  ];

  if (total === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distribution</Text>
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={70}
          innerRadius={50}
          innerCircleColor={'#fff'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>
                  {((income / total) * 100).toFixed(0)}%
                </Text>
                <Text style={{fontSize: 10, color: '#999'}}>In</Text>
              </View>
            );
          }}
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, {backgroundColor: '#2E7D32'}]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, {backgroundColor: '#C62828'}]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginVertical: 10, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  chartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  legend: { marginLeft: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 13, color: '#666' }
});
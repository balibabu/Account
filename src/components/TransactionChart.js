import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

export default function TransactionChart({ data, filter }) {
  
  // --- Data Processing Logic ---
  const chartData = useMemo(() => {
    // 1. Initialize grouping structure
    const groupedData = {};
    const now = new Date();

    // 2. Define label format based on filter
    // Weekly -> Mon, Tue... | Monthly -> 1, 5, 10... | Yearly -> Jan, Feb...
    const getLabel = (date) => {
      if (filter === 'Yearly') {
        return date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        return date.toLocaleDateString('en-US', { day: 'numeric' });
      }
    };

    // 3. Filter & Aggregate Data
    data.forEach(item => {
      const date = new Date(item.date);
      const isIncome = item.type === 'Income';
      const amount = parseFloat(item.amount) || 0;

      // Filter logic (matches Home.js logic)
      let match = false;
      if (filter === 'Yearly') match = date.getFullYear() === now.getFullYear();
      else if (filter === 'Monthly') match = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      else if (filter === 'Weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        match = date >= oneWeekAgo && date <= now;
      }

      if (match) {
        const label = getLabel(date);
        if (!groupedData[label]) groupedData[label] = { income: 0, expense: 0 };
        
        if (isIncome) groupedData[label].income += amount;
        else groupedData[label].expense += amount;
      }
    });

    // 4. Format for Gifted Charts
    // We create an interleaved array: [IncomeBar, ExpenseBar, Space, IncomeBar...]
    const formattedData = [];
    
    Object.keys(groupedData).forEach(key => {
      const { income, expense } = groupedData[key];
      
      // Income Bar
      formattedData.push({
        value: income,
        label: key,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: 'gray', fontSize: 10 },
        frontColor: '#2E7D32',
        gradientColor: '#4CAF50',
        showGradient: true,
      });

      // Expense Bar
      formattedData.push({
        value: expense,
        frontColor: '#C62828',
        gradientColor: '#EF5350',
        showGradient: true,
      });
    });

    return formattedData;
  }, [data, filter]);

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to chart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.chartWrapper}>
        <BarChart
          data={chartData}
          barWidth={12}
          spacing={24}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: 'gray' }}
          noOfSections={4}
          maxValue={Math.max(...chartData.map(i => i.value)) * 1.2} // Auto-scale Y-axis
          isAnimated
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 15,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartWrapper: {
    marginLeft: -10, // Adjust layout for labels
    overflow: 'hidden'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginVertical: 15,
  },
  emptyText: {
    color: '#aaa',
  },
});
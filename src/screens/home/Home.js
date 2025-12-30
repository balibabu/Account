import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../contexts/DataContext'; 
import TransactionChart from '../../components/TransactionChart';
import LineGraph from '../../components/LineGraph';
import IncomePieChart from '../../components/IncomePieChart';
import { fonts } from '../../constants';


export default function Home() {
  const navigation = useNavigation();
  const { data } = useData(); // Accessing data from your context
  const [filter, setFilter] = useState('Monthly'); // Default filter

  // --- Logic: Filter and Calculate Totals ---
  const dashboardData = useMemo(() => {
    const now = new Date();
    
    // 1. Filter data based on time range
    const filteredDocs = data.filter(item => {
      const itemDate = new Date(item.date);
      
      if (filter === 'Yearly') {
        return itemDate.getFullYear() === now.getFullYear();
      } else if (filter === 'Monthly') {
        return (
          itemDate.getMonth() === now.getMonth() && 
          itemDate.getFullYear() === now.getFullYear()
        );
      } else if (filter === 'Weekly') {
        // Simple logic: Check if date is within the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo && itemDate <= now;
      }
      return true;
    });

    // 2. Calculate Totals
    let totalIncome = 0;
    let totalExpense = 0;

    filteredDocs.forEach(item => {
      // Ensure amount is treated as a number
      const amount = parseFloat(item.amount) || 0; 
      if (item.type === 'Income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      // Sort by date descending (newest first)
      recent: filteredDocs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    };
  }, [data, filter]);

  // --- Formatting Helpers ---
  const formatMoney = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* --- Header Section --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>khatabook</Text>
        
        {/* Filter Toggler */}
        <View style={styles.filterContainer}>
          {['Weekly', 'Monthly', 'Yearly'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.filterBtn, filter === type && styles.filterBtnActive]}
              onPress={() => setFilter(type)}
            >
              <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Main Balance Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Net Balance ({filter})</Text>
          <Text style={styles.balanceText}>{formatMoney(dashboardData.balance)}</Text>
        </View>

        {/* --- Income / Expense Row --- */}
        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard]}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.iconText}>↘</Text> 
            </View>
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={[styles.statAmount, { color: '#2E7D32' }]}>
              {formatMoney(dashboardData.income)}
            </Text>
          </View>

          <View style={[styles.card, styles.halfCard]}>
             <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Text style={styles.iconText}>↗</Text>
            </View>
            <Text style={styles.cardLabel}>Expense</Text>
            <Text style={[styles.statAmount, { color: '#C62828' }]}>
              {formatMoney(dashboardData.expense)}
            </Text>
          </View>
        </View>

        <IncomePieChart income={dashboardData.income} expense={dashboardData.expense} />
        <LineGraph data={data} filter={filter} />
        <TransactionChart data={data} filter={filter} />


        {/* --- Recent Transactions --- */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        <View style={styles.recentList}>
          {dashboardData.recent.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found for this period.</Text>
          ) : (
            dashboardData.recent.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                {/* Icon */}
                <View style={[
                  styles.transIcon, 
                  item.type === 'Income' ? styles.bgGreen : styles.bgRed
                ]}>
                  <Text style={styles.transIconText}>
                    {item.type === 'Income' ? '↘' : '↗'}
                  </Text>
                </View>

                {/* Details */}
                <View style={styles.transDetails}>
                  <Text style={styles.transDesc}>{item.description}</Text>
                  <Text style={styles.transDate}>{formatDate(item.date)}</Text>
                </View>

                {/* Amount */}
                <Text style={[
                  styles.transAmount,
                  item.type === 'Income' ? { color: '#2E7D32' } : { color: '#C62828' }
                ]}>
                  {item.type === 'Income' ? '+' : '-'}{formatMoney(item.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* --- FAB --- */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('Form', { id: 0 })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    // fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing:.5,
    fontFamily: fonts.bold
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#E0E0E0',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#4A90E2',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
    padding: 15,
  },
  cardLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  recentList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  bgGreen: { backgroundColor: '#E8F5E9' },
  bgRed: { backgroundColor: '#FFEBEE' },
  transIconText: { fontSize: 18, fontWeight: 'bold' },
  transDetails: { flex: 1 },
  transDesc: { fontSize: 16, fontWeight: '500', color: '#333' },
  transDate: { fontSize: 12, color: '#888', marginTop: 2 },
  transAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#4A90E2',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    marginTop: -4,
  },
});
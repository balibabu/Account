import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  // SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
// Mock Data
const INITIAL_DATA = [
  { id: 1, amount: 4500, type: 'Income', description: 'Sold my old gaming console', date: '2023-10-01' },
  { id: 2, amount: 120.50, type: 'Expense', description: 'Grocery shopping', date: '2025-10-03' },
  { id: 3, amount: 55.00, type: 'Expense', description: 'Uber to airport', date: '2023-10-05' },
  { id: 4, amount: 1200, type: 'Income', description: 'Web design project', date: '2024-10-06' },
  { id: 5, amount: 15.00, type: 'Expense', description: 'Coffee', date: '2023-10-07' },
];

export default function DetailsScreen({ navigation }) {
  const [transactions, setTransactions] = useState(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState(INITIAL_DATA);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Date Filter State
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, fromDate, toDate, transactions]);

  const applyFilters = () => {
    let result = transactions;

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.description.toLowerCase().includes(lowerQuery) ||
        item.amount.toString().includes(lowerQuery)
      );
    }

    // Date Range
    if (fromDate) {
      result = result.filter(item => new Date(item.date) >= fromDate);
    }
    if (toDate) {
      result = result.filter(item => new Date(item.date) <= toDate);
    }

    setFilteredData(result);
  };

  // --- Handlers ---
  const handleDateChange = (event, selectedDate, type) => {
    // Hide pickers immediately
    if (type === 'from') setShowFromPicker(Platform.OS === 'ios');
    if (type === 'to') setShowToPicker(Platform.OS === 'ios');

    if (event.type === 'set' && selectedDate) {
      if (type === 'from') setFromDate(selectedDate);
      if (type === 'to') setToDate(selectedDate);
    } else if (event.type === 'dismissed') {
       if (type === 'from') setShowFromPicker(false);
       if (type === 'to') setShowToPicker(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setTransactions(transactions.filter(t => t.id !== id)) }
    ]);
  };

  const formatDateDisplay = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // --- Render Item (Compact Version) ---
  const renderItem = ({ item }) => {
    const isIncome = item.type === 'Income';
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Form', { id: item.id })}
      >
        <View style={[styles.cardStrip, { backgroundColor: isIncome ? '#10B981' : '#EF4444' }]} />
        
        <View style={styles.cardContent}>
          {/* Top Row: Description & Amount */}
          <View style={styles.cardRow}>
            <Text style={styles.description} numberOfLines={1}>
              {item.description}
            </Text>
            <Text style={[styles.amount, { color: isIncome ? '#10B981' : '#EF4444' }]}>
              {isIncome ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
            </Text>
          </View>
          
          {/* Bottom Row: Date */}
          <View style={styles.cardRow}>
             <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Form', { id: 0 })}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={[styles.filterIcon, showFilters && { color: '#fff' }]}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Date Filters (With Pickers) */}
      {showFilters && (
        <View style={styles.filterContainer}>
          {/* FROM DATE */}
          <View style={styles.filterInputGroup}>
            <Text style={styles.filterLabel}>From</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowFromPicker(true)}>
              <Text style={styles.datePickerText}>
                {fromDate ? formatDateDisplay(fromDate) : 'Start Date'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* TO DATE */}
          <View style={styles.filterInputGroup}>
            <Text style={styles.filterLabel}>To</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowToPicker(true)}>
              <Text style={styles.datePickerText}>
                {toDate ? formatDateDisplay(toDate) : 'End Date'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hidden Pickers (Conditional Rendering) */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => handleDateChange(e, d, 'from')}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => handleDateChange(e, d, 'to')}
        />
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}><Text style={styles.emptyText}>No transactions found.</Text></View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12, // Compact
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  // --- Search ---
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40, // Compact height
    alignItems: 'center',
    marginRight: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 6, opacity: 0.5 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 0 }, // Removes default android padding
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: { backgroundColor: '#4F46E5' },
  filterIcon: { fontSize: 16 },

  // --- Filters ---
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  filterInputGroup: { flex: 1, marginHorizontal: 5 },
  filterLabel: { fontSize: 11, fontWeight: '700', color: '#4F46E5', marginBottom: 4, textTransform: 'uppercase' },
  datePickerButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  datePickerText: { fontSize: 13, color: '#374151' },
  calendarIcon: { fontSize: 12, opacity: 0.7 },

  // --- List & Card ---
  listContent: { padding: 16 },
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12, // Slightly smaller radius
    marginBottom: 10, // Reduced Gap (was 16)
    height: 60, // Fixed compact height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardStrip: {
    width: 5,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12, // Compact padding
    paddingVertical: 8,
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  description: {
    fontSize: 15, // Slightly smaller
    fontWeight: '600',
    color: '#1F2937',
    maxWidth: '75%', // Ensure text doesn't overlap amount
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  date: {
    fontSize: 11, // Smaller date
    color: '#9CA3AF',
  },
  
  deleteButton: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F3F4F6',
    backgroundColor: '#FAFAFA' // Slight contrast
  },
  deleteIcon: { fontSize: 16, opacity: 0.5 },
  
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useData } from '../../contexts/DataContext';
import { fonts } from '../../constants';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import FloatingButton from '../../components/FloatingButton';
import TransactionItem from '../home/TransactionItem';
import { useTransactionFilters } from '../../hooks/useTransactionFilters';
import SwipeToDelete from '../../components/SwipeToDelete';

export default function DetailsScreen({ navigation }) {
    const { data, remove } = useData();
    const { searchQuery, setSearchQuery, fromDate, setFromDate, toDate, setToDate, showFilters, setShowFilters, filteredData, resetFilters } = useTransactionFilters(data);
    const [picker, setPicker] = useState({ show: false, mode: 'from' });

    const handleDelete = (id) => {
        Alert.alert('Delete', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transactions</Text>
                <TouchableOpacity
                    style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
                    onPress={() => { if (showFilters) resetFilters(); setShowFilters(!showFilters); }}
                >
                    <Icon name={showFilters ? "close" : "options-outline"} size={22} color={showFilters ? "#fff" : "#4F46E5"} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Icon name="search-outline" size={18} color="#94A3B8" />
                    <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#9CA3AF" />
                </View>
            </View>

            {showFilters && (
                <View style={styles.filterContainer}>
                    <DateFilter label="From" date={fromDate} onPress={() => setPicker({ show: true, mode: 'from' })} />
                    <DateFilter label="To" date={toDate} onPress={() => setPicker({ show: true, mode: 'to' })} />
                </View>
            )}

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <SwipeToDelete onDelete={() => handleDelete(item.id)} onEdit={() => navigation.navigate('Form', { id: item.id })}>
                        <TransactionItem item={item} />
                    </SwipeToDelete>
                )}
                ListEmptyComponent={<EmptyState />}
            />

            <FloatingButton onPress={() => navigation.navigate('Form')} />

            {picker.show && (
                <DateTimePicker
                    value={(picker.mode === 'from' ? fromDate : toDate) || new Date()}
                    onChange={(_, d) => {
                        setPicker({ ...picker, show: false });
                        if (d) picker.mode === 'from' ? setFromDate(d) : setToDate(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
}
//                 renderItem={({ item }) => <TransactionItem item={item} onEdit={() => navigation.navigate('Form', { id: item.id })} onDelete={() => handleDelete(item.id)} />}

const DateFilter = ({ label, date, onPress }) => (
    <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>{label}</Text>
        <TouchableOpacity style={styles.dateInput} onPress={onPress}>
            <Text style={styles.dateText}>{date ? date.toLocaleDateString() : 'Select'}</Text>
            <Icon name="calendar-outline" size={14} color="#4F46E5" />
        </TouchableOpacity>
    </View>
);

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon name="receipt-outline" size={60} color="#E2E8F0" />
        <Text style={styles.emptyText}>No results found.</Text>
    </View>
);

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 28, fontFamily: fonts.bold, color: '#1E293B' },
    filterToggle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    filterToggleActive: { backgroundColor: '#4F46E5' },
    searchSection: { paddingHorizontal: 20, marginBottom: 10 },
    searchBar: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 15, paddingHorizontal: 15, backgroundColor: '#F8FAFC', borderTopWidth: 2.5, borderLeftWidth: 1.5, borderBottomWidth: 0.5, borderRightWidth: 0.5, borderTopColor: '#B6C7C7', borderLeftColor: '#B6C7C7', borderBottomColor: '#B6C7C7', borderRightColor: '#B6C7C7' },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#134E4A', paddingVertical: 0 },
    filterContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    filterGroup: { flex: 1, marginHorizontal: 5 },
    filterLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', marginBottom: 5, textTransform: 'uppercase' },
    dateInput: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 13, color: '#1E293B' },
    listContent: { padding: 20, paddingBottom: 100,  gap:10},
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#94A3B8', fontSize: 14, marginTop: 10 }
});
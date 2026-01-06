import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../constants';

const StatCard = ({ label, amount, type }) => {
    const isIncome = type === 'income';
    return (
        <View style={[styles.statCard, isIncome ? styles.incomeBorder : styles.expenseBorder]}>
            <View style={[styles.statIconCircle, { backgroundColor: isIncome ? '#F0FDFA' : '#FFF1F2' }]}>
                <Icon name={isIncome ? "arrow-up" : "arrow-down"} size={20} color={isIncome ? "#0D9488" : "#E11D48"} />
            </View>
            <View>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={[styles.statAmount, { color: isIncome ? '#0D9488' : '#E11D48' }]}>Rs {amount}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 4, marginHorizontal: 0 },
    incomeBorder: { borderLeftWidth: 4, borderLeftColor: '#0D9488' },
    expenseBorder: { borderLeftWidth: 4, borderLeftColor: '#E11D48' },
    statIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    statLabel: { fontSize: 12, color: '#94A3B8', fontFamily: fonts.regular },
    statAmount: { fontSize: 15, fontFamily: fonts.bold },
});

export default StatCard;
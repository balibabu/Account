import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { categories } from '../../constants';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';


export default function Form({ route, navigation }) {
    const { data, save } = useData();
    const { id } = route.params || {};
    const isEditing = !!id;

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(0);

    const [showDatePicker, setShowDatePicker] = useState(false);


    useEffect(() => {
        // console.log(data);
        if (!isEditing) return;
        const item = data.find(i => i.id === id);
        setAmount(String(item.amount));
        setDate(new Date(item.date));
        setCategory(item.category);
        setDescription(item.description);
    }, [id, isEditing, data]);

    const handleDateChange = (_, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
        setShowDatePicker(false);
    };
    const handleSave = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) return Alert.alert("Error", "Please enter a valid amount");
        if (!description.trim()) return Alert.alert("Error", "Please enter a description");
        save({ id, amount: Number(amount), date: date.toISOString(), category, description });
        navigation.goBack();
    };
    const formatDate = d => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <SafeAreaView style={styles.safeArea}>
            <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{isEditing ? 'Edit Transaction' : 'New Transaction'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>Rs</Text>
                        <TextInput keyboardType="numeric" style={styles.amountInput} value={amount} onChangeText={setAmount} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Category</Text>
                        <TouchableOpacity style={styles.selector} onPress={() => setCategory(prev => (prev + 1) % categories.length)}>
                            <Text style={category == 0 ? styles.textSuccess : styles.textDanger}>
                                {categories[category % categories.length]}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.selector} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.selectorText}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What is this transaction for?"
                        placeholderTextColor="#A0A0A0"
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                    <Text style={styles.submitButtonText}>{isEditing ? 'Update Entry' : 'Save Entry'}</Text>
                </TouchableOpacity>
            </View>
            {showDatePicker && <DateTimePicker maximumDate={new Date()} value={date} onChange={handleDateChange} />}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FA' },

    // Header
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },

    // Form
    formContainer: {
        padding: 24,
        flexGrow: 1,
    },
    inputGroup: { marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Specific Inputs
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    currencySymbol: { fontSize: 20, color: '#9CA3AF', marginRight: 8, fontWeight: '600' },
    amountInput: { fontSize: 24, fontWeight: '700', color: '#111827', flex: 1 },

    selector: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorText: { fontSize: 16, color: '#111827', fontWeight: '500' },
    dropdownIcon: { fontSize: 12, color: '#6B7280' },

    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        flex: 1, // Takes up remaining space
        minHeight: 120, // Minimum height for textarea look
    },

    // Type Colors
    textSuccess: { color: '#10B981', fontSize: 16, fontWeight: 'bold' },
    textDanger: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

    // Footer Actions
    footer: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cancelButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#374151' },

    submitButton: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: '#4F46E5', // Indigo Primary
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
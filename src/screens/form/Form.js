import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Standard library

export default function Form({ route, navigation }) {
  const { id } = route.params || { id: 0 };
  const isEditing = id > 0;

  // --- State ---
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('Expense'); // Default
  const [description, setDescription] = useState('');
  
  // UI State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (isEditing) {
      // Simulate fetching data for ID
      // Replace this with your actual DB call
      setAmount('150.00');
      setType('Income');
      setDescription('Freelance project payment for design work.');
      setDate(new Date()); 
    }
  }, [id, isEditing]);

  // --- Handlers ---
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    setDate(currentDate);
  };

  const handleSave = () => {
    const payload = { id, amount: parseFloat(amount), date, type, description };
    console.log(isEditing ? 'Updating:' : 'Creating:', payload);
    navigation.goBack();
  };

  // --- Render Helpers ---
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing ? `Updating ID: #${id}` : 'Enter details below'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          
          {/* Amount Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          {/* Type Dropdown (Custom UI) */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setShowTypePicker(true)}
              >
                <Text style={[
                  styles.selectorText, 
                  type === 'Income' ? styles.textSuccess : styles.textDanger
                ]}>{type}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.selectorText}>{formatDate(date)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description Field */}
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What is this transaction for?"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#A0A0A0"
            />
          </View>

        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Modals & Pickers --- */}

        {/* 1. Date Picker Modal (Conditional Render) */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()} // Prevent future dates?
          />
        )}

        {/* 2. Custom Type Picker Modal */}
        <Modal
          visible={showTypePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTypePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowTypePicker(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Transaction Type</Text>
              {['Income', 'Expense'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setType(option);
                    setShowTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    option === type && styles.modalOptionSelected,
                    option === 'Income' ? { color: '#10B981' } : { color: '#EF4444' }
                  ]}>
                    {option}
                  </Text>
                  {option === type && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  
  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },

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
  textSuccess: { color: '#10B981' },
  textDanger: { color: '#EF4444' },

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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#111827' },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: { fontSize: 16, fontWeight: '500' },
  modalOptionSelected: { fontWeight: '700' },
  checkMark: { fontSize: 16, color: '#4F46E5', fontWeight: 'bold' },
});
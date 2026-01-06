import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppLock } from '../../contexts/AppLockContext';
import { fonts } from '../../constants';

export default function AppLockSetup() {
    const [isVisible, setIsVisible] = useState(false);
    const [pin, setPin] = useState('');
    const { enableAppLock, isLockEnabled, disableAppLock } = useAppLock();

    const handleSave = () => {
        if (pin.length < 6) return Alert.alert('Security', 'Please enter a 6-digit PIN');
        enableAppLock(pin);
        setIsVisible(false);
        setPin('');
    };

    const handleToggle = () => {
        if (isLockEnabled) {
            Alert.alert('Disable Lock', 'Remove the PIN lock?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Disable', onPress: () => disableAppLock(), style: 'destructive' }
            ]);
        } else {
            setIsVisible(true);
        }
    };

    return (
        <>
            <TouchableOpacity style={[styles.menuItem, isLockEnabled && styles.menuItemEnabled]} onPress={handleToggle} activeOpacity={0.7}>
                <View style={[styles.iconContainer, isLockEnabled ? styles.bgActive : styles.bgInactive]}>
                    <Icon name={isLockEnabled ? "shield-checkmark" : "shield-outline"} size={22} color={isLockEnabled ? "#10b981" : "#6366f1"} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.menuText}>{isLockEnabled ? 'App Lock Enabled' : 'Enable App Lock'}</Text>
                    <Text style={styles.subText}>{isLockEnabled ? 'Tap to disable security' : 'Add an extra layer of security'}</Text>
                </View>
                <Icon name={isLockEnabled ? "radio-button-on" : "chevron-forward"} size={20} color={isLockEnabled ? "#10b981" : "#cbd5e1"} />
            </TouchableOpacity>

            <Modal animationType="fade" transparent visible={isVisible} onRequestClose={() => setIsVisible(false)}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior="height" style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.lockCircle}><Icon name="lock-closed" size={30} color="#6366f1" /></View>
                            <Text style={styles.modalTitle}>Set Security PIN</Text>
                            <Text style={styles.modalSubTitle}>Enter 6 digits to lock your app</Text>
                        </View>
                        <TextInput style={styles.pinInput} value={pin} onChangeText={setPin} keyboardType="numeric" maxLength={6} secureTextEntry placeholder="0 0 0 0 0 0" placeholderTextColor="#cbd5e1" autoFocus />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsVisible(false); setPin(''); }}><Text style={styles.btnTextCancel}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.saveBtn, pin.length < 6 && styles.disabledBtn]} onPress={handleSave} disabled={pin.length < 6}><Text style={styles.btnTextSave}>Activate Lock</Text></TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 3, borderWidth: 1, borderColor: 'transparent' },
    menuItemEnabled: { borderColor: '#d1fae5' },
    iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    bgInactive: { backgroundColor: '#eef2ff' },
    bgActive: { backgroundColor: '#ecfdf5' },
    textContainer: { flex: 1 },
    menuText: { fontSize: 16, fontFamily: fonts.bold, color: '#1e293b' },
    subText: { fontSize: 12, fontFamily: fonts.regular, color: '#64748b' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 10 },
    lockCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    modalHeader: { alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 22, fontFamily: fonts.bold, color: '#1e293b' },
    modalSubTitle: { fontSize: 14, fontFamily: fonts.regular, color: '#64748b', marginTop: 5 },
    pinInput: { width: '100%', letterSpacing: 15, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 12, padding: 15, fontSize: 24, fontFamily: fonts.bold, color: '#1e293b', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 30 },
    modalButtons: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cancelBtn: { padding: 10 },
    saveBtn: { backgroundColor: '#6366f1', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 12, minWidth: 140, alignItems: 'center' },
    disabledBtn: { backgroundColor: '#cbd5e1' },
    btnTextCancel: { color: '#64748b', fontFamily: fonts.bold },
    btnTextSave: { color: '#fff', fontFamily: fonts.bold }
});
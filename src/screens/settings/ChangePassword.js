import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { fonts } from '../../constants';

export default function ChangePassword() {
    const { changePassword } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });

    const handleUpdate = async () => {
        const { current, next, confirm } = form;
        if (!current || !next || !confirm) return Alert.alert('Error', 'Fill all fields');
        if (next !== confirm) return Alert.alert('Error', 'Passwords do not match');
        if (next.length < 6) return Alert.alert('Error', 'Too short (min 6 chars)');

        setLoading(true);
        try {
            await changePassword(current, next);
            Alert.alert('Success', 'Password updated!');
            setIsVisible(false);
            setForm({ current: '', next: '', confirm: '' });
        } catch (e) {
            Alert.alert('Error', e.code === 'auth/wrong-password' ? 'Wrong current password' : e.message);
        } finally { setLoading(false); }
    };

    return (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={() => setIsVisible(true)} activeOpacity={0.7}>
                <View style={styles.iconContainer}><Icon name="key-outline" size={22} color="#2563eb" /></View>
                <Text style={styles.menuText}>Change Password</Text>
                <Icon name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>

            <Modal animationType="fade" transparent visible={isVisible} onRequestClose={() => setIsVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput style={styles.input} secureTextEntry value={form.current} onChangeText={t => setForm({...form, current: t})} placeholder="••••••••" />

                        <Text style={styles.label}>New Password</Text>
                        <TextInput style={styles.input} secureTextEntry value={form.next} onChangeText={t => setForm({...form, next: t})} placeholder="Min 6 characters" />

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput style={styles.input} secureTextEntry value={form.confirm} onChangeText={t => setForm({...form, confirm: t})} placeholder="Retype new password" />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsVisible(false)}>
                                <Text style={styles.btnTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextSave}>Update Password</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 3 },
    iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuText: { fontSize: 16, fontFamily: fonts.bold, color: '#1e293b', flex: 1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 10 },
    modalTitle: { fontSize: 22, fontFamily: fonts.bold, color: '#1e293b', marginBottom: 20 },
    label: { fontSize: 13, fontFamily: fonts.bold, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' },
    input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginBottom: 16, color: '#1e293b', fontSize: 15 },
    modalButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 15 },
    cancelBtn: { paddingVertical: 10, paddingHorizontal: 10 },
    saveBtn: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, flex: 1, alignItems: 'center', elevation: 2 },
    btnTextCancel: { color: '#94a3b8', fontFamily: fonts.bold, fontSize: 15 },
    btnTextSave: { color: '#fff', fontFamily: fonts.bold, fontSize: 15 }
});
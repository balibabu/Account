import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../constants';

export default function AppLockAuthScreen({ authenticateUserByPin, authenticateUserByBiometric }) {
    const [pin, setPin] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
                    
                    <View style={styles.lockHeader}>
                        <View style={styles.iconCircle}>
                            <Icon name="lock-closed" size={40} color="#4A90E2" />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Enter your 6-digit PIN to unlock</Text>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Security PIN</Text>
                        <TextInput
                            style={styles.pinInput}
                            value={pin}
                            onChangeText={setPin}
                            keyboardType="numeric"
                            maxLength={6}
                            secureTextEntry
                            placeholder="0 0 0 0 0 0"
                            placeholderTextColor="#CBD5E1"
                        />
                    </View>

                    <TouchableOpacity style={styles.primaryBtn} onPress={() => authenticateUserByPin(pin)} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Unlock App</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.bioBtn} onPress={authenticateUserByBiometric}>
                        <Icon name="finger-print-outline" size={24} color="#4A90E2" style={{marginRight: 8}} />
                        <Text style={styles.bioBtnText}>Use Biometric Login</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
    content: { flex: 1, justifyContent: 'center' },
    lockHeader: { alignItems: 'center', marginBottom: 50 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontFamily: fonts.bold, color: '#1E293B', marginBottom: 8 },
    subtitle: { fontSize: 16, fontFamily: fonts.regular, color: '#64748B' },
    inputWrapper: { position: 'relative', marginBottom: 40 },
    inputLabel: { position: 'absolute', top: -10, left: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 6, fontSize: 12, fontFamily: fonts.bold, color: '#64748B', zIndex: 10, textTransform: 'uppercase' },
    pinInput: { height: 65, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, fontSize: 28, letterSpacing: 15, textAlign: 'center', color: '#1E293B', fontFamily: fonts.bold },
    primaryBtn: { backgroundColor: '#4A90E2', paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 4, shadowColor: '#4A90E2', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    btnText: { color: '#FFFFFF', fontSize: 18, fontFamily: fonts.bold },
    bioBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25, padding: 10 },
    bioBtnText: { color: '#4A90E2', fontSize: 15, fontFamily: fonts.bold }
});
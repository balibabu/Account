import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';

export default function AppLockAuthScreen({ authenticateUserByPin, authenticateUserByBiometric }) {
    const [pin, setPin] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter PIN to unlock</Text>

            <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                placeholder="••••••"
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={()=>authenticateUserByPin(pin)}>
                <Text style={styles.btnText}>Unlock</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={authenticateUserByBiometric}>
                <Text style={styles.secondaryBtnText}>Use Fingerprint instead</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
    iconPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    pinInput: { width: '80%', height: 60, fontSize: 24, letterSpacing: 10, textAlign: 'center', borderBottomWidth: 2, borderBottomColor: '#333', marginBottom: 40, color: '#000' },
    primaryBtn: { width: '100%', backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    secondaryBtn: { padding: 10 },
    secondaryBtnText: { color: '#007AFF', fontSize: 14 },
});
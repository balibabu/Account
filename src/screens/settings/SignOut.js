import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { useAppLock } from '../../contexts/AppLockContext';

export default function SignOut() {
    const { logout } = useAuth();
    const { disableAppLock } = useAppLock();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to sign out of your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => [logout(), disableAppLock()], style: 'destructive' }
        ], { cancelable: true });
    };

    return (
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.iconContainer}>
                <Icon name="log-out-outline" size={22} color="#ef4444" />
            </View>
            <Text style={styles.menuText}>Logout</Text>
            <Icon name="chevron-forward" size={18} color="#fee2e2" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ef4444',
        flex: 1,
    },
});
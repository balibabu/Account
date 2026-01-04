import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useAppLock } from '../../contexts/AppLockContext';

export default function SignOut() {
    const { logout } = useAuth();
    const { disableAppLock } = useAppLock();

    function logoutHandler() {
        logout();
        disableAppLock();
    }

    return (
        <>
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logoutHandler}>
                <View style={[styles.iconContainer, styles.logoutIconBg]}>
                    <Text style={styles.icon}>🚪</Text>
                </View>
                <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
        </>
    )
}


const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, },
    iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15, },
    icon: { fontSize: 18, },
    menuText: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, },
    logoutItem: { marginTop: 10, },
    logoutText: { color: '#FF5252', },
    logoutIconBg: { backgroundColor: '#FFEBEE', },
});
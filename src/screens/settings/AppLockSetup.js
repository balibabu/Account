import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppLock } from '../../contexts/AppLockContext';


export default function AppLockSetup() {
    const [isModelVisible, setIsModelVisible] = useState(false);
    const [pin, setPin] = useState('');
    const { enableAppLock, isLockEnabled, disableAppLock } = useAppLock();

    function handlePinChange() {
        if (pin.length < 6) {
            Alert.alert('Error', 'Please Enter Six Digits Pin');
        } else {
            enableAppLock(pin);
            setIsModelVisible(false);
        }
    }

    async function menuClickHandler(){
        if(isLockEnabled){
            disableAppLock();
        }else{
            Alert.alert('Success', 'Fingerprint enabled!', [
                { text: 'OK', onPress: () => setIsModelVisible(true) }
            ]);
        }
    }
    

    return (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={menuClickHandler}>
                <View style={[styles.iconContainer, styles.logoutIconBg]}>
                    <Text style={styles.icon}>🔒</Text>
                </View>
                <Text style={[styles.menuText, isLockEnabled && styles.logoutText]}>{isLockEnabled?'Turn Off AppLock':'Turn On AppLock'}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModelVisible}
                onRequestClose={() => setIsModelVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Six Digits Pin</Text>

                        <TextInput
                            style={styles.pinInput}
                            value={pin}
                            onChangeText={setPin}
                            keyboardType="numeric"
                            maxLength={6}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handlePinChange}>
                                <Text style={styles.btnTextSave}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4a148c',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },
    nameEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    editIcon: {
        fontSize: 18,
        color: '#4a148c',
        marginLeft: 8,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F3E5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 18,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    arrow: {
        fontSize: 20,
        color: '#ccc',
        fontWeight: 'bold',
    },
    logoutItem: {
        marginTop: 10,
    },
    logoutText: {
        color: '#FF5252',
    },
    logoutIconBg: {
        backgroundColor: '#FFEBEE',
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        opacity: 0.2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    pinInput: {
        etterSpacing: 10, textAlign: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F3F4F6',
        marginRight: 10,
    },
    saveBtn: {
        backgroundColor: '#4a148c',
        marginLeft: 10,
    },
    btnTextCancel: {
        color: '#333',
        fontWeight: 'bold',
    },
    btnTextSave: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { fonts } from '../../constants';


export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handlePress = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subText}>Sign in to continue</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Email</Text>
                        <TextInput style={styles.floatingInput} placeholder="user@example.com" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Password</Text>
                        <TextInput style={styles.floatingInput} placeholder="**********" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    fieldWrapper: {
        position: 'relative',
        marginBottom: 24,
        paddingTop: 10,
    },
    
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 18,
        backgroundColor: '#f5f7fa', // same as input bg
        paddingHorizontal: 6,
        fontSize: 14,
        color: '#777',
        zIndex: 10,
        fontFamily: fonts.light
    },
    
    floatingInput: {
        height: 56,
        borderRadius: 16,
        backgroundColor: '#f5f7fa',
        paddingHorizontal: 16,
        fontSize: 18,
        color: '#333',
    
        borderWidth: 1,
        borderColor: '#d6dbe2',
    },
    
    container: {
        flex: 1,
        backgroundColor: '#B9DDFF', // Softer, modern background
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    
    headerContainer: {
        marginBottom: 45,
        alignItems: 'center',
    },
    
    welcomeText: {
        fontSize: 34,
        // fontWeight: '800',
        color: '#1E293B', // Dark slate
        marginBottom: 8,
        fontFamily: fonts.bold
    },
    
    subText: {
        fontSize: 16,
        color: '#64748B', // Soft gray-blue
    },
    
    subText: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        backgroundColor: '#F6F6F6',
        padding: 28,
        borderRadius: 24,
    
        // iOS shadow (more depth)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
    
        // Android elevation
        elevation: 10,
    },
    
    inputContainer: {
        marginBottom: 18,
    },
    
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 6,
    },
    
    input: {
        height: 52,
        backgroundColor: '#EDEDED',
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#0F172A',
    
        borderWidth: 1,
        borderColor: '#CBD5E1',
    
        // Creates inset illusion
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
    },
    
    button: {
        backgroundColor: '#4A90E2',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
    
        // shadowColor: '#E8E8E8',
        // shadowOffset: { width: 0, height: 6 },
        // shadowOpacity: 0.35,
        // shadowRadius: 10,
        elevation: 4,
    },
    
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    
});


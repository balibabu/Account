import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './screens/form/Form';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './screens/login/LoginScreen';
import { useAuth } from './contexts/AuthContext';
import MyButtomTabs from './components/MyButtomTabs'

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
    console.log(!user);
    const { user, initializing } = useAuth();
    return initializing ?
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View> 
    :
    <NavigationContainer>
        <Stack.Navigator>
            {user ? <>
                <Stack.Screen name="MainTabs" component={MyButtomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Form" component={Form} options={{ headerShown: false, animation: 'slide_from_bottom' }} /></> :
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />}
        </Stack.Navigator>
    </NavigationContainer>
}
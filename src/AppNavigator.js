import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './screens/form/Form';
import LoginScreen from './screens/login/LoginScreen';
import { useAuth } from './contexts/AuthContext';
import MyButtomTabs from './components/MyButtomTabs'

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? <>
                    <Stack.Screen name="MainTabs" component={MyButtomTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Form" component={Form} options={{ headerShown: false, animation: 'slide_from_bottom' }} /></> :
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
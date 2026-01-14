import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './screens/form/Form';
import MyButtomTabs from './components/MyButtomTabs'

const Stack = createNativeStackNavigator();
export default function AppNavigator() {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={MyButtomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Form" component={Form} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
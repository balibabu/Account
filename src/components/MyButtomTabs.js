import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Details from '../screens/details/Details';
import Settings from '../screens/settings/Settings';
import { fonts } from '../constants';


const Tab = createBottomTabNavigator();
export default function MyButtomTabs() {
    const screenOptions = {
        tabBarLabelStyle: { fontSize: 20, fontFamily: fonts.bold, marginTop: 5 },
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#f8f8f8' },
        animation: 'shift',
        // tabBarStyle: { height: 60 },
    };
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={Home} options={{ title: '🏠', headerShown: false }} />
            <Tab.Screen name="Details" component={Details} options={{ title: '📄', headerShown: false }} />
            <Tab.Screen name="Settings" component={Settings} options={{ title: '⚙️', headerShown: false }} />
        </Tab.Navigator>
    );
}

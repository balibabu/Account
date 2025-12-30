import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Details from '../screens/details/Details';
import Settings from '../screens/settings/Settings';


const Tab = createBottomTabNavigator();
export default function MyButtomTabs() {
    const screenOptions = {
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#f8f8f8' },
        animation: 'shift',
    };
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={Home} options={{ title: '🏠 Home', headerShown: false }} />
            <Tab.Screen name="Details" component={Details} options={{ title: '📄 Details', headerShown: false }} />
            <Tab.Screen name="Settings" component={Settings} options={{ title: '⚙️ Settings', headerShown: false }} />
        </Tab.Navigator>
    );
}

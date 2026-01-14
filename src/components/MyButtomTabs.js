import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/home/Home';
import Details from '../screens/details/Details';
import Settings from '../screens/settings/Settings';
import Charts from '../screens/charts/Charts';
import { fonts } from '../constants';

const Tab = createBottomTabNavigator();

const TABS = [
    { name: 'Home', component: Home, active: 'home', inactive: 'home-outline' },
    { name: 'Details', component: Details, active: 'document-text', inactive: 'document-text-outline' },
    { name: 'Charts', component: Charts, active: 'stats-chart', inactive: 'stats-chart-outline' },
    { name: 'Settings', component: Settings, active: 'settings', inactive: 'settings-outline' },
];

export default function MyBottomTabs() {
    return (
        <Tab.Navigator screenOptions={screenOptions} >
            {TABS.map(tab => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />)}
        </Tab.Navigator>
    );
}

const screenOptions = ({ route }) => ({
    headerShown: false,
    // animation: 'shift',
    tabBarActiveTintColor: '#2563eb',
    tabBarInactiveTintColor: '#64748b',
    tabBarHideOnKeyboard: true,
    tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12, marginBottom: 10 },
    tabBarStyle: { height: 70, backgroundColor: '#ffffff', paddingTop: 10 },
    tabBarIcon: ({ focused, color }) => {
        const tab = TABS.find(t => t.name === route.name);
        return <Icon name={focused ? tab.active : tab.inactive} size={24} color={color} />;
    },
});
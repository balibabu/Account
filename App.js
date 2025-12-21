import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import Home from './src/screens/home/Home';
import Details from './src/screens/details/Details';
import Settings from './src/screens/settings/Settings';
import Form from './src/screens/form/Form';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
          tabBarIconStyle: { display: 'none' }, // Hides the empty space for icons
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{ title: '🏠 Home' }} 
        />
        <Tab.Screen 
          name="Details" 
          component={Details} 
          options={{ title: '📄 Details' }} 
        />
        <Tab.Screen 
          name="Settings" 
          component={Settings} 
          options={{ title: '⚙️ Settings' }} 
        />
        <Tab.Screen 
          name="Form" 
          component={Form} 
          options={{ 
            tabBarButton: () => null, // This hides the tab from the bottom bar
            title: 'Entry Form'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
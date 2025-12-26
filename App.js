import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Details from './src/screens/details/Details';
import Settings from './src/screens/settings/Settings';
import Form from './src/screens/form/Form';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#f8f8f8' },
        animation: 'shift',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: '🏠 Home' }} />
      <Tab.Screen name="Details" component={Details} options={{ title: '📄 Details' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: '⚙️ Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }}/>
        <Stack.Screen name="Form" component={Form} options={{ title: 'Entry Form',
            presentation: 'modal', // Optional: Makes it slide up like a card
            animation: 'slide_from_bottom' // Optional: Animation style
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
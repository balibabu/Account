import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import Home from './src/screens/home/Home';
import Details from './src/screens/details/Details';
import Settings from './src/screens/settings/Settings';
import Form from './src/screens/form/Form';

// Initialize Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Create the Tab Navigator Component (Only the actual tabs)
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#f8f8f8' },
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: '🏠 Home' }} />
      <Tab.Screen name="Details" component={Details} options={{ title: '📄 Details' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: '⚙️ Settings' }} />
    </Tab.Navigator>
  );
}

// 2. The Root App Component (The Stack)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {/* The first screen is our Tab Navigator */}
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabs} 
          options={{ headerShown: false }} // Hide header so we see the Tab's header instead
        />

        {/* The Form is now a Stack screen, sitting "above" the tabs */}
        <Stack.Screen 
          name="Form" 
          component={Form} 
          options={{ 
            title: 'Entry Form',
            presentation: 'modal', // Optional: Makes it slide up like a card
            animation: 'slide_from_bottom' // Optional: Animation style
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
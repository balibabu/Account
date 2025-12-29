import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/home/Home';
import Details from './screens/details/Details';
import Settings from './screens/settings/Settings';
import Form from './screens/form/Form';
import { auth } from './src/firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Button, 
  ActivityIndicator, 
  Alert, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './screens/login/LoginScreen';
import { useAuth } from './contexts/AuthContext';

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
      <Tab.Screen name="Home" component={Home} options={{ title: '🏠 Home', headerShown: false }} />
      <Tab.Screen name="Details" component={Details} options={{ title: '📄 Details' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: '⚙️ Settings' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
    const { user, initializing } = useAuth();

    if (initializing) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }


  return (
    <NavigationContainer>
    <Stack.Navigator>
    {user ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }}/>
            <Stack.Screen name="Form" component={Form} options={{ title: 'Entry Form',
                presentation: 'modal', // Optional: Makes it slide up like a card
                animation: 'slide_from_bottom' // Optional: Animation style
                }} 
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
        )}
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});


// import React from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// // Imports
// import { AuthProvider, useAuth } from './src/AuthContext';
// import LoginScreen from './src/LoginScreen';
// // ... import your BottomTabs and Form here ...

// const Stack = createNativeStackNavigator();

// // Create a component that controls Navigation based on Auth
// const AppNavigator = () => {
//   const { user, initializing } = useAuth();

//   if (initializing) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {user ? (
//           // --- Screens for Logged In Users ---
//           <>
//             <Stack.Screen 
//               name="MainTabs" 
//               component={BottomTabs} // Your existing BottomTabs
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen 
//               name="Form" 
//               component={Form} // Your existing Form
//               options={{ 
//                 title: 'Entry Form',
//                 presentation: 'modal',
//                 animation: 'slide_from_bottom'
//               }} 
//             />
//           </>
//         ) : (
//           // --- Screens for Guests (Not Logged In) ---
//           <Stack.Screen 
//             name="Login" 
//             component={LoginWrapper} // We wrap LoginScreen to handle the context logic
//             options={{ headerShown: false }} 
//           />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// // Wrapper for LoginScreen to connect it to Context
// const LoginWrapper = () => {
//   const { login } = useAuth();
//   const [loading, setLoading] = React.useState(false);

//   const handleLogin = async (email, password) => {
//     setLoading(true);
//     try {
//       await login(email, password);
//     } catch (e) {
//       alert("Login failed: " + e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return <LoginScreen onLogin={handleLogin} loading={loading} />;
// };


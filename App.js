import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Details from './src/screens/details/Details';
import Settings from './src/screens/settings/Settings';
import Form from './src/screens/form/Form';
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
  // SafeAreaView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/login/LoginScreen';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin}/>;

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

  
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }}/>
//         <Stack.Screen name="Form" component={Form} options={{ title: 'Entry Form',
//             presentation: 'modal', // Optional: Makes it slide up like a card
//             animation: 'slide_from_bottom' // Optional: Animation style
//           }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
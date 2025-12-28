import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';


export default function SettingsScreen() {
    const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚙️ Settings Screen</Text>
      <View style={{ marginTop: 20 }}>
            <Button title="Logout" onPress={logout} color="#FF5252" />
      </View>
      <Text style={styles.footerText}>made by babuwa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3e5f5' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#4a148c' },
  footerText:{fontSize: 24, fontWeight:'bold', color:'red', opacity:0.1, marginTop: 20}
});
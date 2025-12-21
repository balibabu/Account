import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Form({ route }) {
  // Extract the ID from the route params
  const { id } = route.params || { id: 0 }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Screen</Text>
      <Text>Received ID: {id}</Text>
      {id === 0 ? (
        <Text style={styles.mode}>Mode: Creating New Entry</Text>
      ) : (
        <Text style={styles.mode}>Mode: Updating Entry {id}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  mode: { marginTop: 10, color: 'blue' }
});
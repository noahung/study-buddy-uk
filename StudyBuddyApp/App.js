import React from 'react';
import { View, Text, StyleSheet, AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Study Buddy Mobile Test</Text>
      <Text style={styles.subtext}>Simple React Native App</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => App);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
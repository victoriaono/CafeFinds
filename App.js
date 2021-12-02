import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import Map from './src/Map';
import Data from './src/Data';

const App = () => { 
  return (
      <View style={styles.container}>
        <View style={styles.header}>
         <Text style={styles.title}>Cafe Finds</Text>
         <Text style={styles.subtitle}>Find local coffee shops that are specifically good for being on that grind!</Text>
        </View>
        <Map />
        <Data />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
    backgroundColor: '#E0B1CB',
  },
  title: {
    marginTop: '10%',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 30,
    color: '#fff',
  },
  subtitle: {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 30,
  }
});

export default App;

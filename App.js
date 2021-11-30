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
    flex: 0.3,
    backgroundColor: '#E0B1CB',
  },
  title: {
    marginTop: '10%',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 30,
    color: '#fff',
  },
  
});

export default App;

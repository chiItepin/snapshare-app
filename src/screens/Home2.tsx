import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home2:FunctionComponent = () => (
  <View style={styles.container}>
    <Text>This is HOME2</Text>
  </View>
);

export default Home2;

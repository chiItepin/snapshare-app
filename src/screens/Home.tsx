import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
} from 'react-native-ui-lib';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface IPropsNavigation {
  navigation: any;
}

const Home:FunctionComponent<IPropsNavigation> = ({ navigation }: IPropsNavigation) => (
  <View style={styles.container}>
    <Text>This is Home</Text>
    <Button
      onPress={() => navigation.navigate('Home2')}
      label="Go to Home 2"
      borderRadius={4}
    />
  </View>
);

export default Home;

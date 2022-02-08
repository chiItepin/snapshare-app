import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppReducer from './src/reducer';
import Navigation from './src/components/Routes';
import UserPlaceholder from './src/components/UserPlaceholder';

const store = createStore(AppReducer);

const App:FunctionComponent = () => (
  <Provider store={store}>
    <UserPlaceholder />

    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  </Provider>
);

export default App;

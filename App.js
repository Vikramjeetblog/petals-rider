import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RiderNavigator from './src/navigation/RiderNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RiderNavigator />
    </SafeAreaProvider>
  );
}

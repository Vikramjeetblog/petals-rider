import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ErrorBoundary from './src/components/ErrorBoundary';
import RiderNavigator from './src/navigation/RiderNavigator';
import { AppStoreProvider } from './src/store/AppStore';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppStoreProvider>
          <RiderNavigator />
        </AppStoreProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

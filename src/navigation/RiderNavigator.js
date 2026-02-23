import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RiderTabs from './RiderTabs';
import {
  fetchRiderMe,
  setApiErrorHandler,
  setAuthToken,
  setNetworkStatusHandler,
  setUnauthorizedHandler,
} from '../services/riderApi';
import { AUTH_TOKEN_STORAGE_KEY, INTRO_STORAGE_KEY } from '../constants/storageKeys';
import { useAppStore } from '../store/AppStore';
import ToastHost from '../components/ui/ToastHost';
import OfflineBanner from '../components/ui/OfflineBanner';
import useNetworkStatus from '../hooks/useNetworkStatus';

import IntroOnboardingScreen from '../screens/IntroOnboardingScreen';
import RiderLoginScreen from '../screens/auth/RiderLoginScreen';
import RiderOtpScreen from '../screens/auth/RiderOtpScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import DeliveryProofScreen from '../screens/DeliveryProofScreen';
import EditRiderProfileScreen from '../rider/EditRiderProfileScreen';
import RiderPayoutScreen from '../rider/RiderPayoutScreen';
import BankAccountScreen from '../rider/BankAccountScreen';
import AddBankAccountScreen from '../rider/AddBankAccountScreen';
import PermissionsSetupScreen from '../rider/PermissionsSetupScreen';
import KycStatusScreen from '../rider/KycStatusScreen';
import KycDocumentUploadScreen from '../rider/KycDocumentUploadScreen';
import KycSelfieScreen from '../rider/KycSelfieScreen';
import OnboardingChecklistScreen from '../rider/OnboardingChecklistScreen';
import ShiftManagementScreen from '../rider/ShiftManagementScreen';
import NotificationsScreen from '../rider/NotificationsScreen';
import NotificationDetailScreen from '../rider/NotificationDetailScreen';
import SupportCenterScreen from '../rider/SupportCenterScreen';
import IssueReportScreen from '../rider/IssueReportScreen';
import SafetyTrainingScreen from '../rider/SafetyTrainingScreen';
import OrderPickupScreen from '../rider/OrderPickupScreen';
import OrderEnRouteScreen from '../rider/OrderEnRouteScreen';
import OrderArrivedScreen from '../rider/OrderArrivedScreen';
import DeliverySummaryScreen from '../rider/DeliverySummaryScreen';

const Stack = createNativeStackNavigator();

function IntroStack({ onComplete }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroOnboarding">{(props) => <IntroOnboardingScreen {...props} onComplete={onComplete} />}</Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderLogin" component={RiderLoginScreen} />
      <Stack.Screen name="RiderOtp">{(props) => <RiderOtpScreen {...props} onLogin={onLogin} />}</Stack.Screen>
    </Stack.Navigator>
  );
}

function RiderStack({ onLogout }) {
  return (
    <Stack.Navigator initialRouteName="OnboardingChecklist" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnboardingChecklist" component={OnboardingChecklistScreen} />
      <Stack.Screen name="RiderTabs">{(props) => <RiderTabs {...props} onLogout={onLogout} />}</Stack.Screen>
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="OrderPickup" component={OrderPickupScreen} />
      <Stack.Screen name="OrderEnRoute" component={OrderEnRouteScreen} />
      <Stack.Screen name="OrderArrived" component={OrderArrivedScreen} />
      <Stack.Screen name="DeliveryProof" component={DeliveryProofScreen} />
      <Stack.Screen name="DeliverySummary" component={DeliverySummaryScreen} />
      <Stack.Screen name="EditProfile" component={EditRiderProfileScreen} />
      <Stack.Screen name="Payout" component={RiderPayoutScreen} />
      <Stack.Screen name="BankAccount" component={BankAccountScreen} />
      <Stack.Screen name="AddBankAccount" component={AddBankAccountScreen} />
      <Stack.Screen name="PermissionsSetup" component={PermissionsSetupScreen} />
      <Stack.Screen name="KycStatus" component={KycStatusScreen} />
      <Stack.Screen name="KycDocumentUpload" component={KycDocumentUploadScreen} />
      <Stack.Screen name="KycSelfie" component={KycSelfieScreen} />
      <Stack.Screen name="ShiftManagement" component={ShiftManagementScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
      <Stack.Screen name="IssueReport" component={IssueReportScreen} />
      <Stack.Screen name="SafetyTraining" component={SafetyTrainingScreen} />
    </Stack.Navigator>
  );
}

export default function RiderNavigator() {
  const { state, dispatch, theme } = useAppStore();
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useNetworkStatus();

  const clearSession = async () => {
    setAuthToken(null);
    dispatch({ type: 'SET_AUTH', payload: { token: null, isLoggedIn: false } });
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY).catch(() => null);
  };

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [introDone, token] = await Promise.all([
          AsyncStorage.getItem(INTRO_STORAGE_KEY),
          AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
        ]);
        setHasSeenIntro(introDone === 'true');

        if (!token) return;

        setAuthToken(token);
        try {
          const profile = await fetchRiderMe();
          dispatch({ type: 'SET_PROFILE', payload: profile });
          dispatch({ type: 'SET_AUTH', payload: { token, isLoggedIn: true } });
        } catch {
          await clearSession();
        }
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      dispatch({ type: 'SHOW_TOAST', payload: 'Session expired. Please login again.' });
    });

    setApiErrorHandler(({ status, message }) => {
      if (status === 401 || !message) return;
      dispatch({ type: 'SHOW_TOAST', payload: message });
      Alert.alert('Request failed', message);
    });

    setNetworkStatusHandler((isOnline) => {
      dispatch({ type: 'SET_OFFLINE', payload: !isOnline });
    });

    return () => {
      setUnauthorizedHandler(null);
      setApiErrorHandler(null);
      setNetworkStatusHandler(null);
    };
  }, []);

  const completeIntro = async () => {
    await AsyncStorage.setItem(INTRO_STORAGE_KEY, 'true').catch(() => null);
    setHasSeenIntro(true);
  };

  const handleLogin = async (token) => {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token).catch(() => null);
    setAuthToken(token);
    dispatch({ type: 'SET_AUTH', payload: { token, isLoggedIn: true } });
  };

  const navigationTheme = useMemo(() => {
    const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.textPrimary,
      },
    };
  }, [theme]);

  if (isHydrating) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <OfflineBanner />
      <NavigationContainer theme={navigationTheme}>
        {!hasSeenIntro ? <IntroStack onComplete={completeIntro} /> : state.auth.isLoggedIn ? <RiderStack onLogout={clearSession} /> : <AuthStack onLogin={handleLogin} />}
      </NavigationContainer>
      <ToastHost />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

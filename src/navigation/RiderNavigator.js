import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RiderTabs from './RiderTabs';

// Intro screen
import IntroOnboardingScreen from '../screens/IntroOnboardingScreen';

// Auth screens
import RiderLoginScreen from '../screens/auth/RiderLoginScreen';
import RiderOtpScreen from '../screens/auth/RiderOtpScreen';

// Core detail screens
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import DeliveryProofScreen from '../screens/DeliveryProofScreen';
import EditRiderProfileScreen from '../rider/EditRiderProfileScreen';

// Payout flow screens
import RiderPayoutScreen from '../rider/RiderPayoutScreen';
import BankAccountScreen from '../rider/BankAccountScreen';
import AddBankAccountScreen from '../rider/AddBankAccountScreen';

// Onboarding & utilities
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

// Order lifecycle
import OrderPickupScreen from '../rider/OrderPickupScreen';
import OrderEnRouteScreen from '../rider/OrderEnRouteScreen';
import OrderArrivedScreen from '../rider/OrderArrivedScreen';
import DeliverySummaryScreen from '../rider/DeliverySummaryScreen';

const INTRO_STORAGE_KEY = '@petals_rider_intro_completed';
const Stack = createNativeStackNavigator();

function IntroStack({ onComplete }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroOnboarding">
        {(props) => <IntroOnboardingScreen {...props} onComplete={onComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderLogin" component={RiderLoginScreen} />
      <Stack.Screen name="RiderOtp">
        {(props) => <RiderOtpScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function RiderStack({ onLogout }) {
  return (
    <Stack.Navigator initialRouteName="OnboardingChecklist" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingChecklist" component={OnboardingChecklistScreen} />

      <Stack.Screen name="RiderTabs">
        {(props) => <RiderTabs {...props} onLogout={onLogout} />}
      </Stack.Screen>

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateNavigationState = async () => {
      try {
        const introDone = await AsyncStorage.getItem(INTRO_STORAGE_KEY);
        setHasSeenIntro(introDone === 'true');
      } catch {
        setHasSeenIntro(false);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateNavigationState();
  }, []);

  const completeIntro = async () => {
    try {
      await AsyncStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // no-op for offline/dev fallback
    }

    setHasSeenIntro(true);
  };

  if (isHydrating) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!hasSeenIntro ? (
        <IntroStack onComplete={completeIntro} />
      ) : isLoggedIn ? (
        <RiderStack onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <AuthStack setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
});

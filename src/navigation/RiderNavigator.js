import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RiderTabs from './RiderTabs';

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
import PermissionsSetupScreen from '../rider/PermissionsSetupScreen';
import KycStatusScreen from '../rider/KycStatusScreen';
import ShiftManagementScreen from '../rider/ShiftManagementScreen';
import NotificationsScreen from '../rider/NotificationsScreen';
import IssueReportScreen from '../rider/IssueReportScreen';
import OrderPickupScreen from '../rider/OrderPickupScreen';
import OrderEnRouteScreen from '../rider/OrderEnRouteScreen';

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

// Order lifecycle
import OrderPickupScreen from '../rider/OrderPickupScreen';
import OrderEnRouteScreen from '../rider/OrderEnRouteScreen';
import OrderArrivedScreen from '../rider/OrderArrivedScreen';
import DeliverySummaryScreen from '../rider/DeliverySummaryScreen';

const Stack = createNativeStackNavigator();

// 🔐 Auth Stack
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

// 🏍 Rider Stack (Tabs + Detail Screens)
function RiderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderTabs" component={RiderTabs} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="DeliveryProof" component={DeliveryProofScreen} />
      <Stack.Screen name="EditProfile" component={EditRiderProfileScreen} />

      {/* Earnings → Payout flow */}
      <Stack.Screen name="Payout" component={RiderPayoutScreen} />

      {/* Bank details flow (for withdrawal) */}
      <Stack.Screen name="BankAccount" component={BankAccountScreen} />
      <Stack.Screen name="AddBankAccount" component={AddBankAccountScreen} />

      {/* Onboarding & utilities */}
      <Stack.Screen name="PermissionsSetup" component={PermissionsSetupScreen} />
      <Stack.Screen name="KycStatus" component={KycStatusScreen} />
      <Stack.Screen name="ShiftManagement" component={ShiftManagementScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="IssueReport" component={IssueReportScreen} />

      {/* Order lifecycle */}
      <Stack.Screen name="OrderPickup" component={OrderPickupScreen} />
      <Stack.Screen name="OrderEnRoute" component={OrderEnRouteScreen} />
      <Stack.Screen name="OrderArrived" component={OrderArrivedScreen} />
      <Stack.Screen name="DeliverySummary" component={DeliverySummaryScreen} />
    </Stack.Navigator>
  );
}

// 🌍 Root Navigator
export default function RiderNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? <RiderStack /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}

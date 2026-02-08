import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth screens
import RiderLoginScreen from '../screens/auth/RiderLoginScreen';
import RiderOtpScreen from '../screens/auth/RiderOtpScreen';

// Rider core screens
import RiderDashboardScreen from '../screens/RiderDashboardScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import DeliveryProofScreen from '../screens/DeliveryProofScreen';
import RiderProfileScreen from '../screens/RiderProfileScreen';
import EditRiderProfileScreen from '../rider/EditRiderProfileScreen';

// Rider tabs
import EarningsScreen from '../rider/EarningsScreen';
import ActivityScreen from '../rider/ActivityScreen';

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
import OrderArrivedScreen from '../rider/OrderArrivedScreen';
import DeliverySummaryScreen from '../rider/DeliverySummaryScreen';
import OnboardingChecklistScreen from '../rider/OnboardingChecklistScreen';
import SupportCenterScreen from '../rider/SupportCenterScreen';
import NotificationDetailScreen from '../rider/NotificationDetailScreen';
import KycDocumentUploadScreen from '../rider/KycDocumentUploadScreen';
import KycSelfieScreen from '../rider/KycSelfieScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🟢 Rider Tabs
function RiderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#9CA3AF',

        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: '#fff',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color, size }) => {
          let icon = 'ellipse-outline';

          switch (route.name) {
            case 'Deliveries':
              icon = focused ? 'bicycle' : 'bicycle-outline';
              break;
            case 'Earnings':
              icon = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Activity':
              icon = focused ? 'list' : 'list-outline';
              break;
            case 'Profile':
              icon = focused ? 'person' : 'person-outline';
              break;
          }

          return <Icon name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Deliveries" component={RiderDashboardScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={RiderProfileScreen} />
    </Tab.Navigator>
  );
}

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
      <Stack.Screen name="KycDocumentUpload" component={KycDocumentUploadScreen} />
      <Stack.Screen name="KycSelfie" component={KycSelfieScreen} />
      <Stack.Screen name="OnboardingChecklist" component={OnboardingChecklistScreen} />
      <Stack.Screen name="ShiftManagement" component={ShiftManagementScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
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

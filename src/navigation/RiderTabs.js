import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import RiderDashboardScreen from '../screens/RiderDashboardScreen';
import RiderProfileScreen from '../screens/RiderProfileScreen';
import EarningsScreen from '../rider/EarningsScreen';
import ActivityScreen from '../rider/ActivityScreen';

const Tab = createBottomTabNavigator();

export default function RiderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#9CA3AF',

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.label,

        tabBarIcon: ({ focused, color, size }) => {
          let icon;

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

          return (
            <View style={focused ? styles.activeIcon : null}>
              <Icon name={icon} size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Deliveries"
        component={RiderDashboardScreen}
      />

      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
      />

      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
      />

      <Tab.Screen
        name="Profile"
        component={RiderProfileScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  tabBar: {
    height: 68,
    paddingBottom: 10,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
  },

  activeIcon: {
    backgroundColor: '#DCFCE7',
    padding: 6,
    borderRadius: 14,
  },

});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const quickActions = [
  {
    id: 'onboardingCenter',
    title: 'Onboarding & Setup Center',
    subtitle: 'KYC, bank details, permissions, safety training',
    icon: 'grid-outline',
    route: 'OnboardingChecklist',
  },
  {
    id: 'kyc',
    title: 'KYC Verification',
    subtitle: 'Upload or update verification documents',
    icon: 'shield-checkmark-outline',
    route: 'KycStatus',
  },
  {
    id: 'bank',
    title: 'Bank Details',
    subtitle: 'Add or change payout bank account',
    icon: 'card-outline',
    route: 'BankAccount',
  },
  {
    id: 'permissions',
    title: 'App Permissions',
    subtitle: 'Location, notification and battery setup',
    icon: 'settings-outline',
    route: 'PermissionsSetup',
  },
];

const profileLinks = [
  {
    id: 'edit',
    title: 'Edit Profile',
    subtitle: 'Update personal and vehicle details',
    icon: 'create-outline',
    route: 'EditProfile',
  },
  {
    id: 'issue',
    title: 'Report an Issue',
    subtitle: 'Share delivery, app, or payout issues',
    icon: 'alert-circle-outline',
    route: 'IssueReport',
  },
  {
    id: 'payments',
    title: 'Payments',
    subtitle: 'Payout wallet & bank account',
    icon: 'cash-outline',
    route: 'Payout',
  },
  {
    id: 'shift',
    title: 'Shift Management',
    subtitle: 'Set your active delivery schedule',
    icon: 'time-outline',
    route: 'ShiftManagement',
  },
  {
    id: 'support',
    title: 'Help & Support',
    subtitle: 'Get assistance and contact support',
    icon: 'help-circle-outline',
    route: 'SupportCenter',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Check order alerts and updates',
    icon: 'notifications-outline',
    route: 'Notifications',
  },
];

function ProfileActionRow({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.cardRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <View style={styles.rowIconWrap}>
          <Icon name={icon} size={18} color="#16A34A" />
        </View>
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSub}>{subtitle}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function RiderProfileScreen({ navigation, onLogout }) {
  const rider = {
    name: 'Rahul Kumar',
    phone: '9876543210',
    vehicle: 'Bike • DL 01 AB 1234',
  };

  const [online, setOnline] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          if (onLogout) {
            onLogout();
          } else {
            Alert.alert('Logout unavailable', 'Please reconnect logout handler in navigator.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0F766E', '#16A34A']} style={styles.header}>
        <Icon name="person-circle" size={62} color="#fff" />
        <Text style={styles.name}>{rider.name}</Text>
        <Text style={styles.phone}>+91 {rider.phone}</Text>

        <View style={styles.headerMetaRow}>
          <View style={styles.metaPill}>
            <Icon name="bicycle-outline" size={14} color="#DCFCE7" />
            <Text style={styles.metaText}>{rider.vehicle}</Text>
          </View>
          <View style={styles.metaPill}>
            <Icon name="star-outline" size={14} color="#DCFCE7" />
            <Text style={styles.metaText}>4.8 rating</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Text style={styles.sectionHint}>{online ? 'You are online for new orders' : 'You are offline'}</Text>
            </View>
            <Switch value={online} onValueChange={setOnline} thumbColor="#16A34A" />
          </View>
        </View>

        <Text style={styles.groupTitle}>Account Setup (Anytime Update)</Text>
        {quickActions.map((item) => (
          <ProfileActionRow
            key={item.id}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}

        <Text style={styles.groupTitle}>Profile & Operations</Text>
        {profileLinks.map((item) => (
          <ProfileActionRow
            key={item.id}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today’s Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹540</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8h</Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 20, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  name: { color: '#fff', fontSize: 21, fontWeight: '800', marginTop: 6 },
  phone: { color: '#ECFDF5', marginTop: 2 },
  headerMetaRow: { marginTop: 14, flexDirection: 'row' },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  metaText: { color: '#DCFCE7', marginLeft: 6, fontSize: 12, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 28 },
  groupTitle: { marginBottom: 10, marginTop: 8, color: '#374151', fontWeight: '800' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  sectionTitle: { fontWeight: '800', color: '#111827' },
  sectionHint: { marginTop: 4, color: '#6B7280', fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
  },
  rowTextWrap: { marginLeft: 10 },
  rowTitle: { fontWeight: '800', color: '#111827' },
  rowSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statBox: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  statValue: { fontSize: 19, fontWeight: '800', color: '#16A34A' },
  statLabel: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: { color: '#fff', marginLeft: 6, fontWeight: '700' },
});

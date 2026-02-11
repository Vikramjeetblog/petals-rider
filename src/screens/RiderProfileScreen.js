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

export default function RiderProfileScreen({ navigation }) {
  const rider = {
    name: 'Rahul Kumar',
    phone: '9876543210',
    vehicle: 'Bike • DL 01 AB 1234',
  };

  const [online, setOnline] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: () => {
          // TODO: connect to setIsLoggedIn(false) in RiderNavigator
          Alert.alert('Logout', 'Connect logout to setIsLoggedIn(false).');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <Icon name="person-circle" size={60} color="#fff" />
        <Text style={styles.name}>{rider.name}</Text>
        <Text style={styles.phone}>+91 {rider.phone}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Rider Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rider Info</Text>
          <View style={styles.row}>
            <Icon name="bicycle" size={18} color="#16A34A" />
            <Text style={styles.text}>{rider.vehicle}</Text>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Rider Online</Text>
            <Switch value={online} onValueChange={setOnline} thumbColor="#16A34A" />
          </View>
        </View>

        {/* ✅ Payments (ONE clear option) */}
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => navigation.navigate('Payout')}
          activeOpacity={0.85}
        >
          <View style={styles.row}>
            <Icon name="cash-outline" size={18} color="#16A34A" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.rowTitle}>Payments</Text>
              <Text style={styles.rowSub}>Payout wallet & bank account</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => navigation.navigate('ShiftManagement')}
          activeOpacity={0.85}
        >
          <View style={styles.row}>
            <Icon name="time-outline" size={18} color="#16A34A" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.rowTitle}>Shift Management</Text>
              <Text style={styles.rowSub}>Set your active delivery schedule</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => navigation.navigate('SupportCenter')}
          activeOpacity={0.85}
        >
          <View style={styles.row}>
            <Icon name="help-circle-outline" size={18} color="#16A34A" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.rowTitle}>Help & Support</Text>
              <Text style={styles.rowSub}>Get assistance and contact support</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Today’s Summary */}
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
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: { padding: 20, alignItems: 'center' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 6 },
  phone: { color: '#ECFDF5', marginTop: 2 },

  content: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: { fontWeight: '700', marginBottom: 10 },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  text: { marginLeft: 8, color: '#374151' },

  rowTitle: { fontWeight: '800', color: '#111827' },
  rowSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#16A34A' },
  statLabel: { color: '#6B7280' },

  logoutBtn: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { color: '#fff', marginLeft: 6, fontWeight: '700' },
});

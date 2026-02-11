import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const permissions = [
  {
    id: 'location',
    title: 'Location access',
    description: 'Allow location to track deliveries and assign nearby orders.',
    icon: 'location-outline',
  },
  {
    id: 'background',
    title: 'Background location',
    description: 'Keep tracking active even when the app is closed.',
    icon: 'navigate-outline',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Get new order alerts, payout updates, and shift reminders.',
    icon: 'notifications-outline',
  },
  {
    id: 'battery',
    title: 'Battery optimization',
    description: 'Disable battery saving so live tracking stays online.',
    icon: 'battery-half-outline',
  },
];

export default function PermissionsSetupScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Permissions Setup</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Enable all permissions to start taking deliveries.</Text>
      </LinearGradient>

      <View style={styles.content}>
        {permissions.map((permission) => (
          <View key={permission.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBadge}>
                <Icon name={permission.icon} size={20} color="#16A34A" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{permission.title}</Text>
                <Text style={styles.cardSub}>{permission.description}</Text>
              </View>
            </View>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Enable</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('RiderTabs')}>
          <Text style={styles.primaryText}>Continue</Text>
        </Pressable>
        <Text style={styles.footerNote}>
          You can change these permissions anytime in device settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#DCFCE7', marginTop: 10 },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { marginLeft: 12, flex: 1 },
  cardTitle: { fontWeight: '700', color: '#111827' },
  cardSub: { color: '#6B7280', marginTop: 4 },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ctaText: { color: '#16A34A', fontWeight: '700' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
  footerNote: { marginTop: 10, textAlign: 'center', color: '#6B7280', fontSize: 12 },
});

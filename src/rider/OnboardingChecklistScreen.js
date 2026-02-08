import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const checklist = [
  { id: 'profile', title: 'Complete profile', status: 'Done' },
  { id: 'kyc', title: 'KYC verification', status: 'Pending' },
  { id: 'bank', title: 'Add bank account', status: 'Done' },
  { id: 'permissions', title: 'Enable permissions', status: 'Pending' },
  { id: 'training', title: 'Safety training', status: 'Not started' },
];

export default function OnboardingChecklistScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Onboarding</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Finish setup to start receiving orders.</Text>
      </LinearGradient>

      <View style={styles.content}>
        {checklist.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBadge}>
                <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>Status: {item.status}</Text>
              </View>
            </View>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Open</Text>
            </Pressable>
          </View>
        ))}
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
});

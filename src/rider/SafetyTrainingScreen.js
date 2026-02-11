import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const modules = [
  { id: 'helmet', title: 'Helmet and road safety', duration: '8 min' },
  { id: 'fraud', title: 'Fraud and scam prevention', duration: '6 min' },
  { id: 'handover', title: 'Safe handover protocol', duration: '10 min' },
];

export default function SafetyTrainingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Safety Training</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Complete these modules before going live.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {modules.map((module) => (
          <View key={module.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{module.title}</Text>
              <Text style={styles.cardSub}>Estimated time: {module.duration}</Text>
            </View>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Start</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('RiderTabs')}>
          <Text style={styles.primaryText}>Done, Go to Dashboard</Text>
        </Pressable>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  cardInfo: { flex: 1, marginRight: 12 },
  cardTitle: { color: '#111827', fontWeight: '700' },
  cardSub: { color: '#6B7280', marginTop: 4 },
  cta: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ctaText: { color: '#16A34A', fontWeight: '700' },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});

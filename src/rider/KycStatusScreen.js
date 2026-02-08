import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const steps = [
  { id: 'aadhaar', title: 'Upload Aadhaar', status: 'Pending', type: 'Aadhaar' },
  { id: 'license', title: 'Driving License', status: 'Approved', type: 'Driving License' },
  { id: 'rc', title: 'Vehicle RC', status: 'Pending', type: 'Vehicle RC' },
  { id: 'selfie', title: 'Selfie Verification', status: 'Not started', type: 'Selfie' },
];

export default function KycStatusScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>KYC Verification</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Complete verification to go live.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusValue}>Pending</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>2 steps left</Text>
            </View>
          </View>
        </View>

        {steps.map((step) => (
          <View key={step.id} style={styles.stepCard}>
            <View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSub}>Status: {step.status}</Text>
            </View>
            <Pressable
              style={styles.stepBtn}
              onPress={() =>
                navigation.navigate(
                  step.id === 'selfie' ? 'KycSelfie' : 'KycDocumentUpload',
                  step.id === 'selfie' ? undefined : { type: step.type }
                )
              }
            >
              <Text style={styles.stepBtnText}>
                {step.id === 'selfie' ? 'Capture' : 'Upload'}
              </Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.helpCard} onPress={() => navigation.navigate('SupportCenter')}>
          <Icon name="help-circle-outline" size={20} color="#16A34A" />
          <Text style={styles.helpText}>Need help? Contact support for verification assistance.</Text>
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
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  statusLabel: { color: '#6B7280' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  statusValue: { fontSize: 18, fontWeight: '800', color: '#111827' },
  pendingBadge: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pendingText: { color: '#EA580C', fontWeight: '700', fontSize: 12 },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  stepTitle: { fontWeight: '700', color: '#111827' },
  stepSub: { color: '#6B7280', marginTop: 4 },
  stepBtn: { backgroundColor: '#16A34A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  stepBtnText: { color: '#fff', fontWeight: '700' },
  helpCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  helpText: { marginLeft: 10, color: '#166534', flex: 1 },
});

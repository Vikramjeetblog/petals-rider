import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function KycSelfieScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Selfie Verification</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Align your face within the frame.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.selfieFrame}>
          <Icon name="person-circle-outline" size={120} color="#9CA3AF" />
          <Text style={styles.frameText}>Camera preview</Text>
        </View>
        <Text style={styles.tip}>Make sure your face is well-lit and visible.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Capture Selfie</Text>
        </Pressable>
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
  content: { padding: 16, alignItems: 'center' },
  selfieFrame: {
    width: 220,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  frameText: { marginTop: 10, color: '#9CA3AF' },
  tip: { marginTop: 14, color: '#6B7280', textAlign: 'center' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});

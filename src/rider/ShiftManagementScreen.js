import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ShiftManagementScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Shift & Breaks</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Manage attendance and break time.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today’s Shift</Text>
          <Text style={styles.cardValue}>08:00 AM – 04:00 PM</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.status}>Active</Text>
            </View>
            <Pressable style={styles.primaryBtn}>
              <Text style={styles.primaryText}>End Shift</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Breaks</Text>
          <Text style={styles.subText}>You can take up to 2 breaks of 15 minutes.</Text>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Start Break</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Summary</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Hours worked</Text>
              <Text style={styles.statValue}>6h 15m</Text>
            </View>
            <View>
              <Text style={styles.label}>Break time</Text>
              <Text style={styles.statValue}>15m</Text>
            </View>
          </View>
        </View>
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
  headerSub: { color: '#DCFCE7', marginTop: 8 },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontWeight: '700', color: '#111827' },
  cardValue: { marginTop: 6, fontSize: 18, fontWeight: '800', color: '#16A34A' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  label: { color: '#6B7280', fontSize: 12 },
  status: { fontWeight: '700', color: '#16A34A', marginTop: 4 },
  subText: { color: '#6B7280', marginTop: 6 },
  primaryBtn: { backgroundColor: '#DC2626', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { marginTop: 12, backgroundColor: '#16A34A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  secondaryText: { color: '#fff', fontWeight: '700' },
  statValue: { marginTop: 6, fontWeight: '700', color: '#111827' },
});

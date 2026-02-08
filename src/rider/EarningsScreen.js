import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EarningsScreen({ navigation }) {
  // 🔥 mock data — replace with backend later
  const todayEarning = 540;
  const deliveries = 6;
  const weekly = 3240;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Card */}
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <Text style={styles.headerLabel}>Today Earnings</Text>
        <Text style={styles.headerAmount}>₹{todayEarning}</Text>
        <Text style={styles.headerSub}>{deliveries} deliveries completed</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Weekly Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="calendar" size={20} color="#16A34A" />
            <Text style={styles.cardTitle}>Weekly Earnings</Text>
          </View>

          <Text style={styles.cardValue}>₹{weekly}</Text>
        </View>

        {/* ✅ Payout Card (Click) */}
        <Pressable
          onPress={() => navigation.navigate('Payout')}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon name="cash-outline" size={20} color="#16A34A" />
              <Text style={styles.cardTitle}>Payouts</Text>
            </View>

            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </View>

          <Text style={styles.cardHint}>
            View payout history, pending payouts & withdrawals
          </Text>
        </Pressable>

        {/* Performance Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{deliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹90</Text>
            <Text style={styles.statLabel}>Avg per job</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerLabel: { color: '#ECFDF5', fontSize: 14 },

  headerAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginVertical: 6,
  },

  headerSub: { color: '#DCFCE7' },

  content: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: { marginLeft: 8, fontWeight: '700' },

  cardValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: '#16A34A',
  },

  cardHint: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 12,
  },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },

  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    elevation: 2,
    alignItems: 'center',
  },

  statValue: { fontSize: 22, fontWeight: '800', color: '#16A34A' },

  statLabel: { marginTop: 4, color: '#6B7280' },
});

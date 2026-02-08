import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderEnRouteScreen({ navigation, route }) {
  const order = route?.params?.order;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>En Route</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Order #{order?.id ?? '—'}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Status</Text>
          <Text style={styles.cardSub}>You’re on the way to the customer.</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>ETA</Text>
              <Text style={styles.value}>8 mins</Text>
            </View>
            <View>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>2.1 km</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer</Text>
          <Text style={styles.cardSub}>{order?.drop ?? 'Customer address'}</Text>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('IssueReport', { orderId: order?.id })}
          >
            <Text style={styles.secondaryText}>Call customer</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('OrderArrived', { order })}
        >
          <Text style={styles.primaryText}>Reached Customer</Text>
        </Pressable>
        <Pressable
          style={styles.ghostBtn}
          onPress={() => navigation.navigate('IssueReport')}
        >
          <Text style={styles.ghostText}>Report Issue</Text>
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
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontWeight: '700', color: '#111827' },
  cardSub: { color: '#6B7280', marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  label: { color: '#6B7280', fontSize: 12 },
  value: { marginTop: 6, fontWeight: '700', color: '#111827' },
  secondaryBtn: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: { color: '#16A34A', fontWeight: '700' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
  ghostBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  ghostText: { color: '#DC2626', fontWeight: '700' },
});

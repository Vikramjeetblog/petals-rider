import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const topics = [
  { id: 'payments', title: 'Payments & payouts' },
  { id: 'orders', title: 'Order issues' },
  { id: 'account', title: 'Account settings' },
  { id: 'safety', title: 'Safety & training' },
];

const routeByTopic = {
  payments: 'Payout',
  orders: 'IssueReport',
  account: 'EditProfile',
  safety: 'SafetyTraining',
};

export default function SupportCenterScreen({ navigation }) {
  const handleTopicOpen = (topicId) => {
    const target = routeByTopic[topicId] || 'IssueReport';
    navigation.navigate(target);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Find help fast or reach support.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick actions</Text>
          <View style={styles.rowBetween}>
            <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('IssueReport')}>
              <Icon name="warning-outline" size={18} color="#16A34A" />
              <Text style={styles.actionText}>Report issue</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('SafetyTraining')}>
              <Icon name="shield-checkmark-outline" size={18} color="#16A34A" />
              <Text style={styles.actionText}>Safety training</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular topics</Text>
        {topics.map((topic) => (
          <Pressable key={topic.id} style={styles.topicRow} onPress={() => handleTopicOpen(topic.id)}>
            <Text style={styles.topicText}>{topic.title}</Text>
            <Icon name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
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
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: { fontWeight: '700', color: '#111827', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionText: { marginTop: 6, color: '#166534', fontWeight: '700' },
  sectionTitle: { fontWeight: '700', color: '#111827', marginBottom: 10 },
  topicRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  topicText: { color: '#111827', fontWeight: '600' },
});

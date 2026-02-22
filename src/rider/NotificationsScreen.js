import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchNotifications, markNotificationRead } from '../services/riderApi';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    const data = await fetchNotifications();
    setNotifications(Array.isArray(data) ? data : data?.items || []);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBadge}><Icon name="notifications-outline" size={18} color="#16A34A" /></View>
        <View style={styles.textBlock}><Text style={styles.title}>{item.title}</Text><Text style={styles.time}>{item.time || item.createdAt}</Text></View>
      </View>
      <Pressable
        style={styles.cta}
        onPress={async () => {
          await markNotificationRead(item.id);
          navigation.navigate('NotificationDetail', { notification: item });
        }}
      >
        <Text style={styles.ctaText}>View</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}><View style={styles.headerRow}><Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}><Icon name="arrow-back" size={22} color="#fff" /></Pressable><Text style={styles.headerTitle}>Notifications</Text><View style={{ width: 36 }} /></View></LinearGradient>
      <FlatList data={notifications} keyExtractor={item => String(item.id)} renderItem={renderItem} contentContainerStyle={{ padding: 16 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F9FAFB' }, header: { padding: 16 }, headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' }, headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }, row: { flexDirection: 'row', alignItems: 'center' }, iconBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' }, textBlock: { marginLeft: 12, flex: 1 }, title: { fontWeight: '700', color: '#111827' }, time: { color: '#6B7280', marginTop: 4 }, cta: { alignSelf: 'flex-start', marginTop: 12, backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }, ctaText: { color: '#16A34A', fontWeight: '700' } });

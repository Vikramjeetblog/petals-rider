import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ActivityScreen() {

  // 🔥 mock history data — replace with API later
  const [history, setHistory] = useState([
    {
      id: '1023',
      customer: 'Sector 12',
      earning: 90,
      status: 'Delivered',
      time: 'Today • 3:20 PM',
    },
    {
      id: '1018',
      customer: 'Green Park',
      earning: 120,
      status: 'Delivered',
      time: 'Yesterday • 6:10 PM',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.row}>
        <Text style={styles.orderId}>
          #{item.id}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.location}>
        {item.customer}
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.time}>
          {item.time}
        </Text>

        <Text style={styles.earning}>
          ₹{item.earning}
        </Text>
      </View>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {history.length === 0 ? (

        <View style={styles.empty}>

          <Icon
            name="list-outline"
            size={70}
            color="#9CA3AF"
          />

          <Text style={styles.emptyTitle}>
            No Delivery History
          </Text>

          <Text style={styles.emptySub}>
            Completed deliveries will appear here.
          </Text>

        </View>

      ) : (

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  orderId: {
    fontWeight: '700',
  },

  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 12,
  },

  location: {
    marginTop: 6,
    color: '#374151',
  },

  time: {
    color: '#6B7280',
    fontSize: 12,
  },

  earning: {
    color: '#16A34A',
    fontWeight: '700',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },

  emptySub: {
    marginTop: 4,
    color: '#6B7280',
    textAlign: 'center',
  },

});

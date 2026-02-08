import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BankAccountScreen({ navigation }) {
  const [accounts, setAccounts] = useState([
    {
      id: 'acc-1',
      holderName: 'Rahul Kumar',
      bankName: 'HDFC Bank',
      accountLast4: '2317',
      ifsc: 'HDFC0001234',
      isPrimary: true,
    },
    {
      id: 'acc-2',
      holderName: 'Rahul Kumar',
      bankName: 'ICICI Bank',
      accountLast4: '9081',
      ifsc: 'ICIC0009876',
      isPrimary: false,
    },
  ]);

  const primaryAccount = useMemo(
    () => accounts.find(account => account.isPrimary),
    [accounts]
  );

  const setPrimary = (accountId) => {
    setAccounts(prev =>
      prev.map(account => ({
        ...account,
        isPrimary: account.id === accountId,
      }))
    );
  };

  const confirmRemove = (accountId) => {
    Alert.alert(
      'Remove bank account?',
      'This account will be removed from payouts.',
      [
        { text: 'Cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            setAccounts(prev =>
              prev.filter(account => account.id !== accountId)
            ),
        },
      ]
    );
  };

  const renderAccount = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountText}>
            {item.holderName} • •••• {item.accountLast4}
          </Text>
          <Text style={styles.ifsc}>IFSC: {item.ifsc}</Text>
        </View>
        {item.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() =>
            navigation.navigate('AddBankAccount', {
              mode: 'edit',
              account: item,
            })
          }
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Icon name="create-outline" size={16} color="#16A34A" />
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>

        {!item.isPrimary && (
          <Pressable
            onPress={() => setPrimary(item.id)}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Icon name="star-outline" size={16} color="#16A34A" />
            <Text style={styles.actionText}>Set primary</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => confirmRemove(item.id)}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Icon name="trash-outline" size={16} color="#DC2626" />
          <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Bank Accounts</Text>

          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={accounts}
        keyExtractor={item => item.id}
        renderItem={renderAccount}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <View style={styles.summaryCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.summaryLabel}>Primary account</Text>
                <Text style={styles.summaryValue}>
                  {primaryAccount
                    ? `${primaryAccount.bankName} •••• ${primaryAccount.accountLast4}`
                    : 'Not set'}
                </Text>
              </View>
              <Icon name="card-outline" size={24} color="#16A34A" />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Icon name="card-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No bank account yet</Text>
            <Text style={styles.emptySub}>
              Add a bank account to receive payouts.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('AddBankAccount', { mode: 'add' })}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.primaryBtnText}>Add bank account</Text>
            </Pressable>
          </View>
        )}
      />

      {accounts.length > 0 && (
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.navigate('AddBankAccount', { mode: 'add' })}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>Add another account</Text>
          </Pressable>
        </View>
      )}

    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  header: {
    padding: 14,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  summaryLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bankName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  accountText: {
    marginTop: 4,
    color: '#374151',
  },

  ifsc: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },

  primaryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  primaryText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 12,
  },

  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  actionText: {
    marginLeft: 6,
    color: '#374151',
    fontWeight: '600',
  },

  removeText: {
    color: '#DC2626',
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  empty: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  emptySub: {
    marginTop: 6,
    textAlign: 'center',
    color: '#6B7280',
  },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

});

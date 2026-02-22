import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBankAccount } from '../services/riderApi';

export default function AddBankAccountScreen({ navigation, route }) {
  const mode = route?.params?.mode || 'add';
  const initial = route?.params?.account || null;

  const [holderName, setHolderName] = useState(initial?.holderName || '');
  const [bankName, setBankName] = useState(initial?.bankName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState(initial?.ifsc || '');

  const canSave = useMemo(() => {
    return holderName.trim() && bankName.trim() && ifsc.trim() && (mode === 'edit' ? true : accountNumber.trim());
  }, [holderName, bankName, ifsc, accountNumber, mode]);

  const save = async () => {
    if (!canSave) {
      Alert.alert('Missing details', 'Please fill all required fields.');
      return;
    }

    await createBankAccount({
      holderName: holderName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim() || initial?.accountNumber,
      ifsc: ifsc.trim(),
    });

    Alert.alert('Saved!', mode === 'edit' ? 'Account updated.' : 'Account added.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>{mode === 'edit' ? 'Edit bank account' : 'Add bank account'}</Text>

          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Account holder name *</Text>
          <TextInput
            value={holderName}
            onChangeText={setHolderName}
            placeholder="Enter full name"
            style={styles.input}
          />

          <Text style={styles.label}>Bank name *</Text>
          <TextInput
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g., HDFC Bank"
            style={styles.input}
          />

          {mode !== 'edit' && (
            <>
              <Text style={styles.label}>Account number *</Text>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                keyboardType="number-pad"
                style={styles.input}
              />
              <Text style={styles.hint}>We recommend masking this after save.</Text>
            </>
          )}

          <Text style={styles.label}>IFSC *</Text>
          <TextInput
            value={ifsc}
            onChangeText={setIfsc}
            placeholder="e.g., HDFC0001234"
            autoCapitalize="characters"
            style={styles.input}
          />

          <Pressable
            onPress={save}
            disabled={!canSave}
            style={({ pressed }) => [
              styles.saveBtn,
              (!canSave || pressed) && { opacity: !canSave ? 0.5 : 0.85 },
            ]}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>

          <Text style={styles.small}>
            By saving, you confirm these details are correct. Wrong details can delay payouts.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: { padding: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2 },

  label: { color: '#6B7280', fontSize: 12, marginTop: 10 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hint: { color: '#6B7280', fontSize: 12, marginTop: 6 },

  saveBtn: {
    marginTop: 16,
    backgroundColor: '#16A34A',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800' },

  small: { marginTop: 12, color: '#6B7280', fontSize: 12 },
});

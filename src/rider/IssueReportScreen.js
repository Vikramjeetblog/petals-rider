import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { createSupportIssue } from '../services/riderApi';

const issues = [
  'Customer unreachable',
  'Wrong address',
  'Items damaged',
  'Store closed',
  'Payment issue',
];

export default function IssueReportScreen({ navigation }) {
  const [selected, setSelected] = useState(issues[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createSupportIssue({ issueType: selected, notes });

      Alert.alert('Issue submitted', `Support has received: ${selected}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Help us resolve issues faster.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select issue type</Text>
        {issues.map((issue) => (
          <Pressable
            key={issue}
            onPress={() => setSelected(issue)}
            style={({ pressed }) => [
              styles.issueRow,
              selected === issue && styles.issueRowActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.issueText}>{issue}</Text>
            {selected === issue && <Icon name="checkmark-circle" size={18} color="#16A34A" />}
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Additional notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add details to help support..."
          multiline
          style={styles.textArea}
        />
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]} onPress={handleSubmit}>
          <Text style={styles.primaryText}>{isSubmitting ? 'Submitting...' : 'Submit Issue'}</Text>
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
  sectionTitle: { fontWeight: '700', marginBottom: 10, marginTop: 12, color: '#111827' },
  issueRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  issueRowActive: { borderColor: '#16A34A', backgroundColor: '#ECFDF5' },
  issueText: { color: '#111827', fontWeight: '600' },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryText: { color: '#fff', fontWeight: '800' },
  pressed: { opacity: 0.85 },
});

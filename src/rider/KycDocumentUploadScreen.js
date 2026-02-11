import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function KycDocumentUploadScreen({ navigation, route }) {
  const documentType = route?.params?.type ?? 'Document';
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleChooseFile = () => {
    setIsFileSelected(true);
    Alert.alert('File selected', `${documentType} file ready to upload.`);
  };

  const handleSubmit = () => {
    if (!isFileSelected) {
      Alert.alert('Missing file', `Please choose your ${documentType} first.`);
      return;
    }

    Alert.alert('Submitted', `${documentType} sent for KYC review.`, [
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
          <Text style={styles.headerTitle}>{documentType} Upload</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Clear photos help faster approvals.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Icon name="document-text-outline" size={32} color="#16A34A" />
          <Text style={styles.cardTitle}>Upload {documentType}</Text>
          <Text style={styles.cardSub}>Make sure the document details are readable.</Text>
          <Pressable style={[styles.secondaryBtn, isFileSelected && styles.secondaryBtnSelected]} onPress={handleChooseFile}>
            <Text style={[styles.secondaryText, isFileSelected && styles.secondaryTextSelected]}>
              {isFileSelected ? 'File Selected' : 'Choose file'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guidelines</Text>
          <Text style={styles.cardSub}>• All corners visible</Text>
          <Text style={styles.cardSub}>• No glare or blur</Text>
          <Text style={styles.cardSub}>• Match registered name</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
          <Text style={styles.primaryText}>Submit for review</Text>
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
    alignItems: 'center',
  },
  cardTitle: { marginTop: 12, fontWeight: '700', color: '#111827' },
  cardSub: { marginTop: 6, color: '#6B7280', textAlign: 'center' },
  secondaryBtn: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondaryBtnSelected: { backgroundColor: '#16A34A' },
  secondaryText: { color: '#16A34A', fontWeight: '700' },
  secondaryTextSelected: { color: '#fff' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});

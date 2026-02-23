import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { ORDER_STATUS } from '../constants/orderStatus';
import useDeliveryProofUpload from '../hooks/useDeliveryProofUpload';

export default function DeliveryProofScreen({ route, navigation }) {
  const order = route?.params?.order;
  const inputRef = useRef(null);

  const [otp, setOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const {
    selectedImage,
    uploadProgress,
    uploading,
    uploadComplete,
    isOffline,
    canUpload,
    selectFromCamera,
    selectFromGallery,
    startUpload,
    cancelUpload,
  } = useDeliveryProofUpload(order);

  const isValidOtp = otp.length === 4;

  const canConfirm = useMemo(() => {
    if (isOffline || actionLoading) return false;
    return isValidOtp && uploadComplete;
  }, [isOffline, actionLoading, isValidOtp, uploadComplete]);

  const handleComplete = async () => {
    Keyboard.dismiss();

    if (!canConfirm) {
      Alert.alert('Requirements missing', 'Upload proof and enter valid OTP before completing delivery.');
      return;
    }

    if (__DEV__ && otp !== '1234') {
      Alert.alert('Invalid OTP', 'Use 1234');
      return;
    }

    try {
      setActionLoading(true);
      await new Promise((res) => setTimeout(res, 700));
      Alert.alert('Delivery Completed ✅', 'Order marked as delivered.');
      navigation.replace('DeliverySummary', { order: { ...order, status: ORDER_STATUS.DELIVERED } });
    } catch {
      Alert.alert('Error', 'Delivery verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
          <Icon name="shield-checkmark" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Delivery Verification</Text>
          <Text style={styles.headerSub}>Order #{order?.id ?? '—'}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Icon name="camera-outline" size={42} color="#16A34A" style={styles.sectionIcon} />
          <Text style={styles.title}>Delivery Proof (Mandatory)</Text>

          <View style={styles.selectRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={selectFromCamera} disabled={uploading}>
              <Text style={styles.secondaryBtnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={selectFromGallery} disabled={uploading}>
              <Text style={styles.secondaryBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage?.uri ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.previewPlaceholderText}>No image selected</Text>
            </View>
          )}

          {uploading || uploadComplete ? (
            <View style={styles.progressWrap}>
              <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            </View>
          ) : null}

          <View style={styles.selectRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={startUpload} disabled={!canUpload}>
              <Text style={styles.actionText}>{uploading ? 'Uploading...' : uploadComplete ? 'Re-upload' : 'Upload proof'}</Text>
            </TouchableOpacity>
            {uploading ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelUpload}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.cancelBtn} onPress={startUpload} disabled={!selectedImage || uploadComplete || isOffline}>
                <Text style={styles.actionText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>

          <Icon name="key-outline" size={50} color="#16A34A" style={styles.sectionIcon} />
          <Text style={styles.title}>Enter Customer OTP</Text>
          <Text style={styles.subtitle}>Ask customer for delivery code</Text>

          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.otpInput}
            placeholder="• • • •"
            autoFocus
          />

          <Text style={styles.hint}>Dev OTP: 1234</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryBtn, !canConfirm && styles.disabledBtn]}
            disabled={!canConfirm || uploading || actionLoading}
            onPress={handleComplete}
          >
            {actionLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.actionText}>Confirm Delivery</Text>
                <Icon name="checkmark-circle" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingVertical: 30, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 6 },
  headerSub: { color: '#DCFCE7', marginTop: 4 },
  content: { flex: 1, alignItems: 'center', padding: 20 },
  sectionIcon: { marginBottom: 12, marginTop: 4 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#6B7280', marginBottom: 10 },
  selectRow: { flexDirection: 'row', width: '100%', marginTop: 12 },
  preview: { width: '100%', height: 180, borderRadius: 16, marginTop: 12 },
  previewPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  previewPlaceholderText: { color: '#6B7280' },
  progressWrap: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#16A34A',
  },
  otpInput: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 16,
    marginTop: 10,
  },
  hint: { marginTop: 8, fontSize: 12, color: '#9CA3AF' },
  actions: { padding: 14, backgroundColor: '#fff' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  secondaryBtn: {
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  secondaryBtnText: { color: '#16A34A', fontWeight: '700' },
  cancelBtn: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    minWidth: 94,
  },
  disabledBtn: { backgroundColor: '#D1D5DB' },
  actionText: { color: '#fff', fontWeight: '700', marginRight: 6 },
});

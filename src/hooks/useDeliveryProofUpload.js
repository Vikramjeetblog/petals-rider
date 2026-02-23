import { useMemo, useRef, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { canTransitionOrderStatus, normalizeOrderStatus, ORDER_STATUS } from '../constants/orderStatus';
import { uploadDeliveryProof } from '../services/riderApi';
import { useAppStore } from '../store/AppStore';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function requestCameraPermission() {
  if (Platform.OS !== 'android') return true;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

async function requestGalleryPermission() {
  if (Platform.OS !== 'android') return true;

  const sdk = Number(Platform.Version);
  const permission =
    sdk >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export default function useDeliveryProofUpload(order) {
  const abortRef = useRef(null);
  const { state, dispatch } = useAppStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const isOffline = state.network.isOffline;

  const validateAsset = (asset) => {
    if (!asset?.type?.startsWith('image/')) {
      Alert.alert('Invalid file', 'Only image files are allowed.');
      return false;
    }

    if ((asset?.fileSize || 0) > MAX_FILE_SIZE) {
      Alert.alert('File too large', 'Please use an image under 5MB.');
      return false;
    }

    return true;
  };

  const setNewAsset = (asset) => {
    setSelectedImage(asset);
    setUploadComplete(false);
    setUploadProgress(0);
  };

  const selectFromCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Camera permission is required.');
      return;
    }

    const res = await launchCamera({ mediaType: 'photo', quality: 0.9 });
    const asset = res?.assets?.[0];
    if (res?.didCancel || !asset || !validateAsset(asset)) return;
    setNewAsset(asset);
  };

  const selectFromGallery = async () => {
    const granted = await requestGalleryPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Media library permission is required.');
      return;
    }

    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.9 });
    const asset = res?.assets?.[0];
    if (res?.didCancel || !asset || !validateAsset(asset)) return;
    setNewAsset(asset);
  };

  const cancelUpload = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    dispatch({ type: 'SHOW_TOAST', payload: 'Upload canceled.' });
  };

  const startUpload = async () => {
    if (isOffline) {
      Alert.alert('Offline', 'Connect to internet to upload proof.');
      return false;
    }

    if (!selectedImage?.uri) {
      Alert.alert('Proof required', 'Please capture or select delivery proof image first.');
      return false;
    }

    if (uploading) {
      return false;
    }

    const status = normalizeOrderStatus(order?.status);
    if (!canTransitionOrderStatus(status, ORDER_STATUS.DELIVERED)) {
      Alert.alert('Invalid state', 'This order is not ready for delivery completion.');
      return false;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const controller = new AbortController();
      abortRef.current = controller;

      const formData = new FormData();
      formData.append('proof', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName || `proof-${Date.now()}.jpg`,
      });

      await uploadDeliveryProof(order.id, formData, {
        signal: controller.signal,
        onUploadProgress: (event) => {
          if (!event?.total) return;
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        },
      });

      setUploadProgress(100);
      setUploadComplete(true);
      dispatch({ type: 'SHOW_TOAST', payload: 'Proof uploaded successfully.' });
      return true;
    } catch (error) {
      if (error?.name !== 'CanceledError' && error?.name !== 'AbortError') {
        setUploadComplete(false);
        Alert.alert('Upload failed', 'Could not upload proof. Please retry.');
      }
      return false;
    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  };

  const canUpload = useMemo(() => !isOffline && !!selectedImage && !uploading, [isOffline, selectedImage, uploading]);

  return {
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
  };
}

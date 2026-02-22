import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchRiderProfile, fetchSensitiveInfo, updateRiderProfile, updateSensitiveInfo } from '../services/riderApi';

export default function EditRiderProfileScreen({ navigation }) {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    name.trim().length > 2 &&
    vehicle.trim().length > 3;

  useEffect(() => {
    const hydrate = async () => {
      const [profile, sensitive] = await Promise.all([fetchRiderProfile(), fetchSensitiveInfo()]);
      setName(profile?.name || '');
      setVehicle(profile?.vehicle || profile?.vehicleNumber || '');
      setPhone(sensitive?.phone || profile?.phone || '');
    };

    hydrate();
  }, []);

  const handleSave = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      await Promise.all([
        updateRiderProfile({ name, vehicle }),
        updateSensitiveInfo({ phone }),
      ]);

      Alert.alert('Success', 'Profile updated');

      navigation.goBack();

    } catch {
      Alert.alert('Error', 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <Icon name="create" size={40} color="#fff" />
        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter name"
        />

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          editable
          style={[styles.input, styles.disabled]}
        />

        {/* Vehicle */}
        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput
          value={vehicle}
          onChangeText={setVehicle}
          style={styles.input}
          placeholder="Enter vehicle"
        />

      </ScrollView>

      {/* Save Button */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            !isValid && styles.disabledBtn,
          ]}
          disabled={!isValid || loading}
          onPress={handleSave}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.saveText}>
                Save Changes
              </Text>
              <Icon
                name="checkmark"
                size={18}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  header: {
    paddingVertical: 30,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },

  content: {
    padding: 20,
  },

  label: {
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 50,
  },

  disabled: {
    backgroundColor: '#F3F4F6',
  },

  actions: {
    padding: 16,
    backgroundColor: '#fff',
  },

  saveBtn: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    marginRight: 6,
  },

});

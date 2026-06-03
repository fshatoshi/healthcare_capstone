import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GreenCard } from '../../components/common/GreenCard';
import { GoldButton } from '../../components/common/Buttons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface DoctorProfileScreenProps {
  navigation: any;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { firstName, lastName } = useAppSelector(s => s.auth);
  const initials = `${(firstName)[0] || 'F'}${(lastName)[0] || 'E'}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>Dr. {firstName} {lastName}</Text>
          <Text style={styles.role}>General Practitioner</Text>
          <Text style={styles.hospital}>CHU Ibn Sina, Rabat</Text>
        </View>
        <SectionHeader title="Practice Info" />
        <GreenCard>
          {[
            { label: 'License #', value: 'MED-2018-045621' },
            { label: 'Specialty', value: 'General Practitioner' },
            { label: 'Hospital', value: 'CHU Ibn Sina, Rabat' },
            { label: 'Active Patients', value: '134' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.border]}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </GreenCard>
        <SectionHeader title="Settings" style={{ marginTop: 24 }} />
        <GreenCard>
          {['Notification preferences', 'Patient alerts', 'Language', 'Privacy policy'].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingRow, i > 0 && styles.border]} activeOpacity={0.7}>
              <Text style={styles.settingText}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </GreenCard>
        <GoldButton title="Sign Out" onPress={() => dispatch(logout())} style={styles.signOut} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', marginBottom: 28, gap: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.greenLight + '33', borderWidth: 2, borderColor: colors.greenLight + '77',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  avatarText: { color: colors.greenLight, fontSize: 26, fontFamily: 'Inter_700Bold' },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.bodySmall, color: colors.gold },
  hospital: { ...typography.bodySmall, color: colors.textMuted },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  border: { borderTopWidth: 1, borderTopColor: '#1A9B6C1A' },
  infoLabel: { ...typography.bodySmall, color: colors.textMuted },
  infoValue: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  settingText: { ...typography.body, color: colors.textPrimary },
  signOut: {
    marginTop: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
  },
});

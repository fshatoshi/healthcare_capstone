import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';
import { GreenCard } from '../../components/common/GreenCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GoldButton } from '../../components/common/Buttons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface AdminSettingsScreenProps {
  navigation: any;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = () => {
  const dispatch = useAppDispatch();
  const { firstName, lastName } = useAppSelector(s => s.auth);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Admin Account" />
        <GreenCard>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{firstName} {lastName}</Text>
          </View>
          <View style={[styles.infoRow, styles.border]}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={[styles.infoValue, { color: colors.gold }]}>ADMIN</Text>
          </View>
          <View style={[styles.infoRow, styles.border]}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>admin@healthtrack.ma</Text>
          </View>
        </GreenCard>

        <SectionHeader title="Platform" style={{ marginTop: 24 }} />
        <GreenCard>
          {['Backup & Recovery', 'Data Retention Policy', 'Audit Logs', 'API Keys', 'Security Settings'].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingRow, i > 0 && styles.border]}>
              <Text style={styles.settingText}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </GreenCard>

        <SectionHeader title="System" style={{ marginTop: 24 }} />
        <GreenCard>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>2.0.0 (Build 47)</Text>
          </View>
          <View style={[styles.infoRow, styles.border]}>
            <Text style={styles.infoLabel}>API Environment</Text>
            <Text style={[styles.infoValue, { color: colors.success }]}>Production</Text>
          </View>
          <View style={[styles.infoRow, styles.border]}>
            <Text style={styles.infoLabel}>Last Backup</Text>
            <Text style={styles.infoValue}>2025-04-22 02:00 UTC</Text>
          </View>
        </GreenCard>

        <GoldButton
          title="Sign Out"
          onPress={() => dispatch(logout())}
          style={{ marginTop: 32, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  title: { ...typography.h3, color: colors.textPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  border: { borderTopWidth: 1, borderTopColor: '#1A9B6C1A' },
  infoLabel: { ...typography.bodySmall, color: colors.textMuted },
  infoValue: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium', fontSize: 13 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  settingText: { ...typography.body, color: colors.textPrimary },
});

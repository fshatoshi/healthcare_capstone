import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PatientRow } from '../../components/common/PatientRow';
import { RiskBadge } from '../../components/common/RiskBadge';
import { mockDoctor, mockDoctorAlerts } from '../../utils/mockData';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchDoctorPatients, fetchPatientRecordsForDoctor } from '../../store/slices/healthSlice';
import type { RiskLevel } from '../../types/api.types';

interface DoctorHomeScreenProps {
  navigation: any;
}

export const DoctorHomeScreen: React.FC<DoctorHomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const { lastName } = useAppSelector(s => s.auth);
  const patients = useAppSelector((s) => s.health.doctorPatients);
  const patientRecordsById = useAppSelector((s) => s.health.patientRecordsById);

  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);

  useEffect(() => {
    patients.slice(0, 15).forEach((p) => {
      if (!patientRecordsById[p.id]) {
        dispatch(fetchPatientRecordsForDoctor(p.id));
      }
    });
  }, [dispatch, patients, patientRecordsById]);

  const riskFromPatient = (patientId: string): RiskLevel => {
    const latestVitals = (patientRecordsById[patientId] || []).find((r) => r.type === 'VITALS');
    const hr = latestVitals?.heartRate || 0;
    const glucose = latestVitals?.bloodGlucose || 0;
    if (hr >= 120 || glucose >= 200) return 'CRITICAL';
    if (hr >= 110 || glucose >= 160) return 'HIGH';
    if (hr >= 100 || glucose >= 140) return 'MODERATE';
    return 'LOW';
  };

  const filtered = useMemo(() => (
    patients.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
    )
  ), [patients, search]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Dr. {lastName || mockDoctor.lastName}</Text>
            <Text style={styles.specialty}>{mockDoctor.specialty}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.gold} />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        {/* Alert queue */}
        <SectionHeader title="Urgent Alerts" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertScroll}>
          {mockDoctorAlerts.map(alert => (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertCard,
                alert.riskLevel === 'CRITICAL' && styles.alertCardCritical,
              ]}
              activeOpacity={0.85}
            >
              <RiskBadge level={alert.riskLevel} size="sm" />
              <Text style={styles.alertName}>{alert.patientName}</Text>
              <Text style={styles.alertAge}>Age {alert.age}</Text>
              <Text style={styles.alertType}>{alert.alertType}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Patient list */}
        <SectionHeader title="My Patients" style={{ marginTop: 20 }} />

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filtered.map(patient => (
          <PatientRow
            key={patient.id}
            name={`${patient.firstName} ${patient.lastName}`}
            riskLevel={riskFromPatient(patient.id)}
            lastSeen={patient.email}
            onPress={() => navigation.navigate('PatientFile', { patient })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20,
  },
  name: { ...typography.h3, color: colors.textPrimary },
  specialty: { ...typography.bodySmall, color: colors.textMuted, marginTop: 3 },
  bellBtn: { position: 'relative', padding: 6 },
  badge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: colors.danger, width: 17, height: 17, borderRadius: 8.5,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: colors.textPrimary, fontSize: 9, fontFamily: 'Inter_700Bold' },
  alertScroll: { marginBottom: 4 },
  alertCard: {
    width: 160, marginRight: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: '#1A9B6C22',
    gap: 6,
  },
  alertCardCritical: {
    borderColor: colors.riskCritical + '88',
    shadowColor: colors.riskCritical,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  alertName: { ...typography.bodyLarge, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  alertAge: { ...typography.bodySmall, color: colors.textMuted },
  alertType: { ...typography.bodySmall, color: colors.warning, fontFamily: 'Inter_500Medium' },
  alertTime: { ...typography.bodyXSmall, color: colors.textMuted },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: '#1A9B6C22',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1, color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14,
  },
});

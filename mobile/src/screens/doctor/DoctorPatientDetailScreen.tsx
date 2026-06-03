import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPatientRecordsForDoctor } from '../../store/slices/healthSlice';
import { RecordRow } from '../../components/common/RecordRow';

export const DoctorPatientDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { patientId, patientName } = route.params;
  const dispatch = useAppDispatch();
  const records = useAppSelector((state) => state.health.patientRecordsById[patientId] || []);
  const loading = useAppSelector((state) => state.health.loading);

  useEffect(() => {
    dispatch(fetchPatientRecordsForDoctor(patientId));
  }, [patientId]);

  const formatValue = (rec: any) => {
    if (rec.type === 'VITALS') return `HR ${rec.heartRate} bpm • BP ${rec.bloodPressure}`;
    if (rec.type === 'ACTIVITY') return `${rec.steps?.toLocaleString()} steps`;
    if (rec.type === 'SLEEP') return `${rec.sleepDuration}h sleep`;
    return 'Medical Record';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{patientName}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Latest HR</Text>
            <Text style={styles.statValue}>{records.find(r => r.type === 'VITALS')?.heartRate || '--'} bpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Steps</Text>
            <Text style={styles.statValue}>6.4k</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Medical Records</Text>
        {records.length > 0 ? (
          records.map(record => (
            <RecordRow
              key={record.id}
              type={record.type}
              value={formatValue(record)}
              time={new Date(record.timestamp).toLocaleDateString()}
              source={record.source}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No records available for this patient.</Text>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Clinical Notes</Text>
        <TouchableOpacity style={styles.addNoteBtn}>
          <Ionicons name="add-circle-outline" size={20} color={colors.gold} />
          <Text style={styles.addNoteText}>Add Clinical Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1A9B6C22'
  },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  scroll: { padding: 20, paddingBottom: 60 },
  statRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 16, borderWidth: 1, borderColor: '#1A9B6C11'
  },
  statLabel: { ...typography.labelSmall, color: colors.textMuted, marginBottom: 4 },
  statValue: { ...typography.h4, color: colors.gold },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 16 },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
  addNoteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed',
    borderColor: colors.gold, marginTop: 8
  },
  addNoteText: { color: colors.gold, fontFamily: 'Inter_600SemiBold' }
});

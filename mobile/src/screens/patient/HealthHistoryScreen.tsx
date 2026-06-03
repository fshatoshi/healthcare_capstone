import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { RecordRow } from '../../components/common/RecordRow';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHealthRecords } from '../../store/slices/healthSlice';

interface HealthHistoryScreenProps {
  navigation: any;
}

const FILTERS = ['All', 'Vitals', 'Activity', 'Sleep', 'EHR'];

export const HealthHistoryScreen: React.FC<HealthHistoryScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { metrics } = useAppSelector((state) => state.health);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchHealthRecords());
  }, [dispatch]);

  const filtered = useMemo(() => (
    activeFilter === 'All'
      ? metrics
      : metrics.filter((r) => r.type === activeFilter.toUpperCase())
  ), [activeFilter, metrics]);

  const formatValue = (rec: any) => {
    if (rec.type === 'VITALS') return `HR ${rec.heartRate} bpm • BP ${rec.bloodPressure}`;
    if (rec.type === 'ACTIVITY') return `${rec.steps?.toLocaleString() || 0} steps • ${rec.activeMinutes || 0} min active`;
    if (rec.type === 'SLEEP') return `${rec.sleepDuration || 0}h sleep • Quality ${rec.sleepQuality || 0}/5`;
    if (rec.type === 'EHR') return rec.description || 'EHR Document';
    return rec.value || '—';
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('ManualEntry')} style={styles.headerIconBtn}>
            <Ionicons name="add-outline" size={18} color={colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DocumentUpload')} style={styles.headerIconBtn}>
            <Ionicons name="cloud-upload-outline" size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter bar */}
      <View style={styles.filterScroll}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No records found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecordRow
            type={item.type}
            value={formatValue(item)}
            time={formatTime(item.timestamp)}
            source={item.source as any}
          />
        )}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={styles.dateLabel}>{formatDate(filtered[0].timestamp)}</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  backBtn: { width: 40 },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1A9B6C33',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
  },
  filterScroll: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C1A',
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1, borderColor: '#1A9B6C33',
    backgroundColor: 'transparent',
  },
  filterChipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterText: { ...typography.bodySmall, color: colors.textMuted },
  filterTextActive: { color: colors.textDark, fontFamily: 'Inter_600SemiBold' },
  list: { padding: 16, paddingBottom: 140 },
  dateLabel: {
    ...typography.labelSmall, color: colors.textMuted,
    marginBottom: 12, letterSpacing: 0.5,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { ...typography.body, color: colors.textMuted },
});

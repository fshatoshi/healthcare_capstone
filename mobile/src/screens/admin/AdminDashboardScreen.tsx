import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GreenCard } from '../../components/common/GreenCard';
import { mockAdminStats, mockActivityFeed } from '../../utils/mockData';

interface AdminDashboardScreenProps {
  navigation: any;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color = colors.gold }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Mini bar chart component
const BarChart: React.FC<{ data: number[]; color?: string }> = ({ data, color = colors.gold }) => {
  const max = Math.max(...data);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <View style={styles.chart}>
      {data.map((val, i) => (
        <View key={i} style={styles.barWrapper}>
          <View style={[styles.bar, {
            height: Math.max(4, (val / max) * 80),
            backgroundColor: i === data.length - 1 ? color : color + '66',
          }]} />
          <Text style={styles.barLabel}>{days[i]}</Text>
        </View>
      ))}
    </View>
  );
};

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Platform Overview</Text>
        </View>

        {/* Stats grid */}
        <SectionHeader title="Platform Stats" />
        <View style={styles.statsGrid}>
          <StatCard icon="people-outline" value={mockAdminStats.totalUsers.toLocaleString()} label="Total Users" />
          <StatCard icon="person-outline" value={mockAdminStats.activePatients.toLocaleString()} label="Active Patients" color={colors.greenLight} />
          <StatCard icon="medkit-outline" value={mockAdminStats.registeredDoctors.toLocaleString()} label="Doctors" color={colors.info} />
          <StatCard icon="analytics-outline" value={String(mockAdminStats.analysesToday)} label="AI Today" color={colors.warning} />
        </View>

        {/* User growth chart */}
        <SectionHeader title="User Growth (Last 7 Days)" style={{ marginTop: 20 }} />
        <GreenCard>
          <BarChart data={mockAdminStats.userGrowth} color={colors.gold} />
          <View style={styles.chartLegend}>
            <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
            <Text style={styles.legendText}>New registrations per day</Text>
          </View>
        </GreenCard>

        {/* Analysis by type */}
        <SectionHeader title="AI Analysis by Type" style={{ marginTop: 20 }} />
        <GreenCard>
          {mockAdminStats.analysisByType.map((item, i) => {
            const max = Math.max(...mockAdminStats.analysisByType.map(a => a.count));
            const pct = (item.count / max) * 100;
            return (
              <View key={i} style={[styles.hBarRow, i > 0 && styles.hBarBorder]}>
                <Text style={styles.hBarLabel}>{item.type}</Text>
                <View style={styles.hBarTrack}>
                  <View style={[styles.hBarFill, { width: `${pct}%` as any }]} />
                </View>
                <Text style={styles.hBarVal}>{item.count}</Text>
              </View>
            );
          })}
        </GreenCard>

        {/* Activity feed */}
        <SectionHeader title="Recent Activity" style={{ marginTop: 20 }} />
        {mockActivityFeed.map(item => (
          <View key={item.id} style={styles.feedRow}>
            <View style={styles.feedIcon}>
              <Ionicons name={item.icon as any} size={18} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.feedMessage}>{item.message}</Text>
              <Text style={styles.feedTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  header: { marginBottom: 20 },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  statCard: {
    width: '47%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: '#1A9B6C22',
    gap: 8,
  },
  statIcon: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  statValue: { ...typography.metric, fontSize: 24 },
  statLabel: { ...typography.bodySmall, color: colors.textMuted },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 90, paddingBottom: 24 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '100%', borderRadius: 3, minHeight: 4 },
  barLabel: { ...typography.bodyXSmall, color: colors.textMuted, fontSize: 10 },
  chartLegend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.bodyXSmall, color: colors.textMuted },
  hBarRow: { paddingVertical: 10 },
  hBarBorder: { borderTopWidth: 1, borderTopColor: '#1A9B6C1A' },
  hBarLabel: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 8 },
  hBarTrack: { height: 6, backgroundColor: colors.bgPrimary, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  hBarFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  hBarVal: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  feedRow: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: colors.bgCard, borderRadius: radius.sm,
    padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  feedIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.gold + '1A', justifyContent: 'center', alignItems: 'center',
  },
  feedMessage: { ...typography.bodySmall, color: colors.textPrimary, lineHeight: 20, marginBottom: 2 },
  feedTime: { ...typography.bodyXSmall, color: colors.textMuted },
});
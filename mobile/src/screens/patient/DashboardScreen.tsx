import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { HealthMetricCard } from '../../components/common/HealthMetricCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { GreenCard } from '../../components/common/GreenCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import {
  mockRecommendations,
} from '../../utils/mockData';
import { fetchHealthRecords } from '../../store/slices/healthSlice';
import { fetchAiHistory } from '../../store/slices/aiSlice';
import { CardioRiskModal, CardioRiskInitial } from '../../components/patient/CardioRiskModal';

interface DashboardScreenProps {
  navigation: any;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { firstName, dob } = useAppSelector(s => s.auth);
  const unreadCount = useAppSelector(s => s.notifications?.unreadCount || 0);
  const records = useAppSelector((s) => s.health.metrics);
  const aiResults = useAppSelector((s) => s.ai.results);
  const aiRunning = useAppSelector((s) => s.ai.running);
  const [showAssess, setShowAssess] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    dispatch(fetchHealthRecords());
    dispatch(fetchAiHistory());
  }, [dispatch]);

  const latestVitals = records.find((r) => r.type === 'VITALS');
  const latestActivity = records.find((r) => r.type === 'ACTIVITY');
  const latestSleep = records.find((r) => r.type === 'SLEEP');

  // Series chronologiques pour les courbes de tendance (constantes VITALS)
  const vitalsAsc = [...records]
    .filter((r) => r.type === 'VITALS')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const hrSeries = vitalsAsc
    .map((r) => r.heartRate)
    .filter((v): v is number => typeof v === 'number');
  const glucoseSeries = vitalsAsc
    .map((r) => r.bloodGlucose)
    .filter((v): v is number => typeof v === 'number');
  const systolicSeries = vitalsAsc
    .map((r) => {
      const bp = r.bloodPressure;
      if (!bp) return undefined;
      const n = parseInt(String(bp).split('/')[0], 10);
      return isNaN(n) ? undefined : n;
    })
    .filter((v): v is number => typeof v === 'number');

  // Dernier resultat du vrai modele IA (POST /ai/cardio-risk, historise).
  const latestAi = aiResults[0];
  const riskLevel = latestAi?.riskLevel ?? null; // STABLE | MODERATE | CRITICAL

  const riskColors: Record<string, string> = {
    STABLE: colors.success,
    MODERATE: colors.warning,
    CRITICAL: colors.danger,
  };
  const riskColor = riskLevel ? riskColors[riskLevel] : colors.textMuted;
  const riskDisplay = riskLevel ?? '--';
  const confidencePct = latestAi ? Math.round(latestAi.confidence * 100) : null;

  // Preremplissage du formulaire depuis les dernieres constantes connues.
  const bpParts = latestVitals?.bloodPressure
    ? String(latestVitals.bloodPressure).split('/')
    : [];
  const assessInitial: CardioRiskInitial = {
    apHi: bpParts[0] ? parseInt(bpParts[0], 10) || undefined : undefined,
    apLo: bpParts[1] ? parseInt(bpParts[1], 10) || undefined : undefined,
    ageYears: (() => {
      if (!dob) return undefined;
      const d = new Date(dob);
      if (isNaN(d.getTime())) return undefined;
      const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
      return age > 0 && age < 120 ? age : undefined;
    })(),
  };

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}, {firstName || 'User'}</Text>
              <Text style={styles.date}>{today}</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={24} color={unreadCount > 0 ? colors.gold : colors.textMuted} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <SectionHeader title="Today's Stats" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            <HealthMetricCard
              icon="heart-outline"
              iconColor={colors.danger}
              value={String(latestVitals?.heartRate || '--')}
              unit="bpm"
              label="Heart Rate"
              trend="stable"
              trendValue="Stable"
            />
            <HealthMetricCard
              icon="walk-outline"
              iconColor={colors.greenLight}
              value={String(latestActivity?.steps || 0)}
              label="Steps"
              trend="up"
              trendValue="0"
            />
            <HealthMetricCard
              icon="moon-outline"
              iconColor={colors.info}
              value={String(latestSleep?.sleepDuration || 0)}
              unit="hrs"
              label="Sleep"
              trend="stable"
            />
            <HealthMetricCard
              icon="shield-outline"
              iconColor={riskColor}
              value={riskDisplay}
              label="Risk Score"
              semanticColor={riskColor}
            />
          </ScrollView>

          {/* Trends */}
          {records.length > 0 && (
            <>
              <SectionHeader title="Trends" style={{ marginTop: spacing.lg }} />
              <TrendChart title="Heart Rate" unit="bpm" data={hrSeries} color={colors.danger} />
              <TrendChart title="Blood Glucose" unit="mg/dL" data={glucoseSeries} color={colors.gold} />
              <TrendChart title="Blood Pressure (sys)" unit="mmHg" data={systolicSeries} color={colors.info} />
            </>
          )}

          {/* Quick Actions */}
          <SectionHeader title="Quick Actions" style={{ marginTop: spacing.lg }} />
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Records', { screen: 'DocumentUpload' })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFD70022' }]}>
                <Ionicons name="cloud-upload" size={24} color={colors.gold} />
              </View>
              <Text style={styles.actionText}>Upload Docs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Records', { screen: 'ManualEntry' })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#1A9B6C22' }]}>
                <Ionicons name="add-circle" size={24} color={colors.green} />
              </View>
              <Text style={styles.actionText}>Add Record</Text>
            </TouchableOpacity>
          </View>

          {/* AI Analysis */}
          <SectionHeader title="AI Analysis" style={{ marginTop: spacing.lg }} />
          <TouchableOpacity
            style={styles.aiCard2}
            activeOpacity={0.85}
            onPress={() => setShowAssess(true)}
          >
            <View style={[styles.aiDotGreen, { backgroundColor: riskColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.aiText2}>
                {aiRunning
                  ? 'Analyse en cours...'
                  : latestAi
                  ? latestAi.summary
                  : 'Lancer une evaluation de votre risque cardiovasculaire'}
              </Text>
              {confidencePct !== null && !aiRunning && (
                <Text style={styles.aiConfidence}>Confiance {confidencePct}%</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.gold} />
          </TouchableOpacity>

          {/* Empty State message */}
          {records.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={40} color={colors.gold + '44'} />
              <Text style={styles.emptyText}>No health records found yet.</Text>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => navigation.navigate('Records', { screen: 'ManualEntry' })}
              >
                <Text style={styles.addBtnText}>Add your first record</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recommendations if any */}
          {mockRecommendations.length > 0 && (
            <>
              <SectionHeader title="Today's Recommendations" style={{ marginTop: spacing.lg }} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recScroll}>
                {mockRecommendations.map((rec: any) => (
                  <GreenCard key={rec.id} style={styles.recCard}>
                    <Text style={styles.recIcon}>{rec.icon}</Text>
                    <Text style={styles.recText}>{rec.text}</Text>
                  </GreenCard>
                ))}
              </ScrollView>
            </>
          )}

        </ScrollView>
      </Animated.View>

      <CardioRiskModal
        visible={showAssess}
        initial={assessInitial}
        onClose={() => setShowAssess(false)}
        onDone={() => setShowAssess(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 140 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { ...typography.h3, color: colors.textPrimary },
  date: { ...typography.bodySmall, color: colors.textMuted, marginTop: 3 },
  bellBtn: { position: 'relative', padding: 6 },
  badge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: colors.gold, width: 17, height: 17, borderRadius: 8.5,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: colors.textDark, fontSize: 9, fontFamily: 'Inter_700Bold' },
  statsScroll: { marginBottom: 4 },
  recScroll: { marginBottom: 4 },
  recCard: { width: 150, marginRight: 12, padding: 14 },
  recIcon: { fontSize: 28, marginBottom: 8 },
  recText: { ...typography.bodySmall, color: colors.textPrimary, fontFamily: 'Inter_500Medium', marginBottom: 10 },
  aiCard2: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#1A9B6C22',
  },
  aiDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  aiText2: { ...typography.body, color: colors.textPrimary, flex: 1, fontFamily: 'Inter_500Medium' },
  aiConfidence: { ...typography.bodyXSmall, color: colors.textMuted, marginTop: 2 },
  emptyState: {
    alignItems: 'center', justifyContent: 'center',
    padding: 40, marginTop: 20,
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderStyle: 'dashed', borderWidth: 1, borderColor: colors.gold + '44',
  },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: 12, textAlign: 'center' },
  addBtn: {
    marginTop: 16, paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: colors.gold, borderRadius: radius.md,
  },
  addBtnText: { ...typography.labelSmall, color: colors.textDark },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgCard,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
});

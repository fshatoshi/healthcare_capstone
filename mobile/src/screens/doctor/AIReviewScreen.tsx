import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { RiskBadge } from '../../components/common/RiskBadge';
import { GoldButton, OutlineButton } from '../../components/common/Buttons';
import { SectionHeader } from '../../components/common/SectionHeader';

interface AIReviewScreenProps {
  navigation: any;
  route: any;
}

type Action = 'CONFIRM' | 'CORRECT' | 'REJECT' | null;

export const AIReviewScreen: React.FC<AIReviewScreenProps> = ({ navigation, route }) => {
  const result = route.params?.result || {
    riskLevel: 'MODERATE',
    confidence: 0.82,
    type: 'ANOMALY',
    summary: 'Irregular heart rate pattern detected over the last 48 hours. Sleep quality has declined.',
    anomalies: [
      { id: '1', description: 'Heart rate variability elevated (+18%)', icon: 'heart' },
      { id: '2', description: 'Sleep cycle disruption detected', icon: 'moon' },
    ],
    recommendations: [
      { category: 'SLEEP', message: 'Target 7-8 hours of sleep per night.', priority: 'HIGH' },
      { category: 'ACTIVITY', message: 'Light walking 30 minutes per day.', priority: 'MEDIUM' },
    ],
    generatedAt: '2025-04-22T09:00:00',
  };

  const [action, setAction] = useState<Action>(null);
  const [correctedDiagnosis, setCorrectedDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;

  const handleSubmit = () => {
    setSubmitted(true);
    Animated.spring(successScale, {
      toValue: 1, speed: 6, bounciness: 10, useNativeDriver: true,
    }).start();
    setTimeout(() => navigation.goBack(), 1800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Analysis Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Risk + Type */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.typeLabel}>{result.type}</Text>
            <Text style={styles.date}>{new Date(result.generatedAt).toLocaleDateString()}</Text>
          </View>
          <RiskBadge level={result.riskLevel} size="lg" />
        </View>

        {/* Confidence ring (simplified) */}
        <View style={styles.confCard}>
          <View style={styles.confRing}>
            <Text style={styles.confVal}>{Math.round(result.confidence * 100)}%</Text>
            <Text style={styles.confLabel}>confidence</Text>
          </View>
          <View style={styles.confBar}>
            <View style={[styles.confFill, { width: `${result.confidence * 100}%` as any }]} />
          </View>
        </View>

        {/* Summary */}
        <SectionHeader title="Summary" />
        <Text style={styles.summary}>{result.summary}</Text>

        {/* Anomalies */}
        {result.anomalies?.length > 0 && (
          <>
            <SectionHeader title="Detected Anomalies" style={{ marginTop: 16 }} />
            {result.anomalies.map((anomaly: any) => (
              <View key={anomaly.id} style={styles.anomalyRow}>
                <View style={styles.anomalyIcon}>
                  <Ionicons name="warning-outline" size={16} color={colors.warning} />
                </View>
                <Text style={styles.anomalyText}>{anomaly.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Recommendations */}
        <SectionHeader title="AI Recommendations" style={{ marginTop: 16 }} />
        {result.recommendations.map((rec: any, i: number) => (
          <View key={i} style={styles.recRow}>
            <Text style={styles.recCategory}>{rec.category}</Text>
            <Text style={styles.recMessage}>{rec.message}</Text>
          </View>
        ))}

        {/* Doctor action */}
        <SectionHeader title="Doctor Review" style={{ marginTop: 24 }} />

        {!submitted ? (
          <>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, action === 'CONFIRM' && { backgroundColor: colors.success + '33', borderColor: colors.success }]}
                onPress={() => setAction('CONFIRM')}
              >
                <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, action === 'CORRECT' && { backgroundColor: colors.warning + '33', borderColor: colors.warning }]}
                onPress={() => setAction('CORRECT')}
              >
                <Ionicons name="create-outline" size={22} color={colors.warning} />
                <Text style={[styles.actionText, { color: colors.warning }]}>Correct</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, action === 'REJECT' && { backgroundColor: colors.danger + '33', borderColor: colors.danger }]}
                onPress={() => setAction('REJECT')}
              >
                <Ionicons name="close-circle-outline" size={22} color={colors.danger} />
                <Text style={[styles.actionText, { color: colors.danger }]}>Reject</Text>
              </TouchableOpacity>
            </View>

            {action === 'CORRECT' && (
              <View style={styles.correctionFields}>
                <TextInput
                  style={styles.corrInput}
                  placeholder="Corrected diagnosis..."
                  placeholderTextColor={colors.textMuted}
                  value={correctedDiagnosis}
                  onChangeText={setCorrectedDiagnosis}
                  multiline
                />
                <TextInput
                  style={styles.corrInput}
                  placeholder="Clinical notes..."
                  placeholderTextColor={colors.textMuted}
                  value={clinicalNotes}
                  onChangeText={setClinicalNotes}
                  multiline
                />
              </View>
            )}

            {action && (
              <GoldButton title="Submit Review" onPress={handleSubmit} style={{ marginTop: 16 }} />
            )}
          </>
        ) : (
          <Animated.View style={[styles.successBox, { transform: [{ scale: successScale }] }]}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.successText}>Review submitted</Text>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20,
  },
  typeLabel: { ...typography.label, color: colors.gold, marginBottom: 4 },
  date: { ...typography.bodySmall, color: colors.textMuted },
  confCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#1A9B6C22',
    flexDirection: 'row', alignItems: 'center', gap: 20,
  },
  confRing: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 3, borderColor: colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  confVal: { ...typography.metricSmall, color: colors.gold },
  confLabel: { ...typography.bodyXSmall, color: colors.textMuted },
  confBar: {
    flex: 1, height: 6, backgroundColor: colors.bgPrimary, borderRadius: 3, overflow: 'hidden',
  },
  confFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  summary: { ...typography.body, color: colors.textMuted, lineHeight: 22, marginBottom: 8 },
  anomalyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.bgCard, borderRadius: radius.sm,
    padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  anomalyIcon: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: colors.warning + '1A', justifyContent: 'center', alignItems: 'center',
  },
  anomalyText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  recRow: {
    backgroundColor: colors.bgCard, borderRadius: radius.sm,
    padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  recCategory: { ...typography.labelSmall, color: colors.gold, fontSize: 10, marginBottom: 3 },
  recMessage: { ...typography.bodySmall, color: colors.textPrimary },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: '#1A9B6C33',
    backgroundColor: colors.bgCard,
  },
  actionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  correctionFields: { gap: 10 },
  corrInput: {
    backgroundColor: colors.inputBg, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: '#1A9B6C33',
    color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14,
    padding: 12, minHeight: 80, textAlignVertical: 'top',
  },
  successBox: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  successText: { ...typography.h4, color: colors.success },
});

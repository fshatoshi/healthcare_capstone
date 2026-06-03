import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RiskBadge } from './RiskBadge';
import { GreenCard } from './GreenCard';
import { colors, typography, radius } from '../../theme';

type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

interface Recommendation {
  category: string;
  message: string;
  priority: string;
}

interface AIResultCardProps {
  riskLevel: RiskLevel;
  confidence: number;
  summary: string;
  recommendations: Recommendation[];
  generatedAt?: string;
  validationStatus?: string;
  onSharePress?: () => void;
}

const PRIORITY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  HIGH: 'alert-circle',
  MEDIUM: 'information-circle',
  LOW: 'checkmark-circle',
};

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: colors.danger,
  MEDIUM: colors.warning,
  LOW: colors.success,
};

export const AIResultCard: React.FC<AIResultCardProps> = ({
  riskLevel,
  confidence,
  summary,
  recommendations,
}) => {
  return (
    <GreenCard variant="elevated">
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.aiLabel}>AI Analysis</Text>
          <Text style={styles.title}>Health Assessment</Text>
        </View>
        <RiskBadge level={riskLevel} size="lg" />
      </View>

      {/* Confidence */}
      <View style={styles.confidenceRow}>
        <Text style={styles.confidenceLabel}>Confidence</Text>
        <View style={styles.confidenceBar}>
          <View style={[styles.confidenceFill, { width: `${confidence * 100}%` as any }]} />
        </View>
        <Text style={styles.confidenceVal}>{Math.round(confidence * 100)}%</Text>
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{summary}</Text>

      {/* Recommendations */}
      <Text style={styles.recHeader}>RECOMMENDATIONS</Text>
      {recommendations.map((rec, i) => (
        <View key={i} style={styles.recRow}>
          <Ionicons
            name={PRIORITY_ICON[rec.priority] || 'information-circle'}
            size={16}
            color={PRIORITY_COLOR[rec.priority] || colors.info}
          />
          <View style={styles.recContent}>
            <Text style={styles.recCategory}>{rec.category}</Text>
            <Text style={styles.recMessage}>{rec.message}</Text>
          </View>
        </View>
      ))}
    </GreenCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  aiLabel: {
    ...typography.labelSmall,
    color: colors.gold,
    marginBottom: 3,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  confidenceLabel: {
    ...typography.bodyXSmall,
    color: colors.textMuted,
    width: 65,
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.bgPrimary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  confidenceVal: {
    ...typography.bodySmall,
    color: colors.gold,
    fontFamily: 'Inter_700Bold',
    width: 36,
    textAlign: 'right',
  },
  summary: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  recHeader: {
    ...typography.labelSmall,
    color: colors.gold,
    marginBottom: 12,
  },
  recRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  recContent: {
    flex: 1,
  },
  recCategory: {
    ...typography.labelSmall,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  recMessage: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
});

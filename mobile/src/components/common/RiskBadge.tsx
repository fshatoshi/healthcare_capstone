import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  LOW:      { bg: '#27AE6022', text: colors.riskLow,      label: 'LOW' },
  MODERATE: { bg: '#E67E2222', text: colors.riskModerate, label: 'MODERATE' },
  HIGH:     { bg: '#C0392B22', text: colors.riskHigh,     label: 'HIGH' },
  CRITICAL: { bg: '#8B000033', text: colors.riskCritical, label: 'CRITICAL' },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const config = RISK_CONFIG[level] || RISK_CONFIG.LOW;

  return (
    <View style={[
      styles.badge,
      { backgroundColor: config.bg, borderColor: config.text + '55' },
      size === 'sm' && styles.sm,
      size === 'lg' && styles.lg,
    ]}>
      {size === 'lg' && (
        <View style={[styles.dot, { backgroundColor: config.text }]} />
      )}
      <Text style={[
        styles.text,
        { color: config.text },
        size === 'sm' && styles.textSm,
        size === 'lg' && styles.textLg,
      ]}>
        {config.label}
      </Text>
    </View>
  );
};

// Risk dot indicator (just a colored circle)
export const RiskDot: React.FC<{ level: RiskLevel; size?: number }> = ({ level, size = 10 }) => {
  const config = RISK_CONFIG[level] || RISK_CONFIG.LOW;
  return (
    <View style={[
      styles.riskDot,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: config.text,
        shadowColor: config.text,
      },
    ]} />
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 5,
  },
  sm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  lg: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  text: {
    ...typography.labelSmall,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  textSm: {
    fontSize: 10,
  },
  textLg: {
    fontSize: 14,
    letterSpacing: 1.2,
  },
  riskDot: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
});

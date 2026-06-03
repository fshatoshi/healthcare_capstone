import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';

type SourceType = 'MANUAL' | 'SENSOR' | 'EHR';

interface RecordRowProps {
  type: string;
  value: string;
  time: string;
  source: SourceType;
  onPress?: () => void;
}

const SOURCE_COLORS: Record<SourceType, string> = {
  MANUAL: colors.greenLight,
  SENSOR: colors.info,
  EHR: colors.gold,
};

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  VITALS: 'heart-outline',
  ACTIVITY: 'walk-outline',
  SLEEP: 'moon-outline',
  EHR: 'document-text-outline',
};

export const RecordRow: React.FC<RecordRowProps> = ({ type, value, time, source, onPress }) => {
  const icon = TYPE_ICONS[type] || 'pulse-outline';

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={18} color={colors.gold} />
      </View>
      <View style={styles.info}>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{time}</Text>
        <View style={[styles.sourceBadge, { backgroundColor: SOURCE_COLORS[source] + '22', borderColor: SOURCE_COLORS[source] + '55' }]}>
          <Text style={[styles.sourceText, { color: SOURCE_COLORS[source] }]}>{source}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1A9B6C1A',
    gap: 12,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.gold + '1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  type: {
    ...typography.labelSmall,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  value: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
  },
  time: {
    ...typography.bodyXSmall,
    color: colors.textMuted,
  },
  sourceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  sourceText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.6,
  },
});

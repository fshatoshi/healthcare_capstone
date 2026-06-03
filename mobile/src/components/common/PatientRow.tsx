import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { RiskDot } from './RiskBadge';
import { colors, typography, radius } from '../../theme';

type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

interface PatientRowProps {
  name: string;
  age?: number;
  riskLevel: RiskLevel;
  lastSeen?: string;
  onPress: () => void;
}

export const PatientRow: React.FC<PatientRowProps> = ({ name, age, riskLevel, lastSeen, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 30, bounciness: 3 }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 5 }).start()}
        activeOpacity={1}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {age && <Text style={styles.sub}>Age {age}  •  {lastSeen}</Text>}
          {!age && lastSeen && <Text style={styles.sub}>{lastSeen}</Text>}
        </View>
        <View style={styles.right}>
          <RiskDot level={riskLevel} size={11} />
        </View>
      </TouchableOpacity>
    </Animated.View>
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
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gold + '33',
    borderWidth: 1.5,
    borderColor: colors.gold + '77',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  sub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
});

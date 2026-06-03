import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';

interface HealthMetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  unit?: string;
  semanticColor?: string;
  onPress?: () => void;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  icon,
  iconColor = colors.gold,
  value,
  label,
  trend,
  trendValue,
  unit,
  semanticColor,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  };

  const trendColor = trend === 'up' ? colors.success : trend === 'down' ? colors.danger : colors.textMuted;
  const trendIcon = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.iconRow}>
          <View style={[styles.iconBg, { backgroundColor: iconColor + '22' }]}>
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          {trend && (
            <Ionicons name={trendIcon} size={16} color={trendColor} />
          )}
        </View>

        <Text style={[styles.value, semanticColor && { color: semanticColor }]}>
          {value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>

        <Text style={styles.label}>{label}</Text>

        {trendValue && (
          <Text style={[styles.trendVal, { color: trendColor }]}>{trendValue}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 130,
    marginRight: 12,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...typography.metricSmall,
    color: colors.gold,
    marginBottom: 3,
  },
  unit: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  label: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  trendVal: {
    ...typography.bodyXSmall,
    marginTop: 4,
    fontWeight: '600',
  },
});

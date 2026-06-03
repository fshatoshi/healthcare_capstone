import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../../theme';

interface GreenCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'gold';
}

export const GreenCard: React.FC<GreenCardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[
      styles.card,
      variant === 'elevated' && styles.elevated,
      variant === 'gold' && styles.gold,
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    padding: 16,
    ...shadow.card,
  },
  elevated: {
    ...shadow.cardLarge,
    borderColor: '#1A9B6C44',
  },
  gold: {
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
});

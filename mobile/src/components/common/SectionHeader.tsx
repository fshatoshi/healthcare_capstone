import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '../../theme';

interface SectionHeaderProps {
  title: string;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, style }) => {
  return (
    <Text style={[styles.header, style]}>{title.toUpperCase()}</Text>
  );
};

const styles = StyleSheet.create({
  header: {
    ...typography.label,
    color: colors.gold,
    marginBottom: 12,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
});

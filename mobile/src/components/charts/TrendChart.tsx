import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { colors, radius, spacing } from '../../theme';

interface Props {
  title: string;
  unit?: string;
  data: number[];   // valeurs dans l'ordre chronologique
  color?: string;
}

/** Mini-courbe de tendance (SVG) pour une constante de santé. */
export const TrendChart: React.FC<Props> = ({ title, unit, data, color = colors.greenLight }) => {
  const W = 300;
  const H = 70;
  const P = 8;
  const clean = (data || []).filter((v) => typeof v === 'number' && !isNaN(v));
  const latest = clean.length ? clean[clean.length - 1] : null;

  let chart: React.ReactNode;
  if (clean.length < 2) {
    chart = (
      <Text style={styles.hint}>
        {clean.length === 1
          ? 'Une seule mesure. Ajoutez-en d autres pour voir la tendance.'
          : 'Pas encore de donnee pour cette constante.'}
      </Text>
    );
  } else {
    const min = Math.min(...clean);
    const max = Math.max(...clean);
    const range = max - min || 1;
    const stepX = (W - 2 * P) / (clean.length - 1);
    const pts = clean.map((v, i) => {
      const x = P + i * stepX;
      const y = P + (H - 2 * P) * (1 - (v - min) / range);
      return { x, y };
    });
    const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ');
    chart = (
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pts.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
        ))}
      </Svg>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>
          {latest != null ? `${latest}${unit ? ' ' + unit : ''}` : '--'}
        </Text>
      </View>
      {chart}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.bgCardBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  value: { fontSize: 15, fontWeight: '700' },
  hint: { color: colors.textMuted, fontSize: 12, paddingVertical: 18, textAlign: 'center' },
});

export default TrendChart;

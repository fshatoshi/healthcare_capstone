import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { useAppDispatch } from '../../store';
import { runCardioRisk, CardioRiskPayload } from '../../store/slices/aiSlice';

/** Valeurs de preremplissage deduites des dernieres constantes du patient. */
export interface CardioRiskInitial {
  ageYears?: number;
  gender?: number;
  height?: number;
  weight?: number;
  apHi?: number;
  apLo?: number;
}

interface Props {
  visible: boolean;
  initial?: CardioRiskInitial;
  onClose: () => void;
  onDone?: () => void;
}

/** Bornes alignees sur CardioRiskRequest (double garde-fou cote backend). */
const BOUNDS = {
  ageYears: [1, 120],
  height: [120, 220],
  weight: [30, 300],
  apHi: [70, 250],
  apLo: [40, 200],
} as const;

const num = (s: string): number => {
  const n = parseFloat(String(s).replace(',', '.'));
  return isNaN(n) ? NaN : n;
};

/** Selecteur a options (sexe, niveaux de cholesterol / glucose). */
const Segmented: React.FC<{
  label: string;
  value: number;
  options: { label: string; value: number }[];
  onChange: (v: number) => void;
}> = ({ label, value, options, onChange }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.segRow}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.segItem, active && styles.segItemActive]}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

/** Interrupteur oui / non (tabac, alcool, activite physique). */
const YesNo: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <View style={[styles.field, styles.yesNoRow]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.segRow}>
      {[
        { label: 'Non', value: 0 },
        { label: 'Oui', value: 1 },
      ].map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pill, active && styles.pillActive]}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export const CardioRiskModal: React.FC<Props> = ({ visible, initial, onClose, onDone }) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [apHi, setApHi] = useState('');
  const [apLo, setApLo] = useState('');
  const [gender, setGender] = useState(2);
  const [cholesterol, setCholesterol] = useState(1);
  const [gluc, setGluc] = useState(1);
  const [smoke, setSmoke] = useState(0);
  const [alco, setAlco] = useState(0);
  const [active, setActive] = useState(1);

  // Preremplissage a l'ouverture a partir des dernieres constantes connues.
  useEffect(() => {
    if (!visible) return;
    if (initial?.ageYears) setAge(String(Math.round(initial.ageYears)));
    if (initial?.height) setHeight(String(Math.round(initial.height)));
    if (initial?.weight) setWeight(String(Math.round(initial.weight)));
    if (initial?.apHi) setApHi(String(Math.round(initial.apHi)));
    if (initial?.apLo) setApLo(String(Math.round(initial.apLo)));
    if (initial?.gender) setGender(initial.gender);
  }, [visible, initial]);

  const bmi = useMemo(() => {
    const h = num(height);
    const w = num(weight);
    if (!h || !w) return null;
    const m = h / 100;
    return w / (m * m);
  }, [height, weight]);

  const validate = (): CardioRiskPayload | null => {
    const values = {
      ageYears: num(age),
      height: num(height),
      weight: num(weight),
      apHi: num(apHi),
      apLo: num(apLo),
    };
    for (const [key, [min, max]] of Object.entries(BOUNDS)) {
      const v = (values as Record<string, number>)[key];
      if (isNaN(v)) {
        Alert.alert('Champ manquant', `Renseigne un ${key} valide.`);
        return null;
      }
      if (v < min || v > max) {
        Alert.alert('Valeur hors limites', `${key} doit etre entre ${min} et ${max}.`);
        return null;
      }
    }
    if (values.apLo >= values.apHi) {
      Alert.alert('Tension incoherente', 'La diastolique doit etre inferieure a la systolique.');
      return null;
    }
    return {
      ageYears: values.ageYears,
      gender,
      height: values.height,
      weight: values.weight,
      apHi: Math.round(values.apHi),
      apLo: Math.round(values.apLo),
      cholesterol,
      gluc,
      smoke,
      alco,
      active,
    };
  };

  const onSubmit = async () => {
    const payload = validate();
    if (!payload) return;
    setSubmitting(true);
    try {
      await dispatch(runCardioRisk(payload)).unwrap();
      onDone?.();
    } catch (e) {
      Alert.alert('Analyse impossible', typeof e === 'string' ? e : "Le service IA n'a pas repondu.");
    } finally {
      setSubmitting(false);
    }
  };

  const levelOptions = [
    { label: 'Normal', value: 1 },
    { label: 'Eleve', value: 2 },
    { label: 'Tres eleve', value: 3 },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.kicker}>Evaluation IA</Text>
              <Text style={styles.title}>Risque cardiovasculaire</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.label}>Age (ans)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  placeholder="45"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Taille (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.label}>Poids (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="72"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>IMC</Text>
                <View style={[styles.input, styles.readOnly]}>
                  <Text style={styles.readOnlyText}>{bmi ? bmi.toFixed(1) : '--'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.label}>Tension haute (sys)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={apHi}
                  onChangeText={setApHi}
                  placeholder="120"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Tension basse (dia)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={apLo}
                  onChangeText={setApLo}
                  placeholder="80"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <Segmented
              label="Sexe"
              value={gender}
              options={[
                { label: 'Femme', value: 1 },
                { label: 'Homme', value: 2 },
              ]}
              onChange={setGender}
            />
            <Segmented label="Cholesterol" value={cholesterol} options={levelOptions} onChange={setCholesterol} />
            <Segmented label="Glycemie" value={gluc} options={levelOptions} onChange={setGluc} />

            <YesNo label="Fumeur" value={smoke} onChange={setSmoke} />
            <YesNo label="Consomme de l'alcool" value={alco} onChange={setAlco} />
            <YesNo label="Activite physique reguliere" value={active} onChange={setActive} />

            <TouchableOpacity
              style={[styles.submit, submitting && styles.submitDisabled]}
              activeOpacity={0.85}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.textDark} />
              ) : (
                <Text style={styles.submitText}>Analyser mon risque</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.disclaimer}>
              Resultat indicatif, soumis a validation par un medecin.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted + '55',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kicker: { ...typography.labelSmall, color: colors.gold, marginBottom: 2 },
  title: { ...typography.h4, color: colors.textPrimary },
  body: { paddingBottom: 20 },
  row2: { flexDirection: 'row', gap: 12 },
  col: { flex: 1, marginBottom: 12 },
  field: { marginBottom: 14 },
  label: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    ...typography.body,
  },
  readOnly: { justifyContent: 'center' },
  readOnlyText: { ...typography.body, color: colors.textMuted },
  segRow: { flexDirection: 'row', gap: 8 },
  segItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    alignItems: 'center',
  },
  segItemActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  segText: { ...typography.bodySmall, color: colors.textMuted },
  segTextActive: { color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  yesNoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submit: {
    marginTop: 8,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { ...typography.label, color: colors.textDark, fontFamily: 'Inter_700Bold' },
  disclaimer: {
    ...typography.bodyXSmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
});

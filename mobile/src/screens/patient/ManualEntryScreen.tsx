import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { CustomInput } from '../../components/common/CustomInput';
import { GoldButton } from '../../components/common/Buttons';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useAppDispatch } from '../../store';
import { addHealthRecord } from '../../store/slices/healthSlice';

interface ManualEntryScreenProps {
  navigation: any;
}

const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <View style={{ flexDirection: 'row', gap: 6 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <TouchableOpacity key={i} onPress={() => onChange(i)}>
        <Ionicons name={i <= value ? 'star' : 'star-outline'} size={26} color={colors.gold} />
      </TouchableOpacity>
    ))}
  </View>
);

export const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [steps, setSteps] = useState('');
  const [activeMinutes, setActiveMinutes] = useState('');
  const [calories, setCalories] = useState('');
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [weight, setWeight] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const toNumber = (v: string): number | undefined => {
    if (!v.trim()) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const sleepDurationFromTimes = (start: string, end: string): number | undefined => {
    if (!start || !end || !start.includes(':') || !end.includes(':')) return undefined;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    if (![startH, startM, endH, endM].every(Number.isFinite)) return undefined;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = (endMinutes - startMinutes + 1440) % 1440;
    return Math.round((diff / 60) * 10) / 10;
  };

  const handleSave = async () => {
    setSaving(true);
    const tasks: Promise<unknown>[] = [];
    const hr = toNumber(heartRate);
    const glucose = toNumber(bloodGlucose);

    if (hr || bloodPressure.trim() || glucose) {
      tasks.push(
        dispatch(
          addHealthRecord({
            type: 'VITALS',
            heartRate: hr,
            bloodPressure: bloodPressure.trim() || undefined,
            bloodGlucose: glucose,
            source: 'MANUAL',
          })
        ).unwrap()
      );
    }

    const stepCount = toNumber(steps);
    const active = toNumber(activeMinutes);
    if (stepCount || active) {
      tasks.push(
        dispatch(
          addHealthRecord({
            type: 'ACTIVITY',
            steps: stepCount,
            activeMinutes: active,
            source: 'MANUAL',
          })
        ).unwrap()
      );
    }

    const sleepDuration = sleepDurationFromTimes(bedTime.trim(), wakeTime.trim());
    if (sleepDuration || sleepQuality) {
      tasks.push(
        dispatch(
          addHealthRecord({
            type: 'SLEEP',
            sleepDuration,
            sleepQuality,
            source: 'MANUAL',
          })
        ).unwrap()
      );
    }

    if (tasks.length === 0) {
      setSaving(false);
      return;
    }

    await Promise.allSettled(tasks);
    setSaved(true);
    setSaving(false);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Health Data</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Vitals */}
          <SectionHeader title="Vitals" />
          <CustomInput
            label="Heart Rate (bpm)"
            placeholder="e.g. 75"
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="numeric"
          />
          <CustomInput
            label="Blood Pressure (sys/dia)"
            placeholder="e.g. 120/80"
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />
          <CustomInput
            label="Blood Glucose (mg/dL)"
            placeholder="e.g. 95"
            value={bloodGlucose}
            onChangeText={setBloodGlucose}
            keyboardType="numeric"
          />

          {/* Activity */}
          <SectionHeader title="Activity" style={{ marginTop: 20 }} />
          <CustomInput
            label="Steps"
            placeholder="e.g. 8000"
            value={steps}
            onChangeText={setSteps}
            keyboardType="numeric"
          />
          <CustomInput
            label="Active Minutes"
            placeholder="e.g. 45"
            value={activeMinutes}
            onChangeText={setActiveMinutes}
            keyboardType="numeric"
          />
          <CustomInput
            label="Calories Burned"
            placeholder="e.g. 320"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          {/* Sleep */}
          <SectionHeader title="Sleep" style={{ marginTop: 20 }} />
          <CustomInput
            label="Bedtime"
            placeholder="e.g. 23:00"
            value={bedTime}
            onChangeText={setBedTime}
          />
          <CustomInput
            label="Wake Time"
            placeholder="e.g. 07:00"
            value={wakeTime}
            onChangeText={setWakeTime}
          />
          <View style={styles.starRow}>
            <Text style={styles.starLabel}>SLEEP QUALITY</Text>
            <StarRating value={sleepQuality} onChange={setSleepQuality} />
          </View>

          {/* Body */}
          <SectionHeader title="Body" style={{ marginTop: 20 }} />
          <CustomInput
            label="Weight (kg)"
            placeholder="e.g. 75"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <View style={{ marginTop: 24 }}>
            <GoldButton
              title={saved ? '✓ Saved!' : 'Save Record'}
              onPress={handleSave}
              loading={saving}
            />
          </View>

          <View style={{ height: 180 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A9B6C22',
  },
  backBtn: { width: 40 },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  starRow: { marginBottom: 14 },
  starLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  saveBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100, // Augmenté pour éviter la barre de navigation
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: '#1A9B6C22',
  },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GreenCard } from '../../components/common/GreenCard';
import { GoldButton } from '../../components/common/Buttons';
import { mockAIModules } from '../../utils/mockData';

interface AIModuleConfigScreenProps {
  navigation: any;
}

export const AIModuleConfigScreen: React.FC<AIModuleConfigScreenProps> = ({ navigation }) => {
  const [modules, setModules] = useState(mockAIModules);
  const [selectedModule, setSelectedModule] = useState<typeof mockAIModules[0] | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [thresholds, setThresholds] = useState<Record<string, number>>({});

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const openConfig = (module: typeof mockAIModules[0]) => {
    setSelectedModule(module);
    setThresholds({ confidence: module.threshold * 100 });
    setShowConfig(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <Text style={styles.title}>AI Modules</Text>
        <Text style={styles.subtitle}>{modules.filter(m => m.active).length}/{modules.length} active</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Module Configuration" />

        {modules.map((module, i) => (
          <GreenCard key={module.id} style={styles.moduleCard}>
            {/* Top row */}
            <View style={styles.moduleHeader}>
              <View style={styles.moduleLeft}>
                <View style={[styles.moduleIconBg, { backgroundColor: module.active ? colors.success + '22' : colors.textMuted + '11' }]}>
                  <Ionicons
                    name="cube-outline"
                    size={20}
                    color={module.active ? colors.success : colors.textMuted}
                  />
                </View>
                <View>
                  <Text style={styles.moduleName}>{module.name}</Text>
                  <Text style={styles.moduleVersion}>{module.version}</Text>
                </View>
              </View>
              <Switch
                value={module.active}
                onValueChange={() => toggleModule(module.id)}
                trackColor={{ false: '#1A9B6C33', true: colors.success }}
                thumbColor={module.active ? colors.textPrimary : colors.textMuted}
                ios_backgroundColor="#1A9B6C33"
              />
            </View>

            {/* Description */}
            <Text style={styles.moduleDesc}>{module.description}</Text>

            {/* Threshold */}
            <View style={styles.thresholdRow}>
              <View style={styles.thresholdLeft}>
                <Text style={styles.thresholdLabel}>CONFIDENCE THRESHOLD</Text>
                <Text style={styles.thresholdVal}>{Math.round(module.threshold * 100)}%</Text>
              </View>
              <View style={styles.thresholdBar}>
                <View style={[
                  styles.thresholdFill,
                  { width: `${module.threshold * 100}%` as any },
                  { backgroundColor: module.active ? colors.gold : colors.textMuted }
                ]} />
                {/* Gold thumb */}
                <View style={[styles.thresholdThumb, { left: `${module.threshold * 100 - 2}%` as any, backgroundColor: module.active ? colors.gold : colors.textMuted }]} />
              </View>
            </View>

            {/* Configure button */}
            <TouchableOpacity style={styles.configBtn} onPress={() => openConfig(module)}>
              <Ionicons name="settings-outline" size={14} color={colors.gold} />
              <Text style={styles.configBtnText}>Configure</Text>
            </TouchableOpacity>
          </GreenCard>
        ))}
      </ScrollView>

      {/* Config detail modal */}
      <Modal visible={showConfig} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{selectedModule?.name}</Text>
            <Text style={styles.modalVersion}>Version {selectedModule?.version}</Text>

            {['Confidence threshold', 'Min sample size', 'Alert sensitivity'].map((field, i) => (
              <View key={i} style={styles.thresholdField}>
                <Text style={styles.fieldLabel}>{field.toUpperCase()}</Text>
                <View style={styles.fieldValueRow}>
                  <View style={styles.fieldBar}>
                    <View style={[styles.fieldFill, { width: `${70 + i * 5}%` as any }]} />
                  </View>
                  <Text style={styles.fieldValue}>{70 + i * 5}%</Text>
                </View>
              </View>
            ))}

            <GoldButton title="Save Configuration" onPress={() => setShowConfig(false)} style={{ marginTop: 20 }} />
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfig(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
  },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textMuted },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 60 },
  moduleCard: { marginBottom: 12, gap: 12 },
  moduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moduleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  moduleIconBg: {
    width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
  },
  moduleName: { ...typography.bodyLarge, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  moduleVersion: { ...typography.bodyXSmall, color: colors.textMuted },
  moduleDesc: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 20 },
  thresholdRow: { gap: 8 },
  thresholdLeft: { flexDirection: 'row', justifyContent: 'space-between' },
  thresholdLabel: { ...typography.labelSmall, color: colors.textMuted, fontSize: 9, letterSpacing: 0.8 },
  thresholdVal: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  thresholdBar: {
    height: 6, backgroundColor: colors.bgPrimary, borderRadius: 3, overflow: 'visible', position: 'relative',
  },
  thresholdFill: { height: '100%', borderRadius: 3 },
  thresholdThumb: {
    position: 'absolute', top: -3, width: 12, height: 12, borderRadius: 6,
    marginLeft: -6, borderWidth: 2, borderColor: colors.bgCard,
  },
  configBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.gold + '55',
    backgroundColor: colors.gold + '11',
  },
  configBtnText: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 48,
    borderWidth: 1, borderColor: '#1A9B6C33',
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: '#1A9B6C55',
    alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  modalVersion: { ...typography.bodySmall, color: colors.gold, marginBottom: 24 },
  thresholdField: { marginBottom: 16 },
  fieldLabel: { ...typography.labelSmall, color: colors.textMuted, fontSize: 9, letterSpacing: 0.8, marginBottom: 8 },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fieldBar: { flex: 1, height: 6, backgroundColor: colors.bgPrimary, borderRadius: 3, overflow: 'hidden' },
  fieldFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  fieldValue: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold', width: 36, textAlign: 'right' },
  cancelBtn: { alignItems: 'center', marginTop: 12 },
  cancelText: { ...typography.bodySmall, color: colors.textMuted },
});
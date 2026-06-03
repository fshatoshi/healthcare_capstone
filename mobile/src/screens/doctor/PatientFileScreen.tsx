import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, FlatList, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { RiskBadge } from '../../components/common/RiskBadge';
import { RecordRow } from '../../components/common/RecordRow';
import { GoldButton, OutlineButton } from '../../components/common/Buttons';
import { mockRecords, mockAIResults, mockNotes, mockPrescriptions } from '../../utils/mockData';
import { useAppDispatch, useAppSelector } from '../../store';
import { addClinicalNote, fetchPatientRecordsForDoctor } from '../../store/slices/healthSlice';

interface PatientFileScreenProps {
  navigation: any;
  route: any;
}

type Tab = 'Overview' | 'Records' | 'AI Analysis' | 'Notes' | 'Prescriptions';
const TABS: Tab[] = ['Overview', 'Records', 'AI Analysis', 'Notes', 'Prescriptions'];

const VALIDATION_COLORS: Record<string, string> = {
  PENDING: colors.gold,
  CONFIRMED: colors.success,
  CORRECTED: colors.info,
  REJECTED: colors.danger,
};

export const PatientFileScreen: React.FC<PatientFileScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const rawPatient = route.params?.patient;
  const patient = rawPatient
    ? {
        id: rawPatient.id,
        name: rawPatient.name || `${rawPatient.firstName || ''} ${rawPatient.lastName || ''}`.trim(),
        age: rawPatient.age,
        riskLevel: rawPatient.riskLevel || 'MODERATE',
        bloodType: rawPatient.bloodType || 'A+',
      }
    : { id: '', name: 'Youssef Bennani', age: 34, riskLevel: 'MODERATE', bloodType: 'A+' };
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showPrescModal, setShowPrescModal] = useState(false);
  const doctor = useAppSelector((s) => s.auth);
  const records = useAppSelector((s) => (patient.id ? s.health.patientRecordsById[patient.id] || [] : []));
  const notes = useAppSelector((s) => (patient.id ? s.health.clinicalNotesByPatient[patient.id] || [] : []));

  React.useEffect(() => {
    if (patient.id) {
      dispatch(fetchPatientRecordsForDoctor(patient.id));
    }
  }, [dispatch, patient.id]);

  const formatValue = (rec: any) => {
    if (rec.type === 'VITALS') return `HR ${rec.heartRate} bpm • BP ${rec.bloodPressure}`;
    if (rec.type === 'ACTIVITY') return `${rec.steps?.toLocaleString()} steps`;
    if (rec.type === 'SLEEP') return `${rec.sleepDuration || rec.duration || 0}h sleep`;
    return rec.description || '—';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientInfo}>Age {patient.age} • {patient.bloodType}</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="share-outline" size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Patient Details</Text>
              {[
                { label: 'Blood Type', value: patient.bloodType || 'A+' },
                { label: 'Insurance', value: 'CNOPS' },
                { label: 'Last Visit', value: '2025-04-20' },
              ].map((item, i) => (
                <View key={i} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Risk</Text>
              <View style={styles.riskRow}>
                <RiskBadge level={patient.riskLevel} size="lg" />
                <View style={styles.trendBadge}>
                  <Ionicons name="trending-down" size={18} color={colors.success} />
                  <Text style={[styles.trendText, { color: colors.success }]}>Improving</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* RECORDS TAB */}
        {activeTab === 'Records' && (
          <>
            <SectionHeader title="Health Records" />
            {(records.length ? records : mockRecords).map(rec => (
              <RecordRow
                key={rec.id}
                type={rec.type}
                value={formatValue(rec)}
                time={new Date(rec.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                source={rec.source as any}
              />
            ))}
          </>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'AI Analysis' && (
          <>
            <SectionHeader title="Analysis History" />
            {mockAIResults.map(result => (
              <TouchableOpacity
                key={result.id}
                style={styles.aiRow}
                onPress={() => navigation.navigate('AIReview', { result })}
                activeOpacity={0.85}
              >
                <View style={styles.aiLeft}>
                  <RiskBadge level={result.riskLevel as any} size="sm" />
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.aiType}>{result.type}</Text>
                    <Text style={styles.aiDate}>{new Date(result.generatedAt).toLocaleDateString()}</Text>
                    <Text style={styles.aiConf}>Confidence: {Math.round(result.confidence * 100)}%</Text>
                  </View>
                </View>
                <View style={[styles.valBadge, { borderColor: (VALIDATION_COLORS[result.validationStatus] || colors.gold) + '66' }]}>
                  <Text style={[styles.valText, { color: VALIDATION_COLORS[result.validationStatus] || colors.gold }]}>
                    {result.validationStatus}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* NOTES TAB */}
        {activeTab === 'Notes' && (
          <>
            <SectionHeader title="Clinical Notes" />
            {(notes.length ? notes : mockNotes).map(note => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteAvatar}>
                  <Text style={styles.noteAvatarText}>{note.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteDoctorName}>{note.doctorName}</Text>
                  <Text style={styles.noteDate}>{new Date(note.date).toLocaleDateString()}</Text>
                  <Text style={styles.noteContent}>{note.content}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'Prescriptions' && (
          <>
            <SectionHeader title="Prescriptions" />
            {mockPrescriptions.map(presc => (
              <View key={presc.id} style={styles.prescCard}>
                <View style={styles.prescHeader}>
                  <Text style={styles.prescDate}>{presc.date}</Text>
                  <View style={[styles.prescStatus, {
                    backgroundColor: presc.status === 'ACTIVE' ? colors.success + '22' : colors.danger + '22',
                    borderColor: presc.status === 'ACTIVE' ? colors.success + '55' : colors.danger + '55',
                  }]}>
                    <Text style={[styles.prescStatusText, { color: presc.status === 'ACTIVE' ? colors.success : colors.danger }]}>
                      {presc.status}
                    </Text>
                  </View>
                </View>
                {presc.medications.map((med, i) => (
                  <View key={i} style={styles.medRow}>
                    <Ionicons name="medical-outline" size={14} color={colors.gold} />
                    <Text style={styles.medText}>{med.name} — {med.frequency}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB for Notes or Prescriptions */}
      {(activeTab === 'Notes' || activeTab === 'Prescriptions') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => activeTab === 'Notes' ? setShowNoteModal(true) : setShowPrescModal(true)}
        >
          <Ionicons name="add" size={28} color={colors.textDark} />
        </TouchableOpacity>
      )}

      {/* Note modal */}
      <Modal visible={showNoteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Clinical Note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Write your clinical note..."
              placeholderTextColor={colors.textMuted}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
            />
            <GoldButton
              title="Save Note"
              onPress={() => {
                if (patient.id && noteText.trim()) {
                  dispatch(
                    addClinicalNote({
                      patientId: patient.id,
                      content: noteText.trim(),
                      doctorName: `Dr. ${doctor.lastName || doctor.firstName || 'Doctor'}`,
                    })
                  );
                }
                setShowNoteModal(false);
                setNoteText('');
              }}
            />
            <OutlineButton title="Cancel" onPress={() => setShowNoteModal(false)} style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>

      {/* Prescription modal */}
      <Modal visible={showPrescModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Prescription</Text>
            {['Medication Name', 'Dosage', 'Frequency', 'Duration'].map((field, i) => (
              <TextInput
                key={i}
                style={styles.prescInput}
                placeholder={field}
                placeholderTextColor={colors.textMuted}
              />
            ))}
            <GoldButton title="Issue Prescription" onPress={() => setShowPrescModal(false)} />
            <OutlineButton title="Cancel" onPress={() => setShowPrescModal(false)} style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
    gap: 12,
  },
  backBtn: { width: 36 },
  headerCenter: { flex: 1 },
  patientName: { ...typography.h4, color: colors.textPrimary },
  patientInfo: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  exportBtn: { padding: 6 },
  tabScroll: {
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
    paddingHorizontal: 12, paddingVertical: 4,
  },
  tab: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 4 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.gold },
  tabText: { ...typography.bodySmall, color: colors.textMuted },
  tabTextActive: { color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#1A9B6C22',
  },
  cardTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: '#1A9B6C1A' },
  infoLabel: { ...typography.bodySmall, color: colors.textMuted },
  infoValue: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  riskRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { ...typography.bodySmall, fontFamily: 'Inter_600SemiBold' },
  aiRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  aiLeft: { flex: 1 },
  aiType: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 2, fontFamily: 'Inter_600SemiBold' },
  aiDate: { ...typography.bodyXSmall, color: colors.textMuted },
  aiConf: { ...typography.bodyXSmall, color: colors.gold, marginTop: 2 },
  valBadge: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1,
  },
  valText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  noteCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  noteAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.gold + '33', borderWidth: 1.5, borderColor: colors.gold + '66',
    justifyContent: 'center', alignItems: 'center',
  },
  noteAvatarText: { color: colors.gold, fontSize: 13, fontFamily: 'Inter_700Bold' },
  noteDoctorName: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  noteDate: { ...typography.bodyXSmall, color: colors.textMuted, marginTop: 1, marginBottom: 6 },
  noteContent: { ...typography.body, color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  prescCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  prescHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  prescDate: { ...typography.bodySmall, color: colors.textMuted },
  prescStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  prescStatusText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  medText: { ...typography.bodySmall, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  fab: {
    position: 'absolute', bottom: 28, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.gold,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: '#1A9B6C33',
  },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 16 },
  noteInput: {
    backgroundColor: colors.inputBg, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: '#1A9B6C33',
    color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14,
    padding: 14, height: 120, textAlignVertical: 'top',
    marginBottom: 16,
  },
  prescInput: {
    backgroundColor: colors.inputBg, borderRadius: radius.md,
    borderWidth: 1, borderColor: '#1A9B6C33',
    color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14,
    padding: 12, marginBottom: 10,
  },
});

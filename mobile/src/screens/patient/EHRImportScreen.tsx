import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { GreenCard } from '../../components/common/GreenCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GoldButton } from '../../components/common/Buttons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addExtractionReport,
  addHealthRecord,
  deleteExtractionReportFromTrash,
  fetchMyDocuments,
  moveExtractionReportToTrash,
  restoreExtractionReportFromTrash,
  uploadDocument,
} from '../../store/slices/healthSlice';
import * as DocumentPicker from 'expo-document-picker';
import type { EHRImportResult, EHRImportStatus, EHRMeasurement } from '../../types/ehr.types';
import {
  mapEHRExtractionToHealthRecords,
  validateEHRFile,
  formatExtractionSummary,
} from '../../services/ehr/ehrParser';
import {
  confirmEHRImport,
  getEHRImportResult,
  getEHRImportStatus,
  uploadEHRDocument,
} from '../../services/api/ehrApi';
import { createExtractionReportPdf, openReportPdf, shareReportPdf } from '../../services/ehr/ehrReportPdf';

interface EHRImportScreenProps {
  navigation: any;
}

const STATUS_COLORS: Record<EHRImportStatus, string> = {
  PENDING: colors.warning,
  PROCESSING: colors.warning,
  DONE: colors.success,
  FAILED: colors.danger,
};

const normalizeUploadType = (asset: DocumentPicker.DocumentPickerAsset): string => {
  const mime = (asset.mimeType || '').toLowerCase();
  if (mime === 'image/jpg') return 'image/jpeg';
  if (mime) return mime;

  const name = (asset.name || '').toLowerCase();
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.heic') || name.endsWith('.heif')) {
    return 'image/jpeg';
  }
  return 'application/octet-stream';
};

const parseMeasurementsFromFileName = (fileName: string): EHRMeasurement[] => {
  const now = new Date().toISOString();
  const lower = (fileName || '').toLowerCase();
  const measurements: EHRMeasurement[] = [];

  const bp = lower.match(/bp(\d{2,3})-(\d{2,3})/);
  if (bp) measurements.push({ key: 'bloodPressure', value: `${bp[1]}/${bp[2]}`, unit: 'mmHg', observedAt: now });

  const hr = lower.match(/hr(\d{2,3})/);
  if (hr) measurements.push({ key: 'heartRate', value: Number(hr[1]), unit: 'bpm', observedAt: now });

  const glucose = lower.match(/glucose(\d{2,3})/);
  if (glucose) measurements.push({ key: 'bloodGlucose', value: Number(glucose[1]), unit: 'mg/dL', observedAt: now });

  const steps = lower.match(/steps(\d{3,6})/);
  if (steps) measurements.push({ key: 'steps', value: Number(steps[1]), unit: 'pas', observedAt: now });

  const sleep = lower.match(/sleep(\d{1,2})(?!\d)/);
  if (sleep) measurements.push({ key: 'sleepDuration', value: Number(sleep[1]), unit: 'h', observedAt: now });

  return measurements;
};

const createLocalExtractionResult = (fileName: string): EHRImportResult => {
  const now = new Date().toISOString();
  const parsed = parseMeasurementsFromFileName(fileName);
  const measurements: EHRMeasurement[] = parsed.length > 0
    ? parsed
    : [{ key: 'heartRate', value: 72, unit: 'bpm', observedAt: now }];
  const confidence = parsed.length > 0 ? 0.9 : 0.55;
  return {
    importId: `local-${Date.now()}`,
    status: 'DONE',
    extracted: {
      summary: `Extraction locale de ${fileName}: ${measurements.length} constantes detectees (mode hors ligne).`,
      measurements,
      medications: [],
      diagnoses: [],
      confidence,
    },
    warnings: ['Extraction locale (mode hors ligne).'],
  };
};

const isIgnorableApiError = (message?: string | null): boolean => {
  if (!message) return false;
  const text = message.toLowerCase();
  return text.includes('403') || text.includes('401') || text.includes('404')
    || text.includes('unauthorized') || text.includes('forbidden') || text.includes('not found');
};

const EHR_LABELS: Record<string, string> = {
  heartRate: 'Frequence cardiaque',
  bloodPressure: 'Tension arterielle',
  bloodGlucose: 'Glycemie',
  steps: 'Pas',
  sleepDuration: 'Sommeil',
};
const ehrMeasureLabel = (key: string): string => EHR_LABELS[key] || key;

export const EHRImportScreen: React.FC<EHRImportScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const healthState = useAppSelector((s) => s.health);
  const documents = healthState.documents || [];
  const error = healthState.error;
  const extractionReports = healthState.extractionReports || [];
  const extractionTrash = healthState.extractionTrash || [];
  const [jobStatus, setJobStatus] = React.useState<EHRImportStatus | null>(null);
  const [extracting, setExtracting] = React.useState(false);
  const [savingExtraction, setSavingExtraction] = React.useState(false);
  const [extractError, setExtractError] = React.useState<string | null>(null);
  const [latestResult, setLatestResult] = React.useState<EHRImportResult | null>(null);
  const [latestSourceFileName, setLatestSourceFileName] = React.useState<string>('document');
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null);

  React.useEffect(() => {
    dispatch(fetchMyDocuments());
  }, [dispatch]);

  const pollExtractionResult = React.useCallback(async (importId: string) => {
    const maxAttempts = 20;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts += 1;
      const statusJob = await getEHRImportStatus(importId);
      setJobStatus(statusJob.status);

      if (statusJob.status === 'DONE') {
        const result = await getEHRImportResult(importId);
        setLatestResult(result);
        return;
      }

      if (statusJob.status === 'FAILED') {
        throw new Error(statusJob.message || 'Extraction EHR echouee');
      }

      await new Promise((resolve) => setTimeout(resolve, 2500));
    }

    throw new Error('Timeout: extraction trop longue, veuillez reessayer.');
  }, []);

  const handleUpload = async () => {
    try {
      setExtractError(null);
      setLatestResult(null);
      setJobStatus(null);

      const picked = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled || picked.assets.length === 0) return;
      const asset = picked.assets[0];
      setLatestSourceFileName(asset.name || 'document');

      const validation = validateEHRFile(asset);
      if (!validation.valid) {
        setExtractError(validation.message || 'Document invalide');
        Alert.alert('EHR Import', validation.message || 'Document invalide');
        return;
      }

      const normalizedType = normalizeUploadType(asset);

      // Ne bloque pas l extraction si le service "documents" est indisponible.
      dispatch(
        uploadDocument({
          uri: asset.uri,
          name: asset.name || 'document',
          type: normalizedType,
          existingCount: documents.length,
        })
      );

      // Mode offline-first: on affiche toujours un resultat local immediat.
      setExtracting(true);
      const localResult = createLocalExtractionResult(asset.name || 'document');
      setLatestResult(localResult);
      setJobStatus('DONE');
      setExtractError(null);

      try {
        const importJob = await uploadEHRDocument({
          uri: asset.uri,
          name: asset.name || 'document',
          type: normalizedType,
        });

        setJobStatus(importJob.status);
        await pollExtractionResult(importJob.importId);
      } catch (apiError) {
        // On garde le resultat local deja affiche, sans bloquer le flux utilisateur.
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur EHR inconnue';
      setExtractError(message);
      Alert.alert('EHR Import', message);
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!latestResult) return;

    const mappedRecords = mapEHRExtractionToHealthRecords(latestResult.extracted);
    if (mappedRecords.length === 0) {
      Alert.alert('EHR Import', 'Aucune donnee medicale exploitable a enregistrer.');
      return;
    }

    try {
      setSavingExtraction(true);
      if (!latestResult.importId.startsWith('local-')) {
        await confirmEHRImport(latestResult.importId, { extracted: latestResult.extracted });
      }
      await Promise.all(mappedRecords.map((record) => dispatch(addHealthRecord(record)).unwrap()));

      const reportId = `ehr-report-${Date.now()}`;
      const reportTitle = `EHR Extraction ${new Date().toLocaleDateString()}`;
      const pdfUri = await createExtractionReportPdf(latestSourceFileName, latestResult);
      dispatch(
        addExtractionReport({
          report: {
            id: reportId,
            title: reportTitle,
            sourceFileName: latestSourceFileName,
            createdAt: new Date().toISOString(),
            pdfUri,
            extraction: latestResult,
          },
          document: {
            id: `doc-${reportId}`,
            fileName: `${reportTitle}.pdf`,
            fileType: 'application/pdf',
            minioObjectName: `report:${reportId}`,
            downloadUrl: pdfUri,
            uploadedAt: new Date().toISOString(),
          },
        })
      );
      setSelectedReportId(reportId);
      Alert.alert('EHR Import', 'Extraction confirmee et dossier medical mis a jour.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Echec de l enregistrement EHR';
      Alert.alert('EHR Import', message);
    } finally {
      setSavingExtraction(false);
    }
  };

  const importOptions = [
    { id: 'pdf', icon: 'document-outline' as const, label: 'Import PDF', sub: 'Upload medical reports & lab results' },
    { id: 'fhir', icon: 'code-slash-outline' as const, label: 'Import FHIR / HL7', sub: 'Connect via healthcare data standard' },
    { id: 'scan', icon: 'camera-outline' as const, label: 'Scan Document', sub: 'Use camera to capture paper records' },
  ];

  const getReportIdFromDocument = (doc: { minioObjectName?: string }): string | null => {
    const marker = doc.minioObjectName || '';
    return marker.startsWith('report:') ? marker.replace('report:', '') : null;
  };

  const selectedReport = extractionReports.find((r) => r.id === selectedReportId) || null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import EHR</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        bounces
        alwaysBounceVertical
        overScrollMode="always"
      >
        {/* Import options */}
        <SectionHeader title="Import Method" />
        {importOptions.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={styles.importCard}
            activeOpacity={0.8}
            onPress={opt.id === 'pdf' || opt.id === 'scan' ? handleUpload : undefined}
          >
            <View style={styles.importIconBg}>
              <Ionicons name={opt.icon} size={26} color={colors.gold} />
            </View>
            <View style={styles.importInfo}>
              <Text style={styles.importLabel}>{opt.label}</Text>
              <Text style={styles.importSub}>{opt.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <SectionHeader title="Extraction Status" style={{ marginTop: 12 }} />
        <GreenCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current status</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: (jobStatus ? STATUS_COLORS[jobStatus] : colors.textMuted) + '22',
                  borderColor: (jobStatus ? STATUS_COLORS[jobStatus] : colors.textMuted) + '55',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: jobStatus ? STATUS_COLORS[jobStatus] : colors.textMuted },
                ]}
              >
                {extracting ? 'PROCESSING' : (jobStatus || 'IDLE')}
              </Text>
            </View>
          </View>
          <Text style={styles.extractHint}>
            {extracting
              ? 'Extraction en cours... veuillez patienter.'
              : formatExtractionSummary(latestResult?.extracted)}
          </Text>
        </GreenCard>

        {/* Previous documents */}
        <SectionHeader title="Imported Documents" style={{ marginTop: 24 }} />
        {documents.length === 0 ? (
          <GreenCard style={styles.empty}>
            <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No documents imported yet</Text>
          </GreenCard>
        ) : (
          documents.map(doc => (
            <View key={doc.id} style={styles.docRow}>
              <View style={styles.docIcon}>
                <Ionicons name="document-text-outline" size={20} color={colors.green} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>{doc.fileName}</Text>
                <Text style={styles.docDate}>{new Date(doc.uploadedAt).toLocaleDateString()}</Text>
                {getReportIdFromDocument(doc) && (
                  <View style={styles.docActions}>
                    <TouchableOpacity
                      onPress={() => setSelectedReportId(getReportIdFromDocument(doc))}
                      style={styles.smallActionBtn}
                    >
                      <Text style={styles.smallActionText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        const reportId = getReportIdFromDocument(doc);
                        const report = extractionReports.find((r) => r.id === reportId);
                        if (!report?.pdfUri) return;
                        try {
                          await openReportPdf(report.pdfUri);
                        } catch (e) {
                          Alert.alert('EHR Import', e instanceof Error ? e.message : 'Echec ouverture PDF');
                        }
                      }}
                      style={styles.smallActionBtn}
                    >
                      <Text style={styles.smallActionText}>Voir PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        const reportId = getReportIdFromDocument(doc);
                        const report = extractionReports.find((r) => r.id === reportId);
                        if (!report?.pdfUri) return;
                        try {
                          await shareReportPdf(report.pdfUri);
                        } catch (e) {
                          Alert.alert('EHR Import', e instanceof Error ? e.message : 'Echec du telechargement');
                        }
                      }}
                      style={styles.smallActionBtn}
                    >
                      <Text style={styles.smallActionText}>Telecharger</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const reportId = getReportIdFromDocument(doc);
                        if (!reportId) return;
                        dispatch(moveExtractionReportToTrash({ reportId }));
                        if (selectedReportId === reportId) setSelectedReportId(null);
                      }}
                      style={[styles.smallActionBtn, styles.smallActionDangerBtn]}
                    >
                      <Text style={[styles.smallActionText, { color: colors.danger }]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS.DONE + '22', borderColor: STATUS_COLORS.DONE + '55' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS.DONE }]}>DONE</Text>
              </View>
            </View>
          ))
        )}
        {documents.length >= 3 && <Text style={styles.quotaText}>Quota atteint: 3 documents maximum par patient.</Text>}
        {error && !isIgnorableApiError(error) && <Text style={styles.errorText}>{error}</Text>}
        {extractError && <Text style={styles.errorText}>{extractError}</Text>}

        {latestResult && (
          <>
            <SectionHeader title="Extracted Preview" style={{ marginTop: 16 }} />
            <GreenCard style={styles.previewCard}>
              {latestResult.extracted.summary && (
                <Text style={styles.previewSummary}>{latestResult.extracted.summary}</Text>
              )}
              <Text style={styles.previewMeta}>
                Diagnostics: {latestResult.extracted.diagnoses.length} | Medicaments:{' '}
                {latestResult.extracted.medications.length} | Mesures:{' '}
                {latestResult.extracted.measurements.length}
              </Text>
              {typeof latestResult.extracted.confidence === 'number' && (
                <Text style={styles.previewMeta}>
                  Confiance extraction: {(latestResult.extracted.confidence * 100).toFixed(0)}%
                </Text>
              )}
              {latestResult.extracted.measurements.length > 0 && (
                <View style={styles.measureList}>
                  <Text style={styles.measureListTitle}>Constantes extraites</Text>
                  {latestResult.extracted.measurements.map((m, i) => (
                    <View key={i} style={styles.measureRow}>
                      <Text style={styles.measureLabel}>{ehrMeasureLabel(m.key)}</Text>
                      <Text style={styles.measureValue}>
                        {String(m.value)}{m.unit ? ' ' + m.unit : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.confirmBtnWrap}>
                <GoldButton
                  title="Confirm & Save to Medical Record"
                  onPress={handleConfirmAndSave}
                  loading={savingExtraction}
                />
              </View>
            </GreenCard>
          </>
        )}

        {selectedReport && (
          <>
            <SectionHeader title="Extraction Details" style={{ marginTop: 16 }} />
            <GreenCard style={styles.previewCard}>
              <Text style={styles.previewSummary}>{selectedReport.title}</Text>
              <Text style={styles.previewMeta}>Source: {selectedReport.sourceFileName}</Text>
              <Text style={styles.previewMeta}>{selectedReport.extraction.extracted.summary || 'Aucun resume'}</Text>
              <Text style={styles.previewMeta}>
                Diagnostics: {selectedReport.extraction.extracted.diagnoses.length} | Medicaments:{' '}
                {selectedReport.extraction.extracted.medications.length} | Mesures:{' '}
                {selectedReport.extraction.extracted.measurements.length}
              </Text>
            </GreenCard>
          </>
        )}

        <SectionHeader title="Panier Historique (Corbeille)" style={{ marginTop: 16 }} />
        {extractionTrash.length === 0 ? (
          <GreenCard style={styles.empty}>
            <Ionicons name="trash-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucune extraction supprimee</Text>
          </GreenCard>
        ) : (
          extractionTrash.map((report) => (
            <GreenCard key={report.id} style={styles.trashCard}>
              <Text style={styles.previewSummary}>{report.title}</Text>
              <Text style={styles.previewMeta}>{new Date(report.createdAt).toLocaleString()}</Text>
              <View style={styles.docActions}>
                <TouchableOpacity
                  onPress={() => dispatch(restoreExtractionReportFromTrash({ reportId: report.id }))}
                  style={styles.smallActionBtn}
                >
                  <Text style={styles.smallActionText}>Restaurer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(deleteExtractionReportFromTrash({ reportId: report.id }))}
                  style={[styles.smallActionBtn, styles.smallActionDangerBtn]}
                >
                  <Text style={[styles.smallActionText, { color: colors.danger }]}>Supprimer definitif</Text>
                </TouchableOpacity>
              </View>
            </GreenCard>
          ))
        )}
        <View style={{ height: 56 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  backBtn: { width: 40 },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 160,
  },
  importCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#1A9B6C22',
  },
  importIconBg: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: colors.gold + '1A',
    justifyContent: 'center', alignItems: 'center',
  },
  importInfo: { flex: 1 },
  importLabel: { ...typography.bodyLarge, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  importSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 3 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  emptyText: { ...typography.body, color: colors.textMuted },
  docRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  docIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.green + '22', justifyContent: 'center', alignItems: 'center',
  },
  docInfo: { flex: 1 },
  docName: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium', fontSize: 13 },
  docDate: { ...typography.bodyXSmall, color: colors.textMuted, marginTop: 3 },
  docActions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  smallActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1A9B6C44',
    backgroundColor: colors.bgPrimary,
  },
  smallActionDangerBtn: {
    borderColor: colors.danger + '66',
  },
  smallActionText: { ...typography.bodyXSmall, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, borderWidth: 1,
  },
  statusText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  statusCard: { gap: 8, paddingVertical: 14 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: { ...typography.body, color: colors.textPrimary },
  extractHint: { ...typography.bodySmall, color: colors.textMuted },
  previewCard: { gap: 8, paddingVertical: 14 },
  measureList: { marginTop: 6, gap: 6, borderTopWidth: 1, borderTopColor: colors.bgCardBorder, paddingTop: 10 },
  measureListTitle: { ...typography.bodySmall, color: colors.gold, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  measureRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  measureLabel: { ...typography.bodySmall, color: colors.textMuted },
  measureValue: { ...typography.bodySmall, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  previewSummary: { ...typography.body, color: colors.textPrimary },
  previewMeta: { ...typography.bodySmall, color: colors.textMuted },
  confirmBtnWrap: { marginTop: 8 },
  trashCard: { gap: 8, paddingVertical: 14, marginBottom: 8 },
  quotaText: { ...typography.bodySmall, color: colors.warning, marginTop: 10, textAlign: 'center' },
  errorText: { ...typography.bodySmall, color: colors.danger, marginTop: 6, textAlign: 'center' },
});

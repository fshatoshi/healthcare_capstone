import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Linking, Platform } from 'react-native';
import type { EHRImportResult } from '../../types/ehr.types';

const esc = (value: string): string =>
  value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');

const renderList = (items: string[]): string => {
  if (items.length === 0) return '<li>Aucune donnee</li>';
  return items.map((item) => `<li>${esc(item)}</li>`).join('');
};

const renderMeasurementsTable = (result: EHRImportResult): string => {
  const rows = result.extracted.measurements
    .map((m) => `
      <tr>
        <td>${esc(m.key)}</td>
        <td>${esc(String(m.value))}</td>
        <td>${esc(m.unit || '-')}</td>
        <td>${esc(m.observedAt || '-')}</td>
      </tr>
    `)
    .join('');

  if (!rows) {
    return '<tr><td colspan="4">Aucune mesure extraite</td></tr>';
  }
  return rows;
};

export const buildExtractionReportHtml = (
  logoDataUri: string | null,
  sourceFileName: string,
  result: EHRImportResult
): string => {
  const now = new Date().toLocaleString();
  const confidencePct =
    typeof result.extracted.confidence === 'number'
      ? Math.round(result.extracted.confidence * 100)
      : 0;
  const diagnoses = result.extracted.diagnoses.map((d) =>
    `${d.label}${d.code ? ` (${d.code})` : ''}${d.diagnosedAt ? ` - ${d.diagnosedAt}` : ''}`
  );
  const medications = result.extracted.medications.map((m) =>
    `${m.name}${m.dosage ? `, ${m.dosage}` : ''}${m.frequency ? `, ${m.frequency}` : ''}`
  );
  const measurements = result.extracted.measurements.map((m) =>
    `${m.key}: ${String(m.value)}${m.unit ? ` ${m.unit}` : ''}${m.observedAt ? ` (${m.observedAt})` : ''}`
  );

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; padding: 24px; position: relative; }
          .muted { color: #475569; }
          .card { margin-top: 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; }
          .badge {
            display:inline-block; padding: 6px 10px; border-radius: 999px; color: #fff;
            font-weight:700; font-size: 12px; letter-spacing: .2px;
            background: ${confidencePct >= 75 ? '#16a34a' : confidencePct >= 50 ? '#ca8a04' : '#dc2626'};
          }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
          th, td { border: 1px solid #e2e8f0; text-align: left; padding: 8px; }
          th { background: #f1f5f9; }
          .wm {
            position: fixed; right: 16px; bottom: 12px; color: #94a3b8; font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div style="display:flex; align-items:center; gap:16px; border-bottom: 2px solid #0ea5e9; padding-bottom: 12px;">
          ${
            logoDataUri
              ? `<img src="${logoDataUri}" style="width:64px; height:64px; border-radius:12px; object-fit:cover;" />`
              : '<div style="width:64px; height:64px; border-radius:12px; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700;">HT</div>'
          }
          <div>
            <h1 style="margin:0; color:#0f172a;">HealthTrack AI</h1>
            <p style="margin:2px 0 0; color:#475569;">Rapport d'extraction EHR - ${esc(now)}</p>
          </div>
        </div>

        <div class="card">
          <h2 style="margin:0 0 8px;">Document source</h2>
          <p style="margin:4px 0;"><strong>Nom:</strong> ${esc(sourceFileName)}</p>
          <p style="margin:4px 0;"><strong>Import ID:</strong> ${esc(result.importId)}</p>
          <p style="margin:4px 0;"><strong>Status:</strong> ${esc(result.status)}</p>
          <p style="margin:4px 0;"><strong>Confiance:</strong> ${
          typeof result.extracted.confidence === 'number'
            ? `${Math.round(result.extracted.confidence * 100)}%`
            : 'N/A'
          }</p>
          <span class="badge">Score extraction: ${confidencePct}%</span>
        </div>

        <h2 style="margin-top:16px;">Resume Clinique</h2>
        <p>${esc(result.extracted.summary || 'Aucun resume disponible')}</p>

        <h2 style="margin-top:16px;">Mesures Extraites</h2>
        <table>
          <thead>
            <tr>
              <th>Mesure</th>
              <th>Valeur</th>
              <th>Unite</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${renderMeasurementsTable(result)}
          </tbody>
        </table>
        <p class="muted">${measurements.length} mesure(s) detectee(s).</p>

        <h2 style="margin-top:16px;">Diagnostics</h2>
        <ul>${renderList(diagnoses)}</ul>

        <h2 style="margin-top:16px;">Medicaments</h2>
        <ul>${renderList(medications)}</ul>

        <h2 style="margin-top:16px;">Avertissements</h2>
        <ul>${renderList((result.warnings || []).map(String))}</ul>

        <p style="margin-top: 24px; color:#64748b; font-size: 12px; border-top:1px solid #e2e8f0; padding-top: 10px;">
          Document genere automatiquement par HealthTrack AI.
        </p>
        <div class="wm">HealthTrack AI - Confidentiel</div>
      </body>
    </html>
  `;
};

const toBase64DataUri = async (uri: string, mimeType: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return `data:${mimeType};base64,${base64}`;
};

const getLogoDataUri = async (): Promise<string | null> => {
  try {
    const logoAsset = Asset.fromModule(require('../../../assets/images/logo_app.png'));
    if (!logoAsset.localUri) {
      await logoAsset.downloadAsync();
    }
    const uri = logoAsset.localUri || logoAsset.uri;
    if (!uri) return null;
    return await toBase64DataUri(uri, 'image/png');
  } catch {
    return null;
  }
};

export const createExtractionReportPdf = async (
  sourceFileName: string,
  result: EHRImportResult
): Promise<string> => {
  const logoDataUri = await getLogoDataUri();
  const html = buildExtractionReportHtml(logoDataUri, sourceFileName, result);
  const file = await Print.printToFileAsync({ html });
  return file.uri;
};

export const shareReportPdf = async (uri: string): Promise<void> => {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Partage indisponible sur cet appareil.');
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
};

export const openReportPdf = async (uri: string): Promise<void> => {
  try {
    let targetUri = uri;
    if (Platform.OS === 'android' && uri.startsWith('file://')) {
      targetUri = await FileSystem.getContentUriAsync(uri);
    }
    const canOpen = await Linking.canOpenURL(targetUri);
    if (!canOpen) throw new Error('Aucune application ne peut ouvrir ce PDF.');
    await Linking.openURL(targetUri);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Impossible d ouvrir le PDF.');
  }
};

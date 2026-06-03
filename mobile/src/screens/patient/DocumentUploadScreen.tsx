import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography, radius, spacing } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyDocuments, uploadDocument } from '../../store/slices/healthSlice';
import { GoldButton } from '../../components/common/Buttons';

export const DocumentUploadScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.health);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyDocuments());
  }, []);

  const handlePickDocument = async () => {
    if (documents.length >= 3) {
      Alert.alert('Quota Reached', 'You can only upload up to 3 medical documents for now.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setUploading(true);
        const action = await dispatch(uploadDocument({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          existingCount: documents.length,
        }));

        if (uploadDocument.fulfilled.match(action)) {
          Alert.alert('Success', 'Document uploaded successfully to your file.');
        } else {
          Alert.alert('Error', action.payload as string || 'Failed to upload document.');
        }
        setUploading(false);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred while picking the file.');
      setUploading(false);
    }
  };

  const renderDoc = ({ item }: { item: any }) => (
    <View style={styles.docCard}>
      <View style={styles.docIcon}>
        <Ionicons 
          name={item.fileType?.includes('pdf') ? 'document-text' : 'image'} 
          size={24} 
          color={colors.gold} 
        />
      </View>
      <View style={styles.docInfo}>
        <Text style={styles.docName} numberOfLines={1}>{item.fileName}</Text>
        <Text style={styles.docDate}>{new Date(item.uploadedAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert('View', 'Download link: ' + item.downloadUrl)}>
        <Ionicons name="cloud-download-outline" size={22} color={colors.gold} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.quotaContainer}>
        <View style={styles.quotaHeader}>
          <Text style={styles.quotaTitle}>Your Storage</Text>
          <Text style={styles.quotaText}>{documents.length} / 3 documents used</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(documents.length / 3) * 100}%` }]} />
        </View>
      </View>

      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        renderItem={renderDoc}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={60} color={colors.textMuted} />
            <Text style={styles.emptyText}>No documents uploaded yet.</Text>
            <Text style={styles.emptySub}>Upload your lab results, prescriptions or X-rays.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <GoldButton
          title={uploading ? 'Uploading...' : 'Upload New Document'}
          onPress={handlePickDocument}
          loading={uploading}
          disabled={documents.length >= 3}
          icon="add-circle-outline"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1A9B6C22'
  },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  quotaContainer: { padding: 20, backgroundColor: colors.bgCard, marginBottom: 10 },
  quotaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  quotaTitle: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  quotaText: { ...typography.bodySmall, color: colors.gold },
  progressBar: { height: 8, backgroundColor: colors.bgPrimary, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.gold },
  list: { padding: 20, paddingBottom: 100 },
  docCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard,
    borderRadius: radius.md, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#1A9B6C11'
  },
  docIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docName: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  docDate: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { ...typography.h4, color: colors.textPrimary, marginTop: 16 },
  emptySub: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: colors.bgPrimary, borderTopWidth: 1, borderTopColor: '#1A9B6C22' }
});

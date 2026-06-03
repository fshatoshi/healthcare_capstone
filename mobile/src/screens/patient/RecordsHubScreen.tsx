import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';

interface RecordsHubScreenProps {
  navigation: any;
}

const HubButton: React.FC<{
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  onPress: () => void;
}> = ({ title, subtitle, icon, color, onPress }) => (
  <TouchableOpacity style={styles.hubCard} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.iconContainer, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.hubTitle}>{title}</Text>
      <Text style={styles.hubSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
  </TouchableOpacity>
);

export const RecordsHubScreen: React.FC<RecordsHubScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionDesc}>
          Manage your clinical data, view your history, or upload medical documents to your secure vault.
        </Text>

        <HubButton
          title="Health History"
          subtitle="View and filter all your past medical data"
          icon="time-outline"
          color={colors.secondary}
          onPress={() => navigation.navigate('HealthHistory')}
        />

        <HubButton
          title="Manual Entry"
          subtitle="Add heart rate, blood pressure, or glucose"
          icon="create-outline"
          color={colors.gold}
          onPress={() => navigation.navigate('ManualEntry')}
        />

        <HubButton
          title="Medical Documents"
          subtitle="Upload PDFs or clinical images to MinIO"
          icon="cloud-upload-outline"
          color={colors.info}
          onPress={() => navigation.navigate('DocumentUpload')}
        />

        <HubButton
          title="EHR Import"
          subtitle="Extract structured medical data from documents"
          icon="document-text-outline"
          color={colors.gold}
          onPress={() => navigation.navigate('EHRImport')}
        />

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.infoText}>
            All your data is encrypted and stored securely on your private server.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A9B6C22',
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  scroll: { padding: 20 },
  sectionDesc: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 22,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    padding: 20,
    borderRadius: radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  hubTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 4 },
  hubSubtitle: { ...typography.bodySmall, color: colors.textMuted },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1A9B6C11',
    padding: 16,
    borderRadius: radius.md,
    marginTop: 10,
    alignItems: 'center',
    gap: 12,
  },
  infoText: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
});

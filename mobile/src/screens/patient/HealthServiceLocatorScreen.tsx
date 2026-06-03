import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { GreenCard } from '../../components/common/GreenCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { mockHealthServices } from '../../utils/mockData';

interface HealthServiceLocatorScreenProps {
  navigation: any;
}

export const HealthServiceLocatorScreen: React.FC<HealthServiceLocatorScreenProps> = ({ navigation }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedService = mockHealthServices.find(s => s.id === selected);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Services</Text>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapContent}>
          <Ionicons name="map-outline" size={48} color={colors.greenLight} />
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapSub}>Casablanca, Morocco</Text>
          {/* Fake pins */}
          <View style={[styles.pin, { top: '30%', left: '45%' }]}>
            <Ionicons name="location" size={24} color={colors.gold} />
          </View>
          <View style={[styles.pin, { top: '55%', left: '30%' }]}>
            <Ionicons name="location" size={24} color={colors.greenLight} />
          </View>
          <View style={[styles.pin, { top: '40%', left: '65%' }]}>
            <Ionicons name="location" size={24} color={colors.danger} />
          </View>
          <View style={[styles.pin, { top: '65%', left: '55%' }]}>
            <Ionicons name="location" size={24} color={colors.greenLight} />
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        {selected && selectedService ? (
          <>
            <TouchableOpacity style={styles.closeDetail} onPress={() => setSelected(null)}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.detailName}>{selectedService.name}</Text>
            <Text style={styles.detailType}>{selectedService.type}</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.detailText}>{selectedService.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={14} color={colors.textMuted} />
              <Text style={styles.detailText}>{selectedService.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.statusDot, { backgroundColor: selectedService.open ? colors.success : colors.danger }]} />
              <Text style={styles.detailText}>{selectedService.open ? 'Open now' : 'Closed'}</Text>
              <Text style={styles.detailDist}> • {selectedService.distance}</Text>
            </View>
            <TouchableOpacity style={styles.dirBtn}>
              <Ionicons name="navigate-outline" size={16} color={colors.textDark} />
              <Text style={styles.dirBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </>
        ) : (
          <FlatList
            data={mockHealthServices}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListHeaderComponent={<SectionHeader title="Nearby Services" style={{ marginBottom: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceRow}
                onPress={() => setSelected(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons
                    name={item.type === 'Pharmacy' ? 'medical-outline' : 'business-outline'}
                    size={20}
                    color={colors.gold}
                  />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.serviceType}>{item.type} • {item.distance}</Text>
                </View>
                <View style={[styles.openBadge, { backgroundColor: item.open ? colors.success + '22' : colors.danger + '22', borderColor: item.open ? colors.success + '55' : colors.danger + '55' }]}>
                  <Text style={[styles.openText, { color: item.open ? colors.success : colors.danger }]}>
                    {item.open ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  mapPlaceholder: {
    height: '40%',
    backgroundColor: '#0A1F14',
    borderBottomWidth: 1,
    borderBottomColor: '#1A9B6C33',
    position: 'relative',
    overflow: 'hidden',
  },
  mapContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  mapText: { ...typography.h4, color: colors.greenLight, marginTop: 10 },
  mapSub: { ...typography.bodySmall, color: colors.textMuted },
  pin: { position: 'absolute' },
  bottomSheet: {
    flex: 1, backgroundColor: colors.bgPrimary, padding: 16,
  },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  serviceIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.gold + '1A', justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { ...typography.bodyLarge, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  serviceType: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  openBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, borderWidth: 1,
  },
  openText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  closeDetail: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },
  detailName: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  detailType: { ...typography.bodySmall, color: colors.gold, marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  detailText: { ...typography.body, color: colors.textMuted },
  detailDist: { ...typography.body, color: colors.textMuted },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dirBtn: {
    flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md,
    paddingVertical: 14, marginTop: 16,
  },
  dirBtnText: { ...typography.button, color: colors.textDark, fontWeight: '700' },
});

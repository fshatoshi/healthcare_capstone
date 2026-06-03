import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchDoctorPatients } from '../../store/slices/healthSlice';
import { logout } from '../../store/slices/authSlice';

export const DoctorDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { doctorPatients, loading } = useAppSelector((state) => state.health);
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, []);

  const filteredPatients = doctorPatients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return colors.danger;
      case 'MEDIUM': return colors.gold;
      default: return colors.green;
    }
  };

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id, patientName: `${item.firstName} ${item.lastName}` })}
    >
      <View style={[styles.riskBar, { backgroundColor: getRiskColor(item.riskLevel || 'LOW') }]} />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.patientSub}>{item.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Doctor Portal</Text>
          <Text style={styles.title}>Welcome, Dr. {user?.lastName || 'Medical'}</Text>
        </View>
        <TouchableOpacity onPress={() => dispatch(logout())}>
          <Ionicons name="log-out-outline" size={24} color={colors.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderPatient}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => dispatch(fetchDoctorPatients())}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16 
  },
  greeting: { ...typography.bodySmall, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1 },
  title: { ...typography.h3, color: colors.textPrimary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard,
    marginHorizontal: 20, paddingHorizontal: 12, height: 45, borderRadius: radius.md,
    marginBottom: 20, borderWidth: 1, borderColor: '#1A9B6C22'
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.textPrimary, fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  patientCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard,
    borderRadius: radius.md, marginBottom: 12, overflow: 'hidden',
    paddingRight: 12, borderWidth: 1, borderColor: '#1A9B6C11'
  },
  riskBar: { width: 6, height: '100%' },
  patientInfo: { flex: 1, padding: 16 },
  patientName: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  patientSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.textMuted }
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { SectionHeader } from '../../components/common/SectionHeader';
import { mockAllUsers } from '../../utils/mockData';

interface UserManagementScreenProps {
  navigation: any;
}

type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
type FilterType = 'All' | 'Patients' | 'Doctors' | 'Admins';

const ROLE_COLORS: Record<UserRole, string> = {
  PATIENT: colors.greenLight,
  DOCTOR: colors.info,
  ADMIN: colors.gold,
};

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const FILTERS: FilterType[] = ['All', 'Patients', 'Doctors', 'Admins'];

  const filtered = mockAllUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ? true :
      filter === 'Patients' ? u.role === 'PATIENT' :
      filter === 'Doctors' ? u.role === 'DOCTOR' :
      u.role === 'ADMIN';
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity style={styles.inviteBtn}>
          <Ionicons name="person-add-outline" size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
        renderItem={({ item }) => {
          const initials = item.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('');
          return (
            <View style={styles.userRow}>
              <View style={[styles.avatar, { backgroundColor: ROLE_COLORS[item.role] + '33', borderColor: ROLE_COLORS[item.role] + '66' }]}>
                <Text style={[styles.avatarText, { color: ROLE_COLORS[item.role] }]}>{initials}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userJoined}>Joined {item.joined}</Text>
              </View>
              <View style={styles.rightCol}>
                <View style={[styles.roleBadge, { backgroundColor: ROLE_COLORS[item.role] + '22', borderColor: ROLE_COLORS[item.role] + '55' }]}>
                  <Text style={[styles.roleText, { color: ROLE_COLORS[item.role] }]}>{item.role}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: item.status === 'ACTIVE' ? colors.success : colors.danger }]} />
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  title: { ...typography.h3, color: colors.textPrimary },
  inviteBtn: { padding: 6 },
  searchRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: '#1A9B6C22',
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14 },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C1A',
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    borderWidth: 1, borderColor: '#1A9B6C33',
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { ...typography.bodySmall, color: colors.textMuted },
  chipTextActive: { color: colors.textDark, fontFamily: 'Inter_600SemiBold' },
  list: { padding: 16, paddingBottom: 40 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#1A9B6C1A',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  userInfo: { flex: 1 },
  userName: { ...typography.bodyLarge, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  userEmail: { ...typography.bodyXSmall, color: colors.textMuted, marginTop: 2 },
  userJoined: { ...typography.bodyXSmall, color: colors.textMuted, marginTop: 1 },
  rightCol: { alignItems: 'flex-end', gap: 8 },
  roleBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1,
  },
  roleText: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  statusDot: { width: 9, height: 9, borderRadius: 4.5 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { ...typography.body, color: colors.textMuted },
});
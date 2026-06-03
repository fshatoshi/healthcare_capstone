import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../../theme';
import { GreenCard } from '../../components/common/GreenCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { firstName, lastName, email, role, dob } = useAppSelector(s => s.auth);
  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showSoon = () => {
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  const initials = `${(firstName || 'U')[0]}${(lastName || 'S')[0]}`.toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{firstName} {lastName}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role || 'Patient'}</Text>
          </View>
        </View>

        {/* Info card */}
        <SectionHeader title="Personal Information" />
        <GreenCard>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{email || 'Not verified'}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Ionicons name="calendar-outline" size={18} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{dob || 'Not set'}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <Text style={styles.infoValue}>Member since {new Date().getFullYear()}</Text>
            </View>
          </View>
        </GreenCard>

        {/* Health Documents */}
        <SectionHeader title="Health Records & Documents" style={{ marginTop: 24 }} />
        <GreenCard>
          <TouchableOpacity 
            style={styles.settingRow} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Records', { screen: 'DocumentUpload' })}
          >
            <Ionicons name="folder-open-outline" size={20} color={colors.gold} />
            <Text style={styles.settingText}>Medical Documents (MinIO)</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </GreenCard>

        {/* Settings */}
        <SectionHeader title="Application Settings" style={{ marginTop: 24 }} />
        <GreenCard>
          {[
            { label: 'Notifications', icon: 'notifications-outline' },
            { label: 'Privacy & Security', icon: 'lock-closed-outline' },
            { label: 'Language', icon: 'language-outline' },
            { label: 'About HealthTrack AI', icon: 'information-circle-outline' },
          ].map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.settingRow, i > 0 && styles.infoRowBorder]} 
              activeOpacity={0.7}
              onPress={showSoon}
            >
              <Ionicons name={item.icon as any} size={20} color={colors.greenLight} />
              <Text style={styles.settingText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </GreenCard>

        {/* Luxury Logout Button */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => dispatch(logout())}
          activeOpacity={0.8}
        >
          <View style={styles.logoutInner}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Sign Out of My Account</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.version}>HealthTrack AI v1.0.0</Text>
      </ScrollView>

      {/* Ephemeral Toast */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Ionicons name="sparkles" size={18} color={colors.gold} />
          <Text style={styles.toastText}>Feature coming soon in the next update</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  avatarSection: { alignItems: 'center', marginBottom: 32, gap: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.gold + '22',
    borderWidth: 1, borderColor: colors.gold + '44',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  avatarText: { color: colors.gold, fontSize: 32, fontFamily: 'Inter_700Bold', letterSpacing: 2 },
  name: { ...typography.h3, color: colors.textPrimary, fontSize: 24 },
  roleBadge: {
    backgroundColor: colors.greenLight + '22',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
    borderWidth: 1, borderColor: colors.greenLight + '44',
  },
  roleText: { ...typography.bodyXSmall, color: colors.greenLight, letterSpacing: 1, textTransform: 'uppercase' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: '#1A9B6C1A' },
  infoLabel: { ...typography.bodyXSmall, color: colors.textMuted, marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { ...typography.body, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 },
  settingText: { ...typography.body, color: colors.textPrimary, flex: 1, fontFamily: 'Inter_500Medium' },
  logoutBtn: {
    marginTop: 32, borderRadius: radius.md, overflow: 'hidden',
    backgroundColor: colors.danger + '11',
    borderWidth: 1, borderColor: colors.danger + '33',
  },
  logoutInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16,
  },
  logoutText: { ...typography.button, color: colors.danger, fontFamily: 'Inter_600SemiBold' },
  version: { ...typography.bodyXSmall, textAlign: 'center', marginTop: 24, color: colors.textMuted, opacity: 0.5 },
  toast: {
    position: 'absolute', bottom: 100, left: 30, right: 30,
    backgroundColor: colors.bgCard, borderRadius: 999,
    paddingVertical: 12, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1, borderColor: colors.gold + '44',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15,
  },
  toastText: { ...typography.bodySmall, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
});

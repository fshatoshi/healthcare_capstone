import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { CustomInput } from '../../components/common/CustomInput';
import { GoldButton } from '../../components/common/Buttons';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 fields
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | null>(null);
  const [dob, setDob] = useState('');
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();

    return () => {
      dispatch(clearError());
    };
  }, []);

  const goToStep2 = () => {
    if (!email || !password || !firstName || !lastName) return;
    if (password !== confirmPassword) return;

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(2);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const goToStep1 = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(1);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleFinalRegister = () => {
    if (!role) return;
    
    dispatch(registerUser({
      firstName,
      lastName,
      email,
      password,
      role,
      dob,
      language
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      {/* Watermark */}
      <View style={styles.watermark} pointerEvents="none">
        <Text style={styles.arabesque}>✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}✦ ❂ ✦ ❂ ✦ ❂ ✦</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Back button */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Create Account</Text>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {/* Step indicator */}
            <View style={styles.stepRow}>
              {[1, 2].map(s => (
                <View key={s} style={[styles.stepDot, s === step && styles.stepDotActive]} />
              ))}
            </View>

            {step === 1 ? (
              <>
                <Text style={styles.stepTitle}>Personal Info</Text>
                <CustomInput label="First Name" placeholder="Youssef" value={firstName} onChangeText={setFirstName} containerStyle={{ marginTop: 16 }} />
                <CustomInput label="Last Name" placeholder="Bennani" value={lastName} onChangeText={setLastName} />
                <CustomInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <CustomInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} isPassword />
                <CustomInput label="Confirm Password" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
                
                {error && <Text style={styles.errorInline}>{error}</Text>}
                
                <GoldButton title="Next →" onPress={goToStep2} style={{ marginTop: 8 }} />
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.backStep} onPress={goToStep1}>
                  <Ionicons name="arrow-back" size={18} color={colors.gold} />
                  <Text style={styles.backStepText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.stepTitle}>Your Profile</Text>

                {/* Role selector */}
                <Text style={styles.roleLabel}>I AM A</Text>
                <View style={styles.roleRow}>
                  {(['PATIENT', 'DOCTOR'] as const).map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleCard, role === r && styles.roleCardActive]}
                      onPress={() => setRole(r)}
                    >
                      <Ionicons
                        name={r === 'PATIENT' ? 'person-outline' : 'medical-outline'}
                        size={28}
                        color={role === r ? colors.gold : colors.textMuted}
                      />
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <CustomInput label="Date of Birth" placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} containerStyle={{ marginTop: 16 }} />

                {/* Language preference */}
                <Text style={styles.roleLabel}>LANGUAGE</Text>
                <View style={styles.langRow}>
                  {['EN', 'FR', 'AR'].map(l => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.langBtn, language === l && styles.langBtnActive]}
                      onPress={() => setLanguage(l)}
                    >
                      <Text style={[styles.langText, language === l && styles.langTextActive]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {error && <Text style={styles.errorInline}>{error}</Text>}

                <GoldButton 
                  title="Create Account" 
                  onPress={handleFinalRegister} 
                  loading={loading}
                  style={{ marginTop: 20 }} 
                />
              </>
            )}

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: colors.gold }}>Sign in</Text></Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', opacity: 0.05 },
  arabesque: { color: colors.gold, fontSize: 34, lineHeight: 60, textAlign: 'center', letterSpacing: 20 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  back: { marginTop: 12, marginBottom: 8, width: 40 },
  pageTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 16 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  stepRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A9B6C33' },
  stepDotActive: { backgroundColor: colors.gold, width: 24 },
  stepTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  roleLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.8,
  },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#1A9B6C33',
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  roleCardActive: {
    borderColor: colors.gold,
    backgroundColor: colors.gold + '11',
  },
  roleText: { ...typography.labelSmall, color: colors.textMuted },
  roleTextActive: { color: colors.gold, fontFamily: 'Inter_700Bold' },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  langBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#1A9B6C33',
    backgroundColor: colors.bgPrimary,
  },
  langBtnActive: {
    borderColor: colors.gold,
    backgroundColor: colors.gold + '11',
  },
  langText: { ...typography.bodySmall, color: colors.textMuted },
  langTextActive: { color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  backStep: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backStepText: { ...typography.bodySmall, color: colors.gold },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { ...typography.body, color: colors.textMuted },
  errorInline: {
    color: '#FF453A',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
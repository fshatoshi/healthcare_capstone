import React, { useRef, useEffect, useState } from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, radius, spacing } from '../../theme';
import { CustomInput } from '../../components/common/CustomInput';
import { GoldButton } from '../../components/common/Buttons';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, clearError } from '../../store/slices/authSlice';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, speed: 12, bounciness: 4, useNativeDriver: true,
      }),
    ]).start();
    
    return () => {
      dispatch(clearError());
    };
  }, []);

  const handleLogin = () => {
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.watermark} pointerEvents="none">
        <Text style={styles.arabesque}>
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.topLogo, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo_app.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.wordmark}>HealthTrack</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSub}>Sign in to your account</Text>

            <CustomInput
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ marginTop: 20 }}
            />

            <CustomInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotRow}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <GoldButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>New to HealthTrack? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.langRow}>
            {['EN', 'FR', 'AR'].map((lang, i) => (
              <React.Fragment key={lang}>
                <TouchableOpacity>
                  <Text style={[styles.langText, i === 0 && styles.langActive]}>{lang}</Text>
                </TouchableOpacity>
                {i < 2 && <Text style={styles.langSep}>|</Text>}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  watermark: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.06,
  },
  arabesque: {
    color: colors.gold,
    fontSize: 28,
    lineHeight: 52,
    textAlign: 'center',
    letterSpacing: 18,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  topLogo: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.gold + '44',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 50,
    height: 50,
  },
  wordmark: {
    ...typography.h3,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  cardSub: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    ...typography.bodySmall,
    color: colors.gold,
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  errorText: {
    ...typography.bodySmall,
    color: '#FF453A',
    textAlign: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  registerLink: {
    ...typography.body,
    color: colors.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingBottom: 8,
  },
  langText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  langActive: {
    color: colors.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  langSep: {
    color: '#1A9B6C44',
  },
});
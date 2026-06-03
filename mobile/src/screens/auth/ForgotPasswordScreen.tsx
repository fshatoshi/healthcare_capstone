import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { CustomInput } from '../../components/common/CustomInput';
import { GoldButton } from '../../components/common/Buttons';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      Animated.spring(successScale, {
        toValue: 1, speed: 6, bounciness: 10, useNativeDriver: true,
      }).start();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          {!sent ? (
            <View style={styles.card}>
              {/* Icon */}
              <View style={styles.iconBg}>
                <Ionicons name="key-outline" size={32} color={colors.gold} />
              </View>

              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your registered email address and we'll send you a reset link.
              </Text>

              <CustomInput
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={{ marginTop: 20, marginBottom: 24 }}
              />

              <GoldButton title="Send Reset Link" onPress={handleSend} loading={loading} />

              <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
                <Text style={styles.backLinkText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View style={[styles.card, styles.successCard, { transform: [{ scale: successScale }] }]}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={56} color={colors.success} />
              </View>
              <Text style={styles.title}>Check your inbox</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to{'\n'}
                <Text style={{ color: colors.gold }}>{email || 'your email'}</Text>
              </Text>
              <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={16} color={colors.greenLight} />
                <Text style={styles.tipText}>Check your spam folder if you don't see it within 2 minutes.</Text>
              </View>
              <GoldButton
                title="Back to Sign In"
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: 24 }}
              />
            </Animated.View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  back: { marginBottom: 24, width: 40 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1A9B6C22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  successCard: {
    alignItems: 'center',
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.gold + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 10 },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 4,
    textAlign: 'center',
  },
  backLink: { alignItems: 'center', marginTop: 20 },
  backLinkText: { ...typography.bodySmall, color: colors.textMuted },
  successIcon: { marginBottom: 20 },
  tipBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.greenLight + '11',
    borderRadius: radius.sm,
    padding: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  tipText: { ...typography.bodySmall, color: colors.textMuted, flex: 1, lineHeight: 20 },
});
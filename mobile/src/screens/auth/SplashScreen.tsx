import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '../../theme';
import { useAppSelector } from '../../store';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 8,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // Decide where to go based on auth state
        if (isAuth) {
          navigation.replace('Main');
        } else {
          navigation.replace('Auth');
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuth]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      {/* Arabesque watermark */}
      <View style={styles.watermark} pointerEvents="none">
        <Text style={styles.arabesque}>
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}
          ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦{'\n'}
          ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂{'\n'}
          ✦ ❂ ✦ ❂ ✦ ❂ ✦ ❂ ✦
        </Text>
      </View>

      {/* Logo + text */}
      <Animated.View style={[styles.center, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo_app.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>HealthTrack</Text>
        <Text style={styles.tagline}>Your health. Your data. Your control.</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>Powered by AI • Made for Morocco</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 32,
    lineHeight: 52,
    textAlign: 'center',
    letterSpacing: 20,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.gold + '44',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: colors.bgCard,
  },
  logo: {
    width: 86,
    height: 86,
  },
  appName: {
    ...typography.h1,
    color: colors.gold,
    marginBottom: 10,
    letterSpacing: 1,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    ...typography.bodyXSmall,
    color: colors.textMuted,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../theme';
import { GoldButton } from '../../components/common/Buttons';
import { AIResultCard } from '../../components/common/AIResultCard';
import { mockAIResults } from '../../utils/mockData';

interface SymptomInputScreenProps {
  navigation: any;
}

type InputMode = 'text' | 'voice' | 'image';

export const SymptomInputScreen: React.FC<SymptomInputScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const handleEvaluate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(mockAIResults[0]);
    }, 1500);
  };

  const modes: { key: InputMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { key: 'text', icon: 'keypad-outline', label: 'Text' },
    { key: 'voice', icon: 'mic-outline', label: 'Voice' },
    { key: 'image', icon: 'camera-outline', label: 'Image' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Symptom Check</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Mode selector */}
        <View style={styles.modeBar}>
          {modes.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modeBtn, mode === m.key && styles.modeBtnActive]}
              onPress={() => setMode(m.key)}
            >
              <Ionicons name={m.icon} size={18} color={mode === m.key ? colors.gold : colors.textMuted} />
              <Text style={[styles.modeText, mode === m.key && styles.modeTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {/* Text mode */}
          {mode === 'text' && (
            <View style={styles.textArea}>
              <TextInput
                style={styles.input}
                placeholder="Describe how you feel..."
                placeholderTextColor={colors.textMuted}
                value={text}
                onChangeText={setText}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Voice mode */}
          {mode === 'voice' && (
            <View style={styles.voiceContainer}>
              <Animated.View style={[styles.micOuter, { transform: [{ scale: pulseAnim }] }]}>
                <TouchableOpacity
                  style={[styles.micBtn, isRecording && styles.micBtnRecording]}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Ionicons name={isRecording ? 'stop' : 'mic'} size={40} color={isRecording ? colors.textPrimary : colors.textDark} />
                </TouchableOpacity>
              </Animated.View>
              <Text style={styles.voiceHint}>
                {isRecording ? 'Recording... tap to stop' : 'Tap to start recording'}
              </Text>
              {isRecording && (
                <View style={styles.waveform}>
                  {[8, 14, 20, 14, 26, 18, 12, 24, 16, 10, 22, 16].map((h, i) => (
                    <View key={i} style={[styles.waveBar, { height: h }]} />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Image mode */}
          {mode === 'image' && (
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera-outline" size={40} color={colors.gold} />
                <Text style={styles.cameraText}>Tap to capture</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryBtn}>
                <Ionicons name="images-outline" size={20} color={colors.textMuted} />
                <Text style={styles.galleryText}>Choose from gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* AI Result */}
          {result && (
            <View style={{ marginTop: 16 }}>
              <AIResultCard
                riskLevel={result.riskLevel}
                confidence={result.confidence}
                summary={result.summary}
                recommendations={result.recommendations}
              />
              <GoldButton
                title="Share with Doctor"
                onPress={() => {}}
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </View>

        {/* Evaluate button */}
        {!result && (
          <View style={styles.evalBarInline}>
            <GoldButton
              title="Get AI Evaluation"
              onPress={handleEvaluate}
              loading={loading}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingBottom: 200 },
  header: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C22',
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  modeBar: {
    flexDirection: 'row', padding: 12, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#1A9B6C1A',
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
    borderRadius: radius.sm, borderWidth: 1, borderColor: 'transparent',
  },
  modeBtnActive: {
    borderColor: colors.gold + '66', backgroundColor: colors.gold + '11',
  },
  modeText: { ...typography.bodySmall, color: colors.textMuted },
  modeTextActive: { color: colors.gold, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  textArea: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#1A9B6C33',
    height: 180,
    padding: 16,
  },
  input: {
    flex: 1, color: colors.textPrimary, fontSize: 15, fontFamily: 'Inter_400Regular',
    height: '100%',
  },
  voiceContainer: { alignItems: 'center', paddingVertical: 40, gap: 20 },
  micOuter: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: colors.gold + '22',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.gold + '44',
  },
  micBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  micBtnRecording: { backgroundColor: colors.danger },
  voiceHint: { ...typography.body, color: colors.textMuted },
  waveform: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 30 },
  waveBar: { width: 4, backgroundColor: colors.gold, borderRadius: 2, opacity: 0.8 },
  imageContainer: { alignItems: 'center', paddingVertical: 40, gap: 20 },
  cameraBtn: {
    width: 150, height: 150, borderRadius: radius.xl,
    borderWidth: 2, borderColor: colors.gold + '55',
    backgroundColor: colors.bgCard,
    justifyContent: 'center', alignItems: 'center', gap: 12,
    borderStyle: 'dashed',
  },
  cameraText: { ...typography.bodySmall, color: colors.textMuted },
  galleryBtn: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: radius.sm, borderWidth: 1, borderColor: '#1A9B6C33',
  },
  galleryText: { ...typography.bodySmall, color: colors.textMuted },
  evalBarInline: {
    paddingHorizontal: 16, paddingVertical: 20,
  },
});

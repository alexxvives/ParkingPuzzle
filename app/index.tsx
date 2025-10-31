import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { DailyObjectives } from '../src/components/DailyObjectives';
import { DifficultyModal } from '../src/components/DifficultyModal';
import { BottomTabBar } from '../src/components/BottomTabBar';
import { TrophyIcon, SettingsIcon } from '../src/components/Icons';
import { spacing, typography } from '../src/theme/typography';
import { colors } from '../src/theme/colors';
import { loadProgress, getCurrentLevelData, GameProgress } from '../src/store/progressStore';

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [progress, setProgress] = useState<GameProgress | null>(null);

  // Reload progress when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, [])
  );

  const currentLevelData = progress ? getCurrentLevelData(progress.currentLevel) : null;
  const difficulty = currentLevelData?.id.split('_')[0] || 'easy';

  // Map difficulty to Spanish
  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto',
  };

  const handlePlayCurrentLevel = () => {
    if (currentLevelData) {
      router.push(`/play?level=${currentLevelData.id}`);
    }
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    // Map difficulty to first level ID
    const levelMap = {
      easy: 'easy_001',
      medium: 'medium_001',
      hard: 'hard_001',
      expert: 'expert_001',
    };
    router.push(`/play?level=${levelMap[difficulty]}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header with icons */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <TrophyIcon size={24} color="#8E9AAF" />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => router.push('/settings')}
            >
              <SettingsIcon size={24} color="#8E9AAF" />
            </Pressable>
          </View>
        </View>

        {/* Main content - no scroll */}
        <View style={styles.content}>
          {/* Daily Objectives */}
          <View style={styles.objectivesContainer}>
            <DailyObjectives />
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Parking Puzzle</Text>
            <Text style={styles.logoSubtext}>🚗 Saca el coche rojo</Text>
          </View>

          {/* New Game Button - Dynamic Level */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.newGameButton,
                pressed && styles.newGameButtonPressed,
              ]}
              onPress={handlePlayCurrentLevel}
            >
              <Text style={styles.newGameButtonText}>
                Level {progress?.currentLevel || 1}
              </Text>
              <Text style={styles.difficultyText}>
                {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </Text>
            </Pressable>

            {/* Choose Difficulty Button */}
            <Pressable
              style={({ pressed }) => [
                styles.chooseDifficultyButton,
                pressed && styles.chooseDifficultyButtonPressed,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.chooseDifficultyText}>
                Choose Difficulty
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom Tab Bar */}
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Difficulty Modal */}
        <DifficultyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectDifficulty={handleDifficultySelect}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingBottom: spacing.lg,
  },
  objectivesContainer: {
    marginVertical: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1A1D1F',
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  logoSubtext: {
    fontSize: typography.lg,
    color: colors.light.textSecondary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
    borderRadius: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newGameButtonPressed: {
    backgroundColor: '#1E7FD9',
    transform: [{ scale: 0.98 }],
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: typography.xl,
    fontWeight: 'bold',
  },
  difficultyText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.sm,
    fontWeight: '500',
    marginTop: 4,
  },
  chooseDifficultyButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.light.primary,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  chooseDifficultyButtonPressed: {
    backgroundColor: 'rgba(46, 155, 255, 0.1)',
    transform: [{ scale: 0.98 }],
  },
  chooseDifficultyText: {
    color: colors.light.primary,
    fontSize: typography.base,
    fontWeight: '600',
  },
});

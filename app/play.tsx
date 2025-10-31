import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Grid } from '../src/components/Grid';
import { Vehicle } from '../src/components/Vehicle';
import { StarRating } from '../src/components/StarRating';
import { spacing, typography } from '../src/theme/typography';
import { getLevelById } from '../src/data';
import { isSolved, canMove, applyMove } from '../src/logic/moveEngine';
import { calculateStars } from '../src/logic/scoring';
import { loadProgress, completeLevel } from '../src/store/progressStore';
import Svg, { Path } from 'react-native-svg';

export default function PlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const levelId = typeof params.level === 'string' ? params.level : 'easy_001';

  const level = getLevelById(levelId);
  
  if (!level) {
    return (
      <Screen style={styles.container}>
        <Text style={styles.errorText}>Level not found</Text>
      </Screen>
    );
  }

  const [vehicles, setVehicles] = useState(level.vehicles);
  const [moves, setMoves] = useState(0);
  const [currentLevelNumber, setCurrentLevelNumber] = useState(1);

  // Load current level number from progress
  useEffect(() => {
    loadProgress().then((progress) => {
      setCurrentLevelNumber(progress.currentLevel);
    });
  }, []);

  // Determine difficulty from level id
  const difficulty = level.id.split('_')[0] as 'easy' | 'medium' | 'hard' | 'expert';

  // Map difficulty to Spanish
  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto',
  };

  // Calculate cellSize based on grid size to fit screen
  // Max width available with reduced padding
  const getCellSize = (gridSize: number) => {
    const maxWidth = 310; // Increased from 280 to reduce side margins
    const cellSize = Math.floor(maxWidth / gridSize);
    // Ensure minimum 23px for small grids, maximum 55px for large grids
    return Math.min(Math.max(cellSize, 23), 55);
  };

  const cellSize = getCellSize(level.size);

  const handleVehicleMove = useCallback((vehicleId: string, delta: number) => {
    setVehicles((currentVehicles) => {
      // Check if move is valid
      if (!canMove(vehicleId, delta, currentVehicles, level.size)) {
        return currentVehicles;
      }
      
      // Apply move
      const newVehicles = applyMove(vehicleId, delta, currentVehicles);
      setMoves((m) => m + 1);
      
      // Check if won
      setTimeout(async () => {
        if (isSolved(newVehicles, level.exit)) {
          const stars = calculateStars(moves + 1, level.optimalMoves || moves + 1);
          
          // Save progress
          await completeLevel(level.id, moves + 1, stars);
          
          Alert.alert(
            '🎉 ¡Victoria!',
            `¡Completaste el nivel en ${moves + 1} movimientos!\nEstrellas: ${'⭐'.repeat(stars)}`,
            [
              { text: 'Siguiente Nivel', onPress: () => router.back() },
            ]
          );
        }
      }, 100);
      
      return newVehicles;
    });
  }, [level.size, level.exit, level.optimalMoves, moves, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Screen style={styles.container}>
        {/* Top Bar - Back Arrow + Level Info + Stars + Moves Counter */}
        <View style={styles.topBar}>
          {/* Back Arrow - Absolute Left */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Svg width={32} height={32} viewBox="0 0 24 24">
              <Path
                d="M15 18L9 12L15 6"
                stroke="#2E9BFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>

          {/* Level + Difficulty (Top Center) */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelNumber}>Level {currentLevelNumber}</Text>
            <Text style={styles.difficultyLabel}>{difficultyLabels[difficulty]}</Text>
          </View>

          {/* Settings Button - Absolute Right */}
          <Pressable style={styles.settingsButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="#2E9BFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="#2E9BFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
        </View>

        {/* Main Content Area - Centered */}
        <View style={styles.mainContent}>
          {/* Game Board */}
          <View style={styles.gameArea}>
          <Grid size={level.size} cellSize={cellSize} difficulty={difficulty}>
            {vehicles.map((vehicle) => (
              <Vehicle 
                key={vehicle.id} 
                vehicle={vehicle} 
                cellSize={cellSize}
                gridSize={level.size}
                allVehicles={vehicles}
                onMove={handleVehicleMove}
              />
            ))}
          </Grid>
          
          {/* Stars & Moves - Positioned above grid */}
          <View style={styles.starsDisplayAboveGrid}>
            <View style={styles.starsMovesContainer}>
              <View style={styles.movesBox}>
                <Text style={styles.movesNumber}>{moves}</Text>
              </View>
              <View style={styles.starsDivider} />
              <StarRating currentMoves={moves} optimalMoves={level.optimalMoves || 10} size={28} />
            </View>
          </View>
        </View>

        {/* Stars Thresholds Map (Bottom) */}
        <View style={styles.mapSection}>
          <View style={styles.mapRow}>
            <View style={styles.thresholdsContainer}>
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdStars}>★★★</Text>
                <Text style={styles.thresholdMoves}>{level.optimalMoves || 10}</Text>
                <Text style={styles.thresholdLabel}>moves</Text>
              </View>
              <View style={styles.thresholdDivider} />
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdStars}>★★</Text>
                <Text style={styles.thresholdMoves}>{Math.ceil((level.optimalMoves || 10) * 1.3)}</Text>
                <Text style={styles.thresholdLabel}>moves</Text>
              </View>
              <View style={styles.thresholdDivider} />
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdStars}>★</Text>
                <Text style={styles.thresholdMoves}>{Math.ceil((level.optimalMoves || 10) * 1.7)}</Text>
                <Text style={styles.thresholdLabel}>moves</Text>
              </View>
            </View>

            {/* Hint Button */}
            <Pressable 
              style={styles.hintButton}
              onPress={() => Alert.alert('💡 Pistas', 'Próximamente...')}
            >
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path
                  d="M9 21h6M12 3a6 6 0 0 1 4.472 10.024c-.94.94-1.472 2.217-1.472 3.552V18H9v-1.424c0-1.335-.532-2.613-1.472-3.552A6 6 0 0 1 12 3z"
                  stroke="#2E9BFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              {/* Hint Counter Badge */}
              <View style={styles.hintBadge}>
                <Text style={styles.hintBadgeText}>1</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Ad Placeholder - Footer */}
      <View style={styles.adContainer}>
        <View style={styles.adPlaceholder}>
          <Text style={styles.adText}>Advertisement</Text>
          <Text style={styles.adDimensions}>320 × 50</Text>
        </View>
      </View>

      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  // Main Content Area
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  // Top Bar
  topBar: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    minHeight: 60,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  levelInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  difficultyLabel: {
    fontSize: 11,
    color: '#8E9AAF',
    fontWeight: '500',
    marginBottom: 0,
  },
  starsDisplayAboveGrid: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  starsMovesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderRadius: 24,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  movesBox: {
    backgroundColor: '#2E9BFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movesNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  starsDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D0D5DD',
  },
  movesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E9AAF',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  settingsButton: {
    position: 'absolute',
    right: spacing.md,
    top: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  hintButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#2E9BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: spacing.md,
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E9BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hintBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Game Area
  gameArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.lg,
    position: 'relative',
  },
  mapSection: {
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
    marginBottom: 0,
  },
  mapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thresholdsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8EAED',
    shadowColor: '#2E9BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    gap: spacing.sm,
  },
  thresholdItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  thresholdStars: {
    fontSize: 18,
    color: '#2E9BFF',
    marginBottom: 6,
  },
  thresholdMoves: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D29',
    marginBottom: 6,
  },
  thresholdLabel: {
    fontSize: 10,
    color: '#8E9AAF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  thresholdDivider: {
    width: 2,
    height: 45,
    backgroundColor: '#E8EAED',
  },
  // Ad Placeholder
  adContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  adPlaceholder: {
    height: 50,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E9AAF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adDimensions: {
    fontSize: 9,
    color: '#B0B5BD',
    marginTop: 2,
  },
});

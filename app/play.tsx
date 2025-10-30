import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Grid } from '../src/components/Grid';
import { Vehicle } from '../src/components/Vehicle';
import { colors } from '../src/theme/colors';
import { spacing, typography } from '../src/theme/typography';
import { getLevelById } from '../src/data';
import { isSolved, canMove, applyMove } from '../src/logic/moveEngine';
import { calculateStars } from '../src/logic/scoring';

export default function PlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const levelId = typeof params.level === 'string' ? params.level : 'easy_001';
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];

  const level = getLevelById(levelId);
  
  if (!level) {
    return (
      <Screen style={styles.container}>
        <Text style={{ color: themeColors.text }}>Level not found</Text>
      </Screen>
    );
  }

  const [vehicles, setVehicles] = useState(level.vehicles);
  const [moves, setMoves] = useState(0);

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
      setTimeout(() => {
        if (isSolved(newVehicles, level.exit)) {
          const stars = calculateStars(moves + 1, level.optimalMoves || moves + 1);
          Alert.alert(
            '🎉 ¡Victoria!',
            `¡Completaste el nivel en ${moves + 1} movimientos!\nEstrellas: ${'⭐'.repeat(stars)}`,
            [
              { text: 'Siguiente Nivel', onPress: () => router.back() },
              { text: 'Reintentar', onPress: handleRestart },
            ]
          );
        }
      }, 100);
      
      return newVehicles;
    });
  }, [level.size, level.exit, level.optimalMoves, moves, router]);

  const checkWin = useCallback(() => {
    if (isSolved(vehicles, level.exit)) {
      const stars = calculateStars(moves, level.optimalMoves || moves);
      Alert.alert(
        '🎉 ¡Victoria!',
        `¡Completaste el nivel en ${moves} movimientos!\nEstrellas: ${'⭐'.repeat(stars)}`,
        [
          { text: 'Siguiente Nivel', onPress: () => router.back() },
          { text: 'Reintentar', onPress: handleRestart },
        ]
      );
    } else {
      Alert.alert('🤔', 'El coche rojo aún no ha llegado a la salida. ¡Sigue intentando!');
    }
  }, [vehicles, level.exit, level.optimalMoves, moves, router]);

  const handleRestart = useCallback(() => {
    setVehicles(level.vehicles);
    setMoves(0);
  }, [level.vehicles]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Screen style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            ← Back
          </Button>
          <View style={styles.stats}>
            <Text style={[styles.statsText, { color: themeColors.text }]}>
              Moves: {moves}
            </Text>
            {level.optimalMoves && (
              <Text style={[styles.statsText, { color: themeColors.textSecondary }]}>
                Best: {level.optimalMoves}
              </Text>
            )}
          </View>
        </View>

      {/* Game Board */}
      <View style={styles.gameArea}>
        <Text style={[styles.levelTitle, { color: themeColors.text }]}>
          {level.title || level.id}
        </Text>
        
        <Grid size={level.size} cellSize={50}>
          {vehicles.map((vehicle) => (
            <Vehicle 
              key={vehicle.id} 
              vehicle={vehicle} 
              cellSize={50}
              gridSize={level.size}
              allVehicles={vehicles}
              onMove={handleVehicleMove}
            />
          ))}
        </Grid>

        <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
          Drag vehicles to move them. Get the red car to the exit!
        </Text>
      </View>

        {/* Bottom Actions */}
        <View style={styles.bottomBar}>
          <Button variant="secondary" onPress={handleRestart}>
            Restart
          </Button>
          <Button onPress={checkWin}>
            Check Solution
          </Button>
        </View>
      </Screen>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsText: {
    fontSize: typography.base,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  levelTitle: {
    fontSize: typography['2xl'],
    fontWeight: 'bold',
  },
  hint: {
    fontSize: typography.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

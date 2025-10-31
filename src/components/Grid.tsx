import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GridProps {
  size: number;
  cellSize?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  children?: React.ReactNode;
}

// Color azul principal usado por las estrellas y la app
const BRAND_BLUE = '#2E9BFF';

export function Grid({ size, cellSize = 50, difficulty = 'easy', children }: GridProps) {
  const gridSize = size * cellSize;
  
  // Convert millimeters to dp: 1 inch = 25.4 mm, baseline density = 160 dp/inch
  const mmToDp = (mm: number) => Math.round((mm / 25.4) * 160);
  // Requested: 10% thinner than 2 mm => 1.8 mm border width
  const borderWidth = mmToDp(1.8);

  return (
    <View
      style={[
        styles.outerContainer,
        {
          width: gridSize + borderWidth * 2,
          height: gridSize + borderWidth * 2,
          backgroundColor: '#FFFFFF',
          borderColor: BRAND_BLUE,
          borderWidth,
        },
      ]}
    >
      {/* Grid interior blanco */}
      <View
        style={[
          styles.innerContainer,
          {
            width: gridSize,
            height: gridSize,
          },
        ]}
      >
        {/* Fondo blanco limpio */}
        <View style={[styles.whiteBackground, { width: gridSize, height: gridSize }]} />

        {/* Grid cells (líneas divisorias sutiles) */}
        <View style={styles.grid}>
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => (
              <View
                key={`${row}-${col}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                  },
                ]}
              />
            ))
          )}
        </View>

        {/* Vehicles layer */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  innerContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  whiteBackground: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#E8E8E8', // Líneas sutiles gris claro
    backgroundColor: 'transparent',
  },
});

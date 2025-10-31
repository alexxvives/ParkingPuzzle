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
  
  // 1 cm ≈ 63 dp (160 dp per inch, 1 cm = 0.3937 inches)
  const borderWidth = 63;

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

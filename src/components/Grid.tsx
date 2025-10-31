import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GridProps {
  size: number;
  cellSize?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  exitY?: number; // 0-indexed row where the exit notch should appear on the right border
  children?: React.ReactNode;
}

// Color azul principal usado por las estrellas y la app
const BRAND_BLUE = '#2E9BFF';

export function Grid({ size, cellSize = 50, difficulty = 'easy', exitY, children }: GridProps) {
  const gridSize = size * cellSize;
  
  // Convert millimeters to dp: 1 inch = 25.4 mm, baseline density = 160 dp/inch
  const mmToDp = (mm: number) => Math.round((mm / 25.4) * 160);
  // Requested: 10% thinner than 2 mm => 1.8 mm border width
  const borderWidth = mmToDp(1.8);
  const exitLineLength = Math.max(12, Math.round(cellSize * 0.35));
  const exitLineThickness = Math.max(2, Math.round(borderWidth * 0.3));
  const exitLineYOffset = Math.round(cellSize * 0.1);

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
      {/* Exit notch on the right border aligned to exitY row */}
      {typeof exitY === 'number' && exitY >= 0 && exitY < size && (
        <>
          {/* Notch: white gap in the right border aligned to exit row */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: 0,
              top: borderWidth + exitY * cellSize,
              width: borderWidth,
              height: cellSize,
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* Two small blue lines extending to the right from the notch corners */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: -exitLineLength,
              top: borderWidth + exitY * cellSize - Math.round(exitLineThickness / 2) - exitLineYOffset,
              width: exitLineLength,
              height: exitLineThickness,
              backgroundColor: BRAND_BLUE,
              borderRadius: exitLineThickness / 2,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: -exitLineLength,
              top: borderWidth + (exitY + 1) * cellSize - Math.round(exitLineThickness / 2) - exitLineYOffset,
              width: exitLineLength,
              height: exitLineThickness,
              backgroundColor: BRAND_BLUE,
              borderRadius: exitLineThickness / 2,
            }}
          />
        </>
      )}

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
    overflow: 'visible',
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

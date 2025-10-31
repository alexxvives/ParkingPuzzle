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
  const exitLineThickness = mmToDp(1.8); // exact requested thickness

  return (
    <View
      style={[
        styles.outerContainer,
        {
          width: gridSize + borderWidth * 2,
          height: gridSize + borderWidth * 2,
          backgroundColor: '#FFFFFF',
        },
      ]}
    >
      {/* Custom borders to allow a right-side gap (exit notch) */}
      {/* Top border */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, top: 0, width: gridSize + borderWidth * 2, height: borderWidth, backgroundColor: BRAND_BLUE }}
      />
      {/* Left border */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, top: 0, width: borderWidth, height: gridSize + borderWidth * 2, backgroundColor: BRAND_BLUE }}
      />
      {/* Bottom border */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, bottom: 0, width: gridSize + borderWidth * 2, height: borderWidth, backgroundColor: BRAND_BLUE }}
      />
      {/* Right border split into two segments to create a white notch at exitY */}
      {typeof exitY === 'number' && exitY >= 0 && exitY < size ? (
        <>
          {/* Right upper segment */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', right: 0, top: 0, width: borderWidth, height: borderWidth + exitY * cellSize, backgroundColor: BRAND_BLUE }}
          />
          {/* Right lower segment */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', right: 0, top: borderWidth + (exitY + 1) * cellSize, width: borderWidth, height: gridSize + borderWidth * 2 - (borderWidth + (exitY + 1) * cellSize), backgroundColor: BRAND_BLUE }}
          />

          {/* Exit guide lines aligned exactly with the grid row borders */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: -exitLineLength,
              top: borderWidth + exitY * cellSize - Math.round(exitLineThickness / 2),
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
              top: borderWidth + (exitY + 1) * cellSize - Math.round(exitLineThickness / 2),
              width: exitLineLength,
              height: exitLineThickness,
              backgroundColor: BRAND_BLUE,
              borderRadius: exitLineThickness / 2,
            }}
          />
        </>
      ) : (
        // Full right border if no exitY provided
        <View
          pointerEvents="none"
          style={{ position: 'absolute', right: 0, top: 0, width: borderWidth, height: gridSize + borderWidth * 2, backgroundColor: BRAND_BLUE }}
        />
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

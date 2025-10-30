import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

interface GridProps {
  size: number;
  cellSize?: number;
  children?: React.ReactNode;
}

export function Grid({ size, cellSize = 50, children }: GridProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];
  const gridSize = size * cellSize;

  return (
    <View style={[styles.container, { width: gridSize, height: gridSize }]}>
      {/* Grid background */}
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
                  borderColor: themeColors.border,
                },
              ]}
            />
          ))
        )}
      </View>
      {/* Vehicles layer */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderWidth: 0.5,
  },
});

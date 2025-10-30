import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/typography';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.surface },
        shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: 16,
  },
});

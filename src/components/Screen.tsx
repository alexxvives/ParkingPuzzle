import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Screen({ children, style }: ScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

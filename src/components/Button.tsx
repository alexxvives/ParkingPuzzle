import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography, borderRadius, shadows } from '../theme/typography';

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];

  const buttonStyles: ViewStyle[] = [
    styles.base,
    {
      backgroundColor:
        variant === 'primary'
          ? themeColors.primary
          : variant === 'secondary'
          ? themeColors.surface
          : 'transparent',
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: themeColors.border,
    },
    ...(size === 'sm' ? [styles.sm] : []),
    ...(size === 'lg' ? [styles.lg] : []),
    ...(variant === 'primary' ? [shadows.md] : []),
    ...(disabled ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    {
      color:
        variant === 'primary'
          ? '#FFFFFF'
          : variant === 'secondary'
          ? themeColors.text
          : themeColors.primary,
      fontSize: size === 'sm' ? typography.sm : size === 'lg' ? typography.lg : typography.base,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography } from '../theme/typography';

interface EventCardProps {
  title: string;
  emoji: string;
  label: string;
  timer: string;
  coins: number;
  gradient: [string, string];
  onPress: () => void;
}

export function EventCard({
  title,
  emoji,
  label,
  timer,
  coins,
  gradient,
  onPress,
}: EventCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* Header with timer and coins */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⏰ {timer}</Text>
          </View>
          <View style={styles.coinBadge}>
            <Text style={styles.coinText}>🪙 {coins}</Text>
          </View>
        </View>

        {/* Emoji icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Label and Title */}
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.title}>{title}</Text>

          {/* Play Button */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Jugar</Text>
            </View>
          </View>
        </View>

        {/* Decorative elements at bottom */}
        <View style={styles.decoration} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 360,
    marginHorizontal: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: typography.sm,
    fontWeight: '600',
  },
  coinBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  coinText: {
    color: '#fff',
    fontSize: typography.sm,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  emoji: {
    fontSize: 80,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    color: '#fff',
    fontSize: typography['2xl'],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: '#2E9BFF',
  },
  decoration: {
    height: 40,
  },
});

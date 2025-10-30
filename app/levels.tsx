import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { colors } from '../src/theme/colors';
import { spacing, typography } from '../src/theme/typography';
import { packs } from '../src/data';

export default function LevelsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => router.back()}>
          ← Back
        </Button>
        <Text style={[styles.title, { color: themeColors.text }]}>Levels</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {packs.map((pack) => (
          <Card key={pack.id} style={styles.packCard}>
            <Text style={[styles.packTitle, { color: themeColors.text }]}>
              {pack.title}
            </Text>
            <Text style={[styles.packInfo, { color: themeColors.textSecondary }]}>
              {pack.levels.length} levels • {pack.difficulty}
            </Text>
            <View style={styles.levelGrid}>
              {pack.levels.map((levelId, index) => (
                <Button
                  key={levelId}
                  variant="secondary"
                  size="sm"
                  onPress={() => router.push(`/play?level=${levelId}`)}
                >
                  {index + 1}
                </Button>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  packCard: {
    marginBottom: spacing.md,
  },
  packTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  packInfo: {
    fontSize: typography.sm,
    marginBottom: spacing.md,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

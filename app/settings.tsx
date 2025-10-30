import React from 'react';
import { View, Text, StyleSheet, Switch, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { colors } from '../src/theme/colors';
import { spacing, typography } from '../src/theme/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = colors[colorScheme];
  const [hapticsEnabled, setHapticsEnabled] = React.useState(true);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => router.back()}>
          ← Back
        </Button>
        <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.section}>
          <View style={styles.setting}>
            <View>
              <Text style={[styles.settingTitle, { color: themeColors.text }]}>
                Haptic Feedback
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                Vibrate on moves
              </Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: themeColors.disabled, true: themeColors.primary }}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            About
          </Text>
          <Text style={[styles.aboutText, { color: themeColors.textSecondary }]}>
            Parking Puzzle v1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: themeColors.textSecondary }]}>
            A minimalist puzzle game inspired by Nanogram
          </Text>
        </Card>
      </View>
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
  section: {
    marginBottom: spacing.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDesc: {
    fontSize: typography.sm,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  aboutText: {
    fontSize: typography.sm,
    marginBottom: spacing.xs,
  },
});

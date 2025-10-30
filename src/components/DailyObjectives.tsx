import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography, shadows } from '../theme/typography';
import { colors } from '../theme/colors';

interface ObjectiveItemProps {
  label: string;
  completed: number;
  total: number;
}

function ObjectiveItem({ label, completed, total }: ObjectiveItemProps) {
  return (
    <View style={styles.objectiveItem}>
      <Text style={styles.objectiveCount}>
        {completed}/{total}
      </Text>
      <Text style={styles.objectiveLabel}>{label}</Text>
    </View>
  );
}

export function DailyObjectives() {
  const objectives = [
    { label: 'Cualquier nivel', completed: 0, total: 1 },
    { label: 'Niveles de evento', completed: 0, total: 1 },
    { label: 'Niveles diarios', completed: 0, total: 1 },
  ];

  const totalProgress = objectives.reduce((acc, obj) => acc + obj.completed, 0);
  const totalObjectives = objectives.reduce((acc, obj) => acc + obj.total, 0);
  const progressPercent = (totalProgress / totalObjectives) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Objetivos de hoy</Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱️ 3h 47m</Text>
        </View>
      </View>

      {/* Objectives Grid */}
      <View style={styles.objectivesGrid}>
        {objectives.map((obj, index) => (
          <ObjectiveItem key={index} {...obj} />
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>0%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.giftIcon}>🎁</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F8',
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.text,
  },
  timerBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: typography.xs,
    color: '#F57C00',
    fontWeight: '600',
  },
  objectivesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  objectiveItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBED',
  },
  objectiveCount: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 2,
  },
  objectiveLabel: {
    fontSize: 11,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressText: {
    fontSize: typography.base,
    fontWeight: 'bold',
    color: colors.light.text,
    minWidth: 35,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E8EBED',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  giftIcon: {
    fontSize: typography.xl,
  },
});

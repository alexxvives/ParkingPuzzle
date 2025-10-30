import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { spacing, typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface DifficultyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
}

export function DifficultyModal({
  visible,
  onClose,
  onSelectDifficulty,
}: DifficultyModalProps) {
  const difficulties = [
    { key: 'easy' as const, label: 'Fácil', color: '#4CAF50' },
    { key: 'medium' as const, label: 'Medio', color: '#2E9BFF' },
    { key: 'hard' as const, label: 'Difícil', color: '#FF9800' },
    { key: 'expert' as const, label: 'Experto', color: '#F44336' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              {difficulties.map((diff, index) => (
                <React.Fragment key={diff.key}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.option,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => {
                      onSelectDifficulty(diff.key);
                      onClose();
                    }}
                  >
                    <Text style={[styles.optionText, { color: diff.color }]}>
                      {diff.label}
                    </Text>
                  </Pressable>
                  {index < difficulties.length - 1 && <View style={styles.separator} />}
                </React.Fragment>
              ))}

              {/* Separator before cancel */}
              <View style={styles.separator} />

              {/* Cancel button */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={onClose}
              >
                <Text style={[styles.optionText, styles.cancelText]}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  option: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionPressed: {
    backgroundColor: '#F5F6F8',
  },
  optionText: {
    fontSize: typography.xl,
    fontWeight: '400',
  },
  cancelText: {
    color: colors.light.textSecondary,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8EBED',
  },
});

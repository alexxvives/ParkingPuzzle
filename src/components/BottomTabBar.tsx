import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, typography } from '../theme/typography';
import { HomeIcon, CalendarIcon, ChecklistIcon } from './Icons';
import { colors } from '../theme/colors';

interface TabItem {
  key: string;
  label: string;
  icon: 'home' | 'calendar' | 'checklist';
  active: boolean;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const tabs: Omit<TabItem, 'active'>[] = [
    { key: 'home', label: 'Inicio', icon: 'home' },
    { key: 'daily', label: 'Desafíos diarios', icon: 'calendar' },
    { key: 'collection', label: 'Mi colección', icon: 'checklist' },
  ];

  const renderIcon = (iconType: 'home' | 'calendar' | 'checklist', isActive: boolean) => {
    const color = isActive ? colors.light.primary : '#8E9AAF';
    const size = 24;
    
    switch (iconType) {
      case 'home':
        return <HomeIcon size={size} color={color} />;
      case 'calendar':
        return <CalendarIcon size={size} color={color} />;
      case 'checklist':
        return <ChecklistIcon size={size} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.sm }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
          >
            {renderIcon(tab.icon, isActive)}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EBED',
    paddingBottom: 0,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.xs,
    color: '#8E9AAF',
    fontWeight: '500',
  },
  labelActive: {
    color: '#2E9BFF',
    fontWeight: '600',
  },
});

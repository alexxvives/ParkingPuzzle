// Paleta inspirada en Nanogram.com
export const colors = {
  light: {
    // Backgrounds
    background: '#F5F6F8',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F2F5',
    
    // Brand - Azul Nanogram
    primary: '#2E9BFF',
    primaryDark: '#1E7FE0',
    primaryLight: '#5AB2FF',
    
    // Semantic
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    
    // Text
    text: '#1A1D1F',
    textSecondary: '#6F7985',
    textTertiary: '#9EA4AA',
    
    // UI Elements
    border: '#E4E7EC',
    divider: '#EFEFEF',
    disabled: '#D1D5DB',
    
    // Vehicle colors
    redCar: '#FFD700', // Dorado para el coche principal
    car1: '#3B82F6',
    car2: '#10B981',
    car3: '#F59E0B',
    car4: '#8B5CF6',
    car5: '#EC4899',
    truck1: '#6366F1',
    truck2: '#14B8A6',
  },
  dark: {
    // Backgrounds
    background: '#0F1115',
    surface: '#1A1D23',
    surfaceSecondary: '#25282E',
    
    // Brand
    primary: '#5AB2FF',
    primaryDark: '#2E9BFF',
    primaryLight: '#7EC4FF',
    
    // Semantic
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    
    // Text
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    
    // UI Elements
    border: '#2D3139',
    divider: '#363A42',
    disabled: '#4B5563',
    
    // Vehicle colors
    redCar: '#EF4444',
    car1: '#60A5FA',
    car2: '#34D399',
    car3: '#FBBF24',
    car4: '#A78BFA',
    car5: '#F472B6',
    truck1: '#818CF8',
    truck2: '#2DD4BF',
  },
};

export type ColorScheme = keyof typeof colors;
export type Colors = typeof colors.light;

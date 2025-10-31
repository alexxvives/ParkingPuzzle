import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GridProps {
  size: number;
  cellSize?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  children?: React.ReactNode;
}

// Frame images by difficulty
const FRAME_IMAGES: Record<string, any> = {
  easy: require('../assets/frames/wood_frame.png'),
  medium: require('../assets/frames/bronze_frame.png'),
  hard: require('../assets/frames/silver_frame.png'),
  expert: require('../assets/frames/gold_frame.png'),
};

// Paleta de colores realistas por temática
const THEME_COLORS = {
  easy: {
    // Madera roble natural con vetas realistas
    borderGradient: [
      '#C9A66B', // Tono claro (parte superior iluminada)
      '#B8956A', // Tono medio
      '#A8875C', // Transición
      '#9A7A50', // Más oscuro
      '#8B6F47', // Base oscura
    ],
    woodGrain1: ['rgba(139, 111, 71, 0.3)', 'transparent', 'rgba(139, 111, 71, 0.2)'], // Vetas oscuras
    woodGrain2: ['transparent', 'rgba(212, 165, 116, 0.4)', 'transparent'], // Vetas claras
    borderHighlight: 'rgba(232, 201, 160, 0.6)', // Brillo suave
    borderShadow: 'rgba(80, 65, 45, 0.5)', // Sombra suave
    woodKnots: '#7A5F3D', // Nudos de madera
  },
  medium: {
    // Bronce metálico
    borderGradient: ['#CD7F32', '#B8722D', '#8B5A2B'], // Degradado bronce
    borderHighlight: '#E6944D', // Brillo metálico
    borderShadow: '#5C3D1F', // Sombra oscura
  },
  hard: {
    // Plata cromada
    borderGradient: ['#E8E8E8', '#C0C0C0', '#A0A0A0'], // Degradado plata
    borderHighlight: '#FFFFFF', // Brillo cromado
    borderShadow: '#707070', // Sombra metálica
  },
  expert: {
    // Oro brillante
    borderGradient: ['#FFD700', '#FFC700', '#DAA520'], // Degradado oro
    borderHighlight: '#FFED4E', // Brillo dorado
    borderShadow: '#B8860B', // Sombra dorada
  },
};

export function Grid({ size, cellSize = 50, difficulty = 'easy', children }: GridProps) {
  const gridSize = size * cellSize;
  const theme = THEME_COLORS[difficulty];
  
  // Cropped frame: 611x630px with 100px border thickness
  // Calculate proportional border for display
  const framePNGSize = 611; // Inner dimension of cropped frame
  const frameThickness = 100; // Actual thickness in PNG (back to original)
  const borderWidth = Math.round((frameThickness / (framePNGSize + frameThickness * 2)) * gridSize * 0.75);
  
  const frameImage = FRAME_IMAGES[difficulty];
  
  // Calculate frame image size (shrunk 3x)
  const totalSize = gridSize + borderWidth * 2; // Total container size
  const frameImageSize = totalSize; // Shrink image to 1/3 size
  const frameImageOffset = (totalSize - frameImageSize); // Center the shrunken image

  return (
    <View style={[styles.outerContainer, { 
      width: gridSize + borderWidth * 2, 
      height: gridSize + borderWidth * 2,
      backgroundColor: '#FFFFFF',
    }]}>
      {/* Frame Image - Shrunk 3x */}
      {frameImage ? (
        <Image 
          source={frameImage} 
          style={{
            position: 'absolute',
            width: frameImageSize,
            height: frameImageSize,
            top: frameImageOffset,
            left: frameImageOffset,
          }}
          resizeMode="stretch"
        />
      ) : (
        <LinearGradient
          colors={theme.borderGradient as any}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
      
      {/* Removed innerShadow - no border */}
      
      {/* Grid interior blanco */}
      <View style={[styles.innerContainer, { 
        width: gridSize, 
        height: gridSize,
        top: borderWidth,
        left: borderWidth,
      }]}>
        {/* Fondo blanco limpio */}
        <View style={[styles.whiteBackground, { width: gridSize, height: gridSize }]} />
        
        {/* Grid cells (líneas divisorias sutiles) */}
        <View style={styles.grid}>
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => (
              <View
                key={`${row}-${col}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                  },
                ]}
              />
            ))
          )}
        </View>
        
        {/* Vehicles layer */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  innerContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  whiteBackground: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#E8E8E8', // Líneas sutiles gris claro
    backgroundColor: 'transparent',
  },
});

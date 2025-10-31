import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StarRatingProps {
  currentMoves: number;
  optimalMoves: number;
  size?: number;
}

export function StarRating({ currentMoves, optimalMoves, size = 24 }: StarRatingProps) {
  // Calculate stars based on moves
  // 3 stars: <= optimal
  // 2 stars: <= optimal + 30%
  // 1 star: <= optimal + 70%
  // 0 stars: more than optimal + 70%
  const getStars = (): number => {
    if (currentMoves === 0) return 3; // Not started yet, show potential
    
    const threshold2Stars = Math.ceil(optimalMoves * 1.3);
    const threshold1Star = Math.ceil(optimalMoves * 1.7);
    
    if (currentMoves <= optimalMoves) return 3;
    if (currentMoves <= threshold2Stars) return 2;
    if (currentMoves <= threshold1Star) return 1;
    return 0; // Failed
  };

  const stars = getStars();

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((index) => (
        <Star
          key={index}
          filled={index <= stars}
          size={size}
        />
      ))}
    </View>
  );
}

interface StarProps {
  filled: boolean;
  size: number;
}

function Star({ filled, size }: StarProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={{ marginHorizontal: 2 }}>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? '#2E9BFF' : '#E8EAED'}
        stroke={filled ? '#1976D2' : '#BDBDBD'}
        strokeWidth={1}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

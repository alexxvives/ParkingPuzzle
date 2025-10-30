import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

interface CarShapeProps {
  color: string;
  width: number;
  height: number;
  isHorizontal: boolean;
}

export function CarShape({ color, width, height, isHorizontal }: CarShapeProps) {
  const innerPadding = 2;
  const actualWidth = width - innerPadding * 2;
  const actualHeight = height - innerPadding * 2;

  if (isHorizontal) {
    // Coche horizontal (apuntando a la derecha)
    return (
      <View style={[styles.container, { width, height }]}>
        <Svg width={actualWidth} height={actualHeight} viewBox="0 0 100 60">
          {/* Cuerpo principal del coche */}
          <Rect
            x="10"
            y="20"
            width="80"
            height="25"
            rx="4"
            fill={color}
          />
          
          {/* Cabina/techo */}
          <Path
            d="M 30 20 L 40 10 L 70 10 L 75 20 Z"
            fill={color}
            opacity="0.8"
          />
          
          {/* Ventanas */}
          <Rect
            x="42"
            y="13"
            width="22"
            height="7"
            rx="2"
            fill="#fff"
            opacity="0.3"
          />
          
          {/* Ruedas */}
          <Circle cx="25" cy="45" r="8" fill="#2A2A2A" />
          <Circle cx="25" cy="45" r="4" fill="#555" />
          <Circle cx="75" cy="45" r="8" fill="#2A2A2A" />
          <Circle cx="75" cy="45" r="4" fill="#555" />
          
          {/* Faros delanteros */}
          <Circle cx="88" cy="25" r="3" fill="#FFF8DC" opacity="0.8" />
          <Circle cx="88" cy="40" r="3" fill="#FFF8DC" opacity="0.8" />
        </Svg>
      </View>
    );
  } else {
    // Coche vertical (apuntando hacia abajo)
    return (
      <View style={[styles.container, { width, height }]}>
        <Svg width={actualWidth} height={actualHeight} viewBox="0 0 60 100">
          {/* Cuerpo principal del coche */}
          <Rect
            x="17.5"
            y="10"
            width="25"
            height="80"
            rx="4"
            fill={color}
          />
          
          {/* Cabina/techo */}
          <Path
            d="M 17.5 30 L 10 40 L 10 70 L 17.5 75 Z"
            fill={color}
            opacity="0.8"
          />
          
          {/* Ventanas */}
          <Rect
            x="13"
            y="42"
            width="7"
            height="22"
            rx="2"
            fill="#fff"
            opacity="0.3"
          />
          
          {/* Ruedas */}
          <Circle cx="15" cy="25" r="8" fill="#2A2A2A" />
          <Circle cx="15" cy="25" r="4" fill="#555" />
          <Circle cx="15" cy="75" r="8" fill="#2A2A2A" />
          <Circle cx="15" cy="75" r="4" fill="#555" />
          
          {/* Faros delanteros */}
          <Circle cx="25" cy="88" r="3" fill="#FFF8DC" opacity="0.8" />
          <Circle cx="40" cy="88" r="3" fill="#FFF8DC" opacity="0.8" />
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

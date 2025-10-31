import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import type { Vehicle as VehicleType } from '../logic/types';
import { canMove } from '../logic/moveEngine';

interface VehicleProps {
  vehicle: VehicleType;
  cellSize: number;
  gridSize: number;
  allVehicles: VehicleType[];
  onMove: (vehicleId: string, delta: number) => void;
}

export function Vehicle({ vehicle, cellSize, gridSize, allVehicles, onMove }: VehicleProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset translation when vehicle position changes (after state update)
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [vehicle.x, vehicle.y]);

  const handleMoveEnd = (cellsMoved: number) => {
    onMove(vehicle.id, cellsMoved);
  };

  const vehicleImages = {
    // Coches (length 2)
    red: require('../assets/car_red.png'),
    blue: require('../assets/car_blue.png'),
    green: require('../assets/car_green.png'),
    orange: require('../assets/car_orange.png'),
    purple: require('../assets/car_purple.png'),
    yellow: require('../assets/car_yellow.png'),
    // Camión (length 3)
    truckPurple: require('../assets/Truck_purple.png'),
  };

  const getVehicleImage = () => {
    // Main car is always red
    if (vehicle.type === 'red') return vehicleImages.red;
    
    // Trucks (length 3) get truck image
    if (vehicle.length === 3) {
      return vehicleImages.truckPurple;
    }
    
    // Cars (length 2) get car images in rotation
    const colorIndex = vehicle.id.charCodeAt(0) % 5;
    const colors = ['blue', 'green', 'orange', 'purple', 'yellow'];
    return vehicleImages[colors[colorIndex] as keyof typeof vehicleImages];
  };

  const vehicleImage = getVehicleImage();

  // Calculate position and dimensions
  const startX = vehicle.x * cellSize;
  const startY = vehicle.y * cellSize;
  const width = vehicle.orientation === 'H' ? vehicle.length * cellSize : cellSize;
  const height = vehicle.orientation === 'V' ? vehicle.length * cellSize : cellSize;

  // For horizontal vehicles, we need to swap width/height for the image since we rotate it
  const imageWidth = vehicle.orientation === 'H' ? height : width;
  const imageHeight = vehicle.orientation === 'H' ? width : height;

  // Calculate max allowed movement in each direction considering collisions
  // Recalculate when allVehicles changes (when any vehicle moves)
  const { maxPositive, maxNegative } = useMemo(() => {
    const calculateMaxMovement = (direction: 1 | -1): number => {
      const maxByGrid = direction > 0
        ? (vehicle.orientation === 'H' 
            ? gridSize - vehicle.x - vehicle.length 
            : gridSize - vehicle.y - vehicle.length)
        : (vehicle.orientation === 'H' ? -vehicle.x : -vehicle.y);

      // Check each cell step by step until we hit a collision or boundary
      for (let cells = 1; cells <= Math.abs(maxByGrid); cells++) {
        const delta = cells * direction;
        if (!canMove(vehicle.id, delta, allVehicles, gridSize)) {
          // Can't move this far, return previous position
          return (cells - 1) * direction * cellSize;
        }
      }
      
      // No collision found, return max by grid
      return maxByGrid * cellSize;
    };

    return {
      maxPositive: calculateMaxMovement(1),
      maxNegative: calculateMaxMovement(-1),
    };
  }, [allVehicles, vehicle.id, vehicle.orientation, vehicle.x, vehicle.y, vehicle.length, gridSize, cellSize]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (vehicle.orientation === 'H') {
        // Horizontal movement - limit by collisions and grid boundaries
        translateX.value = Math.max(maxNegative, Math.min(maxPositive, e.translationX));
        translateY.value = 0;
      } else {
        // Vertical movement - limit by collisions and grid boundaries
        translateX.value = 0;
        translateY.value = Math.max(maxNegative, Math.min(maxPositive, e.translationY));
      }
    })
    .onEnd(() => {
      const delta = vehicle.orientation === 'H' ? translateX.value : translateY.value;
      const cellsMoved = Math.round(delta / cellSize);
      let finalPosition = cellsMoved * cellSize;
      
      // Make sure finalPosition respects collision boundaries
      finalPosition = Math.max(maxNegative, Math.min(maxPositive, finalPosition));
      
      // Animate smoothly to the snapped grid position
      if (vehicle.orientation === 'H') {
        translateX.value = withTiming(finalPosition, { duration: 150 }, (finished) => {
          if (finished && cellsMoved !== 0) {
            runOnJS(handleMoveEnd)(cellsMoved);
          }
        });
      } else {
        translateY.value = withTiming(finalPosition, { duration: 150 }, (finished) => {
          if (finished && cellsMoved !== 0) {
            runOnJS(handleMoveEnd)(cellsMoved);
          }
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // Para web, usar div clickeable en lugar de gestos táctiles
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.vehicle,
          {
            width,
            height,
            left: startX,
            top: startY,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Image
          source={vehicleImage}
          style={{
            width: imageWidth,
            height: imageHeight,
            transform: vehicle.orientation === 'H' ? [{ rotate: '90deg' }] : [],
          }}
          resizeMode={vehicle.length === 3 ? "stretch" : "contain"}
        />
      </View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.vehicle,
          {
            width,
            height,
            left: startX,
            top: startY,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        <Image
          source={vehicleImage}
          style={{
            width: imageWidth,
            height: imageHeight,
            transform: vehicle.orientation === 'H' ? [{ rotate: '90deg' }] : [],
          }}
          resizeMode={vehicle.length === 3 ? "stretch" : "contain"}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  vehicle: {
    position: 'absolute',
    borderRadius: 8,
  },
});

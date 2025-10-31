import React, { useEffect, useMemo, useState } from 'react';
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
  const initialPosition = useSharedValue({ x: vehicle.x, y: vehicle.y });
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset translation when vehicle position changes (after state update)
  // BUT only if we're not the one who caused the change
  useEffect(() => {
    console.log(`[${vehicle.id}] useEffect triggered - vehicle.x: ${vehicle.x}, vehicle.y: ${vehicle.y}, isAnimating: ${isAnimating}`);
    console.log(`[${vehicle.id}] Current translateX: ${translateX.value}, translateY: ${translateY.value}`);
    console.log(`[${vehicle.id}] initialPosition: x: ${initialPosition.value.x}, y: ${initialPosition.value.y}`);
    
    // Always update initialPosition to match current vehicle position
    // This handles both: animations finishing AND other vehicles moving this one
    const needsUpdate = initialPosition.value.x !== vehicle.x || initialPosition.value.y !== vehicle.y;
    
    if (!isAnimating) {
      if (needsUpdate) {
        console.log(`[${vehicle.id}] Position changed, resetting translation and updating initialPosition`);
        translateX.value = 0;
        translateY.value = 0;
        initialPosition.value = { x: vehicle.x, y: vehicle.y };
      }
    } else {
      console.log(`[${vehicle.id}] Skipping reset because isAnimating is true`);
    }
  }, [vehicle.x, vehicle.y, isAnimating]);

  const handleMoveEnd = (cellsMoved: number, orientation: 'H' | 'V', startPos: number) => {
    console.log(`[${vehicle.id}] handleMoveEnd called with cellsMoved: ${cellsMoved}, orientation: ${orientation}, startPos: ${startPos}`);
    onMove(vehicle.id, cellsMoved);
    // After state update completes, reset the animation flag
    // This will trigger useEffect to reset translations when vehicle.x/y updates
    // Use a small delay to ensure React has processed the state update
    setTimeout(() => {
      console.log(`[${vehicle.id}] handleMoveEnd setTimeout executing, setting isAnimating to false`);
      setIsAnimating(false);
    }, 20);
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
  // Note: base position for rendering will come from initialPosition to avoid 1-frame mismatch on drop
  const startX = vehicle.x * cellSize; // kept for web path/debug only
  const startY = vehicle.y * cellSize; // kept for web path/debug only
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
    .onStart(() => {
      // Convertir a coordenadas matemáticas (origen abajo-izquierda, empezando desde 1)
      const mathX = vehicle.x + 1;
      const mathY = gridSize - vehicle.y;
      const visualMathX = mathX + Math.round(translateX.value / cellSize);
      const visualMathY = mathY - Math.round(translateY.value / cellSize);
      
      console.log(`[${vehicle.id}] 🚗 CLICK - Posición: (${mathX}, ${mathY}), orientación=${vehicle.orientation}, longitud=${vehicle.length}`);
      console.log(`[${vehicle.id}] 🚗 translateX: ${translateX.value}, translateY: ${translateY.value}`);
      console.log(`[${vehicle.id}] 🚗 Posición VISUAL: (${visualMathX}, ${visualMathY})`);
      console.log(`[${vehicle.id}] 🚗 [DEBUG interno: x=${vehicle.x}, y=${vehicle.y}]`);
    })
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
      
      console.log(`[${vehicle.id}] onEnd:`);
      console.log(`  delta: ${delta}, cellsMoved: ${Math.round(delta / cellSize)}`);
      console.log(`  initialPos: ${vehicle.orientation === 'H' ? initialPosition.value.x : initialPosition.value.y}`);
      console.log(`  currentPos: ${vehicle.orientation === 'H' ? vehicle.x : vehicle.y}`);
      
      // Calculate where we want to snap to
      let cellsMoved = Math.round(delta / cellSize);
      let finalPosition = cellsMoved * cellSize;
      
      console.log(`  finalPosition (before clamp): ${finalPosition}`);
      console.log(`  maxNegative: ${maxNegative}, maxPositive: ${maxPositive}`);
      
      // Make sure finalPosition respects collision boundaries
      finalPosition = Math.max(maxNegative, Math.min(maxPositive, finalPosition));
      
      console.log(`  finalPosition (after clamp): ${finalPosition}`);
      
      // Calculate actual cells moved from initial position
      const finalCellPosition = (vehicle.orientation === 'H' ? initialPosition.value.x : initialPosition.value.y) + Math.round(finalPosition / cellSize);
      const actualCellsMoved = finalCellPosition - (vehicle.orientation === 'H' ? initialPosition.value.x : initialPosition.value.y);
      
      console.log(`  finalCellPosition: ${finalCellPosition}, actualCellsMoved: ${actualCellsMoved}`);
      console.log(`  will call handleMoveEnd: ${actualCellsMoved !== 0}`);
      
      // If no actual movement, just animate back to 0
      if (actualCellsMoved === 0) {
        console.log(`[${vehicle.id}] No actual movement, animating back to 0`);
        if (vehicle.orientation === 'H') {
          translateX.value = withTiming(0, { duration: 150 });
        } else {
          translateY.value = withTiming(0, { duration: 150 });
        }
        return;
      }
      
      // Animate smoothly to the snapped grid position
      if (vehicle.orientation === 'H') {
        runOnJS(setIsAnimating)(true);
        const startPosX = initialPosition.value.x;
        console.log(`[${vehicle.id}] Starting animation, set isAnimating = true, startPosX: ${startPosX}`);
        translateX.value = withTiming(finalPosition, { duration: 150 }, (finished) => {
          if (finished) {
            console.log(`[${vehicle.id}] Animation finished, calling handleMoveEnd with ${actualCellsMoved}`);
            console.log(`[${vehicle.id}] Before handleMoveEnd - vehicle.x: ${vehicle.x}, translateX: ${translateX.value}`);
            runOnJS(handleMoveEnd)(actualCellsMoved, 'H', startPosX);
          }
        });
      } else {
        runOnJS(setIsAnimating)(true);
        const startPosY = initialPosition.value.y;
        console.log(`[${vehicle.id}] Starting animation, set isAnimating = true, startPosY: ${startPosY}`);
        translateY.value = withTiming(finalPosition, { duration: 150 }, (finished) => {
          if (finished) {
            console.log(`[${vehicle.id}] Animation finished, calling handleMoveEnd with ${actualCellsMoved}`);
            console.log(`[${vehicle.id}] Before handleMoveEnd - vehicle.y: ${vehicle.y}, translateY: ${translateY.value}`);
            runOnJS(handleMoveEnd)(actualCellsMoved, 'V', startPosY);
          }
        });
      }
    });

  // Drive base position (left/top) from initialPosition to keep visual consistent during state updates
  const animatedStyle = useAnimatedStyle(() => ({
    left: initialPosition.value.x * cellSize,
    top: initialPosition.value.y * cellSize,
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

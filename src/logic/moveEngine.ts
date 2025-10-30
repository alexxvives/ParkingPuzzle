import { Level, Vehicle, Move } from './types';

/**
 * Get all cells occupied by vehicles in the current state
 */
export function getOccupiedCells(vehicles: Vehicle[]): Set<string> {
  const occupied = new Set<string>();
  
  for (const vehicle of vehicles) {
    for (let i = 0; i < vehicle.length; i++) {
      const cellKey = vehicle.orientation === 'H' 
        ? `${vehicle.x + i},${vehicle.y}`
        : `${vehicle.x},${vehicle.y + i}`;
      occupied.add(cellKey);
    }
  }
  
  return occupied;
}

/**
 * Check if a vehicle can move by delta cells
 */
export function canMove(
  vehicleId: string,
  delta: number,
  vehicles: Vehicle[],
  gridSize: number
): boolean {
  const vehicle = vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return false;
  
  // Calculate new position
  const newX = vehicle.orientation === 'H' ? vehicle.x + delta : vehicle.x;
  const newY = vehicle.orientation === 'V' ? vehicle.y + delta : vehicle.y;
  
  // Check grid boundaries
  if (vehicle.orientation === 'H') {
    if (newX < 0 || newX + vehicle.length > gridSize) return false;
  } else {
    if (newY < 0 || newY + vehicle.length > gridSize) return false;
  }
  
  // Check collisions with other vehicles
  const otherVehicles = vehicles.filter(v => v.id !== vehicleId);
  const occupied = getOccupiedCells(otherVehicles);
  
  for (let i = 0; i < vehicle.length; i++) {
    const checkX = vehicle.orientation === 'H' ? newX + i : newX;
    const checkY = vehicle.orientation === 'V' ? newY + i : newY;
    const cellKey = `${checkX},${checkY}`;
    
    if (occupied.has(cellKey)) return false;
  }
  
  return true;
}

/**
 * Apply a move to a vehicle (returns new vehicles array)
 */
export function applyMove(
  vehicleId: string,
  delta: number,
  vehicles: Vehicle[]
): Vehicle[] {
  return vehicles.map(vehicle => {
    if (vehicle.id !== vehicleId) return vehicle;
    
    return {
      ...vehicle,
      x: vehicle.orientation === 'H' ? vehicle.x + delta : vehicle.x,
      y: vehicle.orientation === 'V' ? vehicle.y + delta : vehicle.y,
    };
  });
}

/**
 * Check if the level is solved (red car reaches exit)
 */
export function isSolved(vehicles: Vehicle[], exit: { x: number; y: number }): boolean {
  const redCar = vehicles.find(v => v.type === 'red');
  if (!redCar) return false;
  
  // Red car must reach the exit position
  // Assuming horizontal red car and exit on the right edge
  if (redCar.orientation === 'H') {
    return redCar.x + redCar.length - 1 === exit.x && redCar.y === exit.y;
  }
  
  return false;
}

/**
 * Get all legal moves for the current state
 */
export function getLegalMoves(vehicles: Vehicle[], gridSize: number): Move[] {
  const moves: Move[] = [];
  
  for (const vehicle of vehicles) {
    // Try moving forward and backward
    const maxDelta = vehicle.orientation === 'H' 
      ? gridSize - (vehicle.x + vehicle.length)
      : gridSize - (vehicle.y + vehicle.length);
    
    const minDelta = vehicle.orientation === 'H' ? -vehicle.x : -vehicle.y;
    
    for (let delta = minDelta; delta <= maxDelta; delta++) {
      if (delta === 0) continue;
      
      if (canMove(vehicle.id, delta, vehicles, gridSize)) {
        moves.push({ vehicleId: vehicle.id, delta });
      }
    }
  }
  
  return moves;
}

/**
 * Serialize game state for BFS
 */
export function serializeState(vehicles: Vehicle[]): string {
  return vehicles
    .map(v => `${v.id}:${v.x},${v.y}`)
    .sort()
    .join('|');
}

/**
 * Calculate which cells a move would traverse (for collision detection during drag)
 */
export function getMovementPath(
  vehicle: Vehicle,
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number }
): { x: number; y: number }[] {
  const path: { x: number; y: number }[] = [];
  
  if (vehicle.orientation === 'H') {
    const start = Math.min(fromPos.x, toPos.x);
    const end = Math.max(fromPos.x, toPos.x);
    for (let x = start; x <= end; x++) {
      for (let i = 0; i < vehicle.length; i++) {
        path.push({ x: x + i, y: vehicle.y });
      }
    }
  } else {
    const start = Math.min(fromPos.y, toPos.y);
    const end = Math.max(fromPos.y, toPos.y);
    for (let y = start; y <= end; y++) {
      for (let i = 0; i < vehicle.length; i++) {
        path.push({ x: vehicle.x, y: y + i });
      }
    }
  }
  
  return path;
}

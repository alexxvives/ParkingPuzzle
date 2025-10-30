import { Vehicle, Level, Move } from './types';
import { getLegalMoves, applyMove, isSolved, serializeState } from './moveEngine';

interface SearchNode {
  vehicles: Vehicle[];
  moves: Move[];
  depth: number;
}

/**
 * Solve a level using BFS to find the minimum number of moves
 * Returns the optimal number of moves, or null if unsolvable
 */
export function solveLevelBFS(level: Level, maxDepth: number = 50): number | null {
  const queue: SearchNode[] = [
    {
      vehicles: level.vehicles,
      moves: [],
      depth: 0,
    },
  ];
  
  const visited = new Set<string>();
  visited.add(serializeState(level.vehicles));
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    
    // Check if solved
    if (isSolved(node.vehicles, level.exit)) {
      return node.depth;
    }
    
    // Don't search too deep
    if (node.depth >= maxDepth) {
      continue;
    }
    
    // Try all legal moves
    const legalMoves = getLegalMoves(node.vehicles, level.size);
    
    for (const move of legalMoves) {
      const newVehicles = applyMove(move.vehicleId, move.delta, node.vehicles);
      const stateKey = serializeState(newVehicles);
      
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push({
          vehicles: newVehicles,
          moves: [...node.moves, move],
          depth: node.depth + 1,
        });
      }
    }
  }
  
  return null; // No solution found
}

/**
 * Get a hint for the next move (first move from optimal solution)
 */
export function getHint(level: Level, currentVehicles: Vehicle[]): Move | null {
  const queue: SearchNode[] = [
    {
      vehicles: currentVehicles,
      moves: [],
      depth: 0,
    },
  ];
  
  const visited = new Set<string>();
  visited.add(serializeState(currentVehicles));
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    
    if (isSolved(node.vehicles, level.exit)) {
      return node.moves.length > 0 ? node.moves[0] : null;
    }
    
    if (node.depth >= 20) continue;
    
    const legalMoves = getLegalMoves(node.vehicles, level.size);
    
    for (const move of legalMoves) {
      const newVehicles = applyMove(move.vehicleId, move.delta, node.vehicles);
      const stateKey = serializeState(newVehicles);
      
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push({
          vehicles: newVehicles,
          moves: [...node.moves, move],
          depth: node.depth + 1,
        });
      }
    }
  }
  
  return null;
}

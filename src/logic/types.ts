// Core game types
export type Orientation = 'H' | 'V';
export type VehicleType = 'red' | 'car' | 'truck';

export interface Vehicle {
  id: string;
  type: VehicleType;
  orientation: Orientation;
  length: 2 | 3;
  x: number; // Grid column (0-indexed)
  y: number; // Grid row (0-indexed)
}

export interface Level {
  id: string;
  title?: string;
  size: number; // Grid size (e.g., 6 for 6x6)
  exit: { x: number; y: number };
  vehicles: Vehicle[];
  optimalMoves?: number;
}

export interface PackMeta {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  levels: string[]; // Level IDs
  starsToUnlock?: number;
  premium?: boolean;
}

export interface CollectionItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
  art: string;
  unlockRule: { packId: string; thresholdPct: 25 | 50 | 75 | 100 };
}

// Game state
export interface GameState {
  level: Level;
  vehicles: Vehicle[];
  moves: number;
  isCompleted: boolean;
}

export interface LevelProgress {
  moves: number;
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
}

// Move representation
export interface Move {
  vehicleId: string;
  delta: number; // Cells moved (positive or negative)
}

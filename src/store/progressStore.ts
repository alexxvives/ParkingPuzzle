import AsyncStorage from '@react-native-async-storage/async-storage';
import { allLevels } from '../data';

const STORAGE_KEY = '@ParkingPuzzle:progress';

export interface LevelProgress {
  levelId: string;
  stars: number;
  bestMoves: number;
  completed: boolean;
}

export interface GameProgress {
  currentLevel: number; // 1-based index (Level 1, Level 2, etc.)
  levelsCompleted: LevelProgress[];
}

// Get all available levels in order
const ALL_LEVELS = allLevels;

// Initialize or load progress
export async function loadProgress(): Promise<GameProgress> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  // Default: start at Level 1
  return {
    currentLevel: 1,
    levelsCompleted: [],
  };
}

// Save progress
export async function saveProgress(progress: GameProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

// Get current level data
export function getCurrentLevelData(currentLevel: number) {
  const index = currentLevel - 1; // Convert to 0-based
  if (index >= 0 && index < ALL_LEVELS.length) {
    return ALL_LEVELS[index];
  }
  return null;
}

// Mark level as completed and advance
export async function completeLevel(
  levelId: string,
  moves: number,
  stars: number
): Promise<GameProgress> {
  const progress = await loadProgress();
  
  // Update or add level progress
  const existingIndex = progress.levelsCompleted.findIndex(
    (lp) => lp.levelId === levelId
  );
  
  const levelProgress: LevelProgress = {
    levelId,
    stars,
    bestMoves: moves,
    completed: true,
  };
  
  if (existingIndex >= 0) {
    // Update if better
    const existing = progress.levelsCompleted[existingIndex];
    if (moves < existing.bestMoves || stars > existing.stars) {
      progress.levelsCompleted[existingIndex] = {
        ...levelProgress,
        bestMoves: Math.min(moves, existing.bestMoves),
        stars: Math.max(stars, existing.stars),
      };
    }
  } else {
    progress.levelsCompleted.push(levelProgress);
  }
  
  // Advance to next level if current level
  const currentLevelId = getCurrentLevelData(progress.currentLevel)?.id;
  if (levelId === currentLevelId && progress.currentLevel < ALL_LEVELS.length) {
    progress.currentLevel += 1;
  }
  
  await saveProgress(progress);
  return progress;
}

// Get stars for a specific level
export function getStarsForLevel(
  progress: GameProgress,
  levelId: string
): number {
  const levelProgress = progress.levelsCompleted.find(
    (lp) => lp.levelId === levelId
  );
  return levelProgress?.stars || 0;
}

// Reset progress (for testing)
export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
}

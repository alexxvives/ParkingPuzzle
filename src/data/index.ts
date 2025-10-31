import easyLevels from './levels/easy.json';
import mediumLevels from './levels/medium.json';
import hardLevels from './levels/hard.json';
import expertLevels from './levels/expert.json';
import { Level, PackMeta } from '../logic/types';

// Normalize JSON imports as typed Level[] arrays
const easy: Level[] = easyLevels as unknown as Level[];
const medium: Level[] = mediumLevels as unknown as Level[];
const hard: Level[] = hardLevels as unknown as Level[];
const expert: Level[] = expertLevels as unknown as Level[];

// Custom level progression:
// First 3: Easy
// Next 7: Mix of easy/medium (mostly medium)
// After level 10: Random 25% each difficulty
function buildLevelProgression(): Level[] {
  const allLevelsPool = [
    ...easy,
    ...medium,
    ...hard,
    ...expert,
  ];

  const progression: Level[] = [];
  
  // Levels 1-3: Easy only
  const easyOnly = easy.slice(0, 3);
  progression.push(...easyOnly);
  
  // Levels 4-10: Mix (mostly medium, some easy)
  const mixLevels = [
    ...medium.slice(0, 2),
    ...(easy.length > 3 ? [easy[3]] : []),
    ...medium.slice(2, 3),
    ...medium.slice(3, 4),
  ];
  progression.push(...mixLevels.slice(0, 7));
  
  // Levels 11+: Random 25% each difficulty
  const remainingEasy = easy.filter(l => !progression.find(p => p.id === l.id));
  const remainingMedium = medium.filter(l => !progression.find(p => p.id === l.id));
  const remainingHard = hard;
  const remainingExpert = expert;
  
  const remaining = [
    ...remainingEasy,
    ...remainingMedium,
    ...remainingHard,
    ...remainingExpert,
  ];
  
  // Shuffle remaining levels for random distribution
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  progression.push(...shuffled);
  
  return progression;
}

export const allLevels: Level[] = buildLevelProgression();

export const packs: PackMeta[] = [
  {
    id: 'easy',
    title: 'Easy',
    difficulty: 'easy',
    levels: easy.map((l) => l.id),
    starsToUnlock: 0,
  },
  {
    id: 'medium',
    title: 'Medium',
    difficulty: 'medium',
    levels: medium.map((l) => l.id),
    starsToUnlock: 6,
  },
  {
    id: 'hard',
    title: 'Hard',
    difficulty: 'hard',
    levels: hard.map((l) => l.id),
    starsToUnlock: 15,
  },
  {
    id: 'expert',
    title: 'Expert',
    difficulty: 'expert',
    levels: expert.map((l) => l.id),
    starsToUnlock: 24,
  },
];

export function getLevelById(id: string): Level | undefined {
  return allLevels.find((l) => l.id === id);
}

export function getPackByDifficulty(difficulty: string): PackMeta | undefined {
  return packs.find((p) => p.difficulty === difficulty);
}

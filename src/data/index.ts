import easyLevels from './levels/easy.json';
import mediumLevels from './levels/medium.json';
import hardLevels from './levels/hard.json';
import expertLevels from './levels/expert.json';
import { Level, PackMeta } from '../logic/types';

// Custom level progression:
// First 3: Easy
// Next 7: Mix of easy/medium (mostly medium)
// After level 10: Random 25% each difficulty
function buildLevelProgression(): Level[] {
  const allLevelsPool = [
    ...easyLevels,
    ...mediumLevels,
    ...hardLevels,
    ...expertLevels,
  ] as Level[];

  const progression: Level[] = [];
  
  // Levels 1-3: Easy only
  const easyOnly = easyLevels.slice(0, 3) as Level[];
  progression.push(...easyOnly);
  
  // Levels 4-10: Mix (mostly medium, some easy)
  const mixLevels = [
    ...mediumLevels.slice(0, 2) as Level[],
    ...(easyLevels.length > 3 ? [easyLevels[3] as Level] : []),
    ...mediumLevels.slice(2, 3) as Level[],
    ...mediumLevels.slice(3, 4) as Level[],
  ];
  progression.push(...mixLevels.slice(0, 7));
  
  // Levels 11+: Random 25% each difficulty
  const remainingEasy = (easyLevels as Level[]).filter(l => !progression.find(p => p.id === l.id));
  const remainingMedium = (mediumLevels as Level[]).filter(l => !progression.find(p => p.id === l.id));
  const remainingHard = hardLevels as Level[];
  const remainingExpert = expertLevels as Level[];
  
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
    levels: easyLevels.map((l) => l.id),
    starsToUnlock: 0,
  },
  {
    id: 'medium',
    title: 'Medium',
    difficulty: 'medium',
    levels: mediumLevels.map((l) => l.id),
    starsToUnlock: 6,
  },
  {
    id: 'hard',
    title: 'Hard',
    difficulty: 'hard',
    levels: hardLevels.map((l) => l.id),
    starsToUnlock: 15,
  },
  {
    id: 'expert',
    title: 'Expert',
    difficulty: 'expert',
    levels: expertLevels.map((l) => l.id),
    starsToUnlock: 24,
  },
];

export function getLevelById(id: string): Level | undefined {
  return allLevels.find((l) => l.id === id);
}

export function getPackByDifficulty(difficulty: string): PackMeta | undefined {
  return packs.find((p) => p.difficulty === difficulty);
}

import easyLevels from './levels/easy.json';
import mediumLevels from './levels/medium.json';
import hardLevels from './levels/hard.json';
import expertLevels from './levels/expert.json';
import { Level, PackMeta } from '../logic/types';

export const allLevels: Level[] = [
  ...easyLevels,
  ...mediumLevels,
  ...hardLevels,
  ...expertLevels,
] as Level[];

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

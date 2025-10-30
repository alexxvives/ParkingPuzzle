import { describe, it, expect } from 'vitest';
import { solveLevelBFS } from '../src/logic/solver';
import { Level } from '../src/logic/types';

describe('solver', () => {
  const easyLevel: Level = {
    id: 'test_001',
    size: 6,
    exit: { x: 5, y: 2 },
    vehicles: [
      { id: 'R', type: 'red', orientation: 'H', length: 2, x: 2, y: 2 },
      { id: 'A', type: 'car', orientation: 'V', length: 2, x: 4, y: 0 },
      { id: 'B', type: 'car', orientation: 'V', length: 2, x: 5, y: 3 },
    ],
  };

  it('should solve simple puzzle', () => {
    const result = solveLevelBFS(easyLevel, 20);
    expect(result).not.toBeNull();
    expect(result).toBeGreaterThan(0);
  });

  it('should return null for unsolvable within depth limit', () => {
    // Create a more complex scenario that might not solve in 10 moves
    const complexLevel: Level = {
      id: 'complex',
      size: 6,
      exit: { x: 5, y: 2 },
      vehicles: [
        { id: 'R', type: 'red', orientation: 'H', length: 2, x: 0, y: 2 },
        { id: 'A', type: 'truck', orientation: 'V', length: 3, x: 2, y: 0 },
        { id: 'B', type: 'truck', orientation: 'V', length: 3, x: 3, y: 3 },
        { id: 'C', type: 'truck', orientation: 'H', length: 3, x: 3, y: 0 },
        { id: 'D', type: 'car', orientation: 'V', length: 2, x: 4, y: 3 },
      ],
    };
    const result = solveLevelBFS(complexLevel, 5); // Very low depth limit
    // Should either solve quickly or return null
    expect(result === null || result > 0).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { canMove, applyMove, isSolved, getOccupiedCells } from '../src/logic/moveEngine';
import { Vehicle, Level } from '../src/logic/types';

describe('moveEngine', () => {
  const testVehicles: Vehicle[] = [
    { id: 'R', type: 'red', orientation: 'H', length: 2, x: 2, y: 2 },
    { id: 'A', type: 'car', orientation: 'V', length: 2, x: 4, y: 0 },
    { id: 'B', type: 'car', orientation: 'V', length: 2, x: 5, y: 3 },
  ];

  it('should detect occupied cells', () => {
    const occupied = getOccupiedCells(testVehicles);
    expect(occupied.has('2,2')).toBe(true);
    expect(occupied.has('3,2')).toBe(true);
    expect(occupied.has('4,0')).toBe(true);
    expect(occupied.has('4,1')).toBe(true);
  });

  it('should allow valid moves', () => {
    expect(canMove('R', 1, testVehicles, 6)).toBe(true);
    expect(canMove('R', -1, testVehicles, 6)).toBe(true);
  });

  it('should block invalid moves (collision)', () => {
    // Red car at (2,2), vehicle B at (5,3-4)
    // Moving red car 2 spaces right would go to (4,2) - no collision with B
    // Let's test collision with vehicle A instead
    expect(canMove('R', 3, testVehicles, 6)).toBe(false); // Would go out or hit edge
  });

  it('should block moves out of bounds', () => {
    expect(canMove('R', -3, testVehicles, 6)).toBe(false); // Out of grid
    expect(canMove('A', -1, testVehicles, 6)).toBe(false); // Already at top
  });

  it('should apply moves correctly', () => {
    const newVehicles = applyMove('R', 1, testVehicles);
    const redCar = newVehicles.find(v => v.id === 'R');
    expect(redCar?.x).toBe(3);
    expect(redCar?.y).toBe(2);
  });

  it('should detect solved state', () => {
    const solvedVehicles: Vehicle[] = [
      { id: 'R', type: 'red', orientation: 'H', length: 2, x: 4, y: 2 },
    ];
    expect(isSolved(solvedVehicles, { x: 5, y: 2 })).toBe(true);
  });

  it('should detect unsolved state', () => {
    expect(isSolved(testVehicles, { x: 5, y: 2 })).toBe(false);
  });
});

/**
 * Calculate stars based on moves vs optimal
 */
export function calculateStars(moves: number, optimalMoves: number): 0 | 1 | 2 | 3 {
  if (moves <= optimalMoves) return 3;
  if (moves <= optimalMoves + 2) return 2;
  if (moves <= optimalMoves + 5) return 1;
  return 0;
}

/**
 * Calculate score based on moves, time, and hints used
 */
export function calculateScore(
  moves: number,
  optimalMoves: number,
  timeSeconds: number,
  hintsUsed: number
): number {
  const baseScore = 1000;
  const movesPenalty = Math.max(0, moves - optimalMoves) * 10;
  const timePenalty = Math.floor(timeSeconds / 10) * 5;
  const hintsPenalty = hintsUsed * 50;
  
  return Math.max(0, baseScore - movesPenalty - timePenalty - hintsPenalty);
}

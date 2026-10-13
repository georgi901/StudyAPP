import { describe, it, expect } from 'vitest';
import { shuffleArray } from './shuffle';

describe('shuffleArray', () => {
  it('preserves the array length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.length).toBe(arr.length);
  });

  it('contains the same elements', () => {
    const arr = [1, 2, 3];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toEqual(expect.arrayContaining(arr));
  });

  it('creates a new copy without mutating the original', () => {
    const arr = [1, 2, 3];
    const shuffled = shuffleArray(arr);
    expect(shuffled).not.toBe(arr);
  });
});

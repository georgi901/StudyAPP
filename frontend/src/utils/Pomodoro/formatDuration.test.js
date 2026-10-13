import { describe, it, expect } from 'vitest';
import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats whole minutes', () => {
    expect(formatDuration(120)).toBe('2 min');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2 min 5s');
  });

  it('handles zero seconds', () => {
    expect(formatDuration(0)).toBe('0s');
  });
});

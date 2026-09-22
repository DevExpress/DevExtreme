/**
 * @timezone Europe/Lisbon
 */

import { describe, expect, it } from '@jest/globals';

import { buildDayCells, findDaylightTransition } from './daylight_grid';
import {
  elapsedMs, expectContinuousInstants, HOUR_MS, MINUTE_MS,
} from './daylight_grid.test_helpers';

describe('Europe/Lisbon spring-forward, 29 March 2026', () => {
  const day = new Date(2026, 2, 29);

  it('skips 01:00', () => {
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(transition?.instant.toISOString()).toBe('2026-03-29T01:00:00.000Z');
    expect(transition?.deltaMs).toBe(HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(60);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-03-29T00:00:00.000Z'));
    expect(cells).toHaveLength(23);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[0].start.getHours()).toBe(0);
    expect(cells[1].start.getHours()).toBe(2);
    expect(cells[1].startUTC).toBe(Date.parse('2026-03-29T01:00:00.000Z'));
  });

  it('leaves a 15-minute tail when 45-minute cells meet the jump', () => {
    const { cells } = buildDayCells(day, 0, 24, 45 * MINUTE_MS);
    const jump = Date.parse('2026-03-29T01:00:00.000Z');
    const clippedIndex = cells.findIndex((cell) => cell.endUTC === jump);
    const clipped = cells[clippedIndex];
    const next = cells[clippedIndex + 1];

    expect(clippedIndex).toBeGreaterThanOrEqual(0);
    expect(cells).toHaveLength(32);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(clipped.endUTC - clipped.startUTC).toBe(15 * MINUTE_MS);
    expect(clipped.start.getHours()).toBe(0);
    expect(clipped.start.getMinutes()).toBe(45);
    expect(next.start.getHours()).toBe(2);
    expect(next.start.getMinutes()).toBe(0);
    expect(next.startUTC).toBe(jump);
  });
});

describe('Europe/Lisbon fall-back, 25 October 2026', () => {
  const day = new Date(2026, 9, 25);

  it('repeats 01:00', () => {
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(transition?.instant.toISOString()).toBe('2026-10-25T01:00:00.000Z');
    expect(transition?.deltaMs).toBe(-HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(120);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-10-24T23:00:00.000Z'));
    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[1].startUTC).toBe(Date.parse('2026-10-25T00:00:00.000Z'));
    expect(cells[2].startUTC).toBe(Date.parse('2026-10-25T01:00:00.000Z'));
    expect(cells[1].start.getHours()).toBe(1);
    expect(cells[2].start.getHours()).toBe(1);
    expect(cells[3].start.getHours()).toBe(2);
  });
});

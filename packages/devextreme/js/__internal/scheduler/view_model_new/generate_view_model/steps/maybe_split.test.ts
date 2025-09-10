import { describe, expect, it } from '@jest/globals';

import { maybeSplit } from './maybe_split';

const entities = [
  { isAllDayPanelOccupied: true, startDate: 10 },
  { isAllDayPanelOccupied: false, startDate: 10 },
  { isAllDayPanelOccupied: false, startDate: 12 },
  { isAllDayPanelOccupied: true, startDate: 12 },
  { isAllDayPanelOccupied: false, startDate: 15 },
];
const callback = (items, panelName) => items
  .map((item) => ({ ...item, panelName }));

describe('maybeSplit', () => {
  it('should not split', () => {
    expect(maybeSplit(entities, false, callback)).toEqual([
      { ...entities[0], panelName: 'regularPanel' },
      { ...entities[1], panelName: 'regularPanel' },
      { ...entities[2], panelName: 'regularPanel' },
      { ...entities[3], panelName: 'regularPanel' },
      { ...entities[4], panelName: 'regularPanel' },
    ]);
  });

  it('should split and sort by startDate', () => {
    expect(maybeSplit(entities, true, callback)).toEqual([
      { ...entities[0], panelName: 'allDayPanel' },
      { ...entities[1], panelName: 'regularPanel' },
      { ...entities[3], panelName: 'allDayPanel' },
      { ...entities[2], panelName: 'regularPanel' },
      { ...entities[4], panelName: 'regularPanel' },
    ]);
  });
});

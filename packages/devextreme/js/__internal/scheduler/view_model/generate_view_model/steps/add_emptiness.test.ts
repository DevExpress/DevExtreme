import { describe, expect, it } from '@jest/globals';

import { addEmptiness } from './add_emptiness';

describe('addEmptiness', () => {
  it('should return set empty for timeline view', () => {
    expect(addEmptiness([
      { height: 34, width: 41 },
      { height: 36, width: 41 },
    ] as any, { isTimelineView: true, isAdaptivityEnabled: false })).toEqual([
      { height: 34, width: 41, empty: true },
      { height: 36, width: 41, empty: false },
    ]);
  });

  it('should return set empty for general view', () => {
    expect(addEmptiness([
      { height: 34, width: 39 },
      { height: 36, width: 41 },
      { height: 20, width: 20, isAllDayPanelOccupied: true },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: false })).toEqual([
      { height: 34, width: 39, empty: true },
      { height: 36, width: 41, empty: false },
      {
        height: 20, width: 20, isAllDayPanelOccupied: true, empty: false,
      },
    ]);
  });

  it('should return set empty for adaptivity view', () => {
    expect(addEmptiness([
      { height: 25, width: 40 },
      { height: 30, width: 40 },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: true })).toEqual([
      { height: 25, width: 40, empty: true },
      { height: 30, width: 40, empty: false },
    ]);
  });
});

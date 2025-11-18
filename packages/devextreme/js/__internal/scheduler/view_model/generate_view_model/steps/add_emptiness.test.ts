import { describe, expect, it } from '@jest/globals';

import { addEmptiness } from './add_emptiness';

describe('addEmptiness', () => {
  it('should set empty for timeline view when height is below min threshold', () => {
    expect(addEmptiness([
      {
        height: 34, width: 41, allDay: false, isAllDayPanelOccupied: false,
      },
      {
        height: 36, width: 41, allDay: false, isAllDayPanelOccupied: false,
      },
    ] as any, { isTimelineView: true, isAdaptivityEnabled: false, isMonthView: false })).toEqual([
      {
        height: 34, width: 41, allDay: false, isAllDayPanelOccupied: false, empty: true,
      },
      {
        height: 36, width: 41, allDay: false, isAllDayPanelOccupied: false, empty: false,
      },
    ]);
  });

  it('should use reduced min height for day and week views', () => {
    expect(addEmptiness([
      {
        height: 10, width: 39, allDay: false, isAllDayPanelOccupied: false,
      },
      {
        height: 14, width: 41, allDay: false, isAllDayPanelOccupied: false,
      },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: false, isMonthView: false })).toEqual([
      {
        height: 10, width: 39, allDay: false, isAllDayPanelOccupied: false, empty: true,
      },
      {
        height: 14, width: 41, allDay: false, isAllDayPanelOccupied: false, empty: false,
      },
    ]);
  });

  it('should keep legacy min height for month view', () => {
    expect(addEmptiness([
      {
        height: 19, width: 41, allDay: false, isAllDayPanelOccupied: false,
      },
      {
        height: 22, width: 41, allDay: false, isAllDayPanelOccupied: false,
      },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: false, isMonthView: true })).toEqual([
      {
        height: 19, width: 41, allDay: false, isAllDayPanelOccupied: false, empty: true,
      },
      {
        height: 22, width: 41, allDay: false, isAllDayPanelOccupied: false, empty: false,
      },
    ]);
  });

  it('should keep legacy min height for allDay appointments placed in regular panel', () => {
    expect(addEmptiness([
      {
        height: 15, width: 41, allDay: true, isAllDayPanelOccupied: false,
      },
      {
        height: 25, width: 41, allDay: true, isAllDayPanelOccupied: false,
      },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: false, isMonthView: false })).toEqual([
      {
        height: 15, width: 41, allDay: true, isAllDayPanelOccupied: false, empty: true,
      },
      {
        height: 25, width: 41, allDay: true, isAllDayPanelOccupied: false, empty: false,
      },
    ]);
  });

  it('should respect adaptivity min size', () => {
    expect(addEmptiness([
      {
        height: 25, width: 40, allDay: false, isAllDayPanelOccupied: false,
      },
      {
        height: 30, width: 40, allDay: false, isAllDayPanelOccupied: false,
      },
    ] as any, { isTimelineView: false, isAdaptivityEnabled: true, isMonthView: false })).toEqual([
      {
        height: 25, width: 40, allDay: false, isAllDayPanelOccupied: false, empty: true,
      },
      {
        height: 30, width: 40, allDay: false, isAllDayPanelOccupied: false, empty: false,
      },
    ]);
  });
});

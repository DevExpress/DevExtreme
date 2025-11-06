import { describe, expect, it } from '@jest/globals';

import { getA11yStatusText } from './a11y_status_text';

describe('getA11yStatusText', () => {
  it('should return text custom view', () => {
    expect(getA11yStatusText(
      {
        name: 'Two Weeks',
        type: 'week',
        intervalCount: 2,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 10, 17, 1),
      new Date(2021, 10, 27, 12),
      20,
    )).toEqual('Scheduler. Two Weeks view: from November 17, 2021 to November 27, 2021 with 20 appointments');
  });

  it('should return text month view', () => {
    expect(getA11yStatusText(
      {
        name: 'Month',
        type: 'month',
        intervalCount: 1,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 9, 27, 1),
      new Date(2021, 11, 3, 12),
      20,
    )).toEqual('Scheduler. Month view: from October 2021 to December 2021 with 20 appointments');
  });

  it('should return text week view', () => {
    expect(getA11yStatusText(
      {
        name: 'Week',
        type: 'week',
        intervalCount: 1,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 10, 21, 1),
      new Date(2021, 10, 27, 12),
      20,
    )).toEqual('Scheduler. Week view: from November 21, 2021 to November 27, 2021 with 20 appointments');
  });

  it('should return text day view', () => {
    expect(getA11yStatusText(
      {
        name: 'Day',
        type: 'day',
        intervalCount: 1,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 10, 24, 1),
      new Date(2021, 10, 24, 12),
      20,
    )).toEqual('Scheduler. Day view: November 24, 2021 with 20 appointments');
  });

  it('should return text with indicator on the view', () => {
    expect(getA11yStatusText(
      {
        name: 'Day',
        type: 'day',
        intervalCount: 1,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 10, 24, 1),
      new Date(2021, 10, 24, 12),
      20,
      new Date(2021, 10, 24, 10),
    )).toEqual('Scheduler. Day view: November 24, 2021 with 20 appointments. The current time indicator is visible in the view');
  });

  it('should return text with indicator out of the view', () => {
    expect(getA11yStatusText(
      {
        name: 'Day',
        type: 'day',
        intervalCount: 1,
        groupOrientation: 'horizontal',
        maxAppointmentsPerCell: 'auto',
        allDayPanelMode: 'all',
        skippedDays: [],
      },
      new Date(2021, 10, 24, 1),
      new Date(2021, 10, 24, 12),
      20,
      new Date(2021, 10, 12, 10),
    )).toEqual('Scheduler. Day view: November 24, 2021 with 20 appointments. The current time indicator is not visible on the screen');
  });
});

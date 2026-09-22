import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_HEIGHT, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const FALL_DATE = new Date(2026, 9, 29);
const SPRING_DATE = new Date(2026, 3, 24);

export const describeVerticalDaylightGrid = (matchesScheduler: boolean): void => {
  describe('vertical week rows on a Cairo daylight plan', () => {
    beforeEach(() => {
      fx.off = true;
      setupSchedulerTestEnvironment({ width: 100, height: DEFAULT_CELL_HEIGHT });
    });

    afterEach(() => {
      fx.off = false;
      document.body.innerHTML = '';
    });

    it('gives the repeated hour its own row and leaves a hole on the other days', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [{
          text: 'A',
          startDate: new Date('2026-10-29T23:00:00+03:00'),
          endDate: new Date('2026-10-29T23:15:00+03:00'),
        }, {
          text: 'B',
          startDate: new Date('2026-10-29T23:00:00+02:00'),
          endDate: new Date('2026-10-29T23:15:00+02:00'),
        }],
        views: [{ type: 'week', cellDuration: 60, maxAppointmentsPerCell: 'unlimited' }],
        currentView: 'week',
        currentDate: FALL_DATE,
        timeZone: 'Africa/Cairo',
      });
      const { viewDataProvider } = scheduler.getWorkSpace();
      const table = viewDataProvider.viewDataMap.dateTableMap;
      const transitionColumn = 4;
      const firstPass = table[23][transitionColumn].cellData;
      const secondPass = table[24][transitionColumn].cellData;
      const otherDayHole = table[24][0].cellData;
      const timePanel = POM.getTimePanelContent();

      expect(table).toHaveLength(25);
      expect(firstPass.startDate.getHours()).toBe(23);
      expect(secondPass.startDate.getHours()).toBe(23);
      expect(firstPass.startDateUTC?.toISOString()).toBe('2026-10-29T20:00:00.000Z');
      expect(secondPass.startDateUTC?.toISOString()).toBe('2026-10-29T21:00:00.000Z');
      expect(otherDayHole.isDaylightHole).toBe(true);
      expect(otherDayHole.startDateUTC).toBeUndefined();
      expect(otherDayHole.startDate.getTime()).toBe(otherDayHole.endDate.getTime());
      expect(otherDayHole.startDate.getHours()).toBe(23);
      expect(timePanel[23]).toBe('11:00 PM');
      expect(timePanel[24]).toBe('11:00 PM');

      const firstGeometry = POM.getAppointment('A').getGeometry();
      const secondGeometry = POM.getAppointment('B').getGeometry();

      expect(firstGeometry.top).toBe(23 * DEFAULT_CELL_HEIGHT);
      expect(secondGeometry.top).toBe(24 * DEFAULT_CELL_HEIGHT);
      expect(firstGeometry.height).toBe(20);
      expect(secondGeometry.height).toBe(20);

      const { cellsSelectionState } = scheduler.getWorkSpace();

      cellsSelectionState.setFocusedCell(24, 0, false);
      expect(cellsSelectionState.getFocusedCell()).toBeUndefined();

      cellsSelectionState.setFocusedCell(24, transitionColumn, false);
      expect(cellsSelectionState.getFocusedCell()?.cellData.startDateUTC
        ?.toISOString()).toBe('2026-10-29T21:00:00.000Z');

      expect(firstPass.startDate.toISOString()).toBe(matchesScheduler
        ? '2026-10-29T20:00:00.000Z'
        : '2026-10-29T23:00:00.000Z');
    });

    it('leaves a hole where the spring-forward hour is missing', async () => {
      const { scheduler, POM } = await createScheduler({
        views: [{ type: 'week', cellDuration: 60 }],
        currentView: 'week',
        currentDate: SPRING_DATE,
        timeZone: 'Africa/Cairo',
      });
      const table = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap;
      const transitionColumn = 5;

      expect(table).toHaveLength(24);
      expect(table[0][transitionColumn].cellData.isDaylightHole).toBe(true);
      expect(table[0][0].cellData.startDate.getHours()).toBe(0);
      expect(table[0][0].cellData.isDaylightHole).toBeUndefined();
      expect(table[1][transitionColumn].cellData.startDate.getHours()).toBe(1);
      expect(table[1][transitionColumn].cellData.startDateUTC?.toISOString())
        .toBe('2026-04-23T22:00:00.000Z');
      expect(POM.getTimePanelContent()[0]).toBe('12:00 AM');
    });

    it('starts a spring day view at 01:00 with no midnight row', async () => {
      const { scheduler, POM } = await createScheduler({
        views: [{ type: 'day', cellDuration: 60 }],
        currentView: 'day',
        currentDate: SPRING_DATE,
        timeZone: 'Africa/Cairo',
      });
      const table = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap;

      expect(table).toHaveLength(23);
      expect(table[0][0].cellData.startDate.getHours()).toBe(1);
      expect(table[0][0].cellData.startDateUTC?.toISOString()).toBe('2026-04-23T22:00:00.000Z');
      expect(table.some((row) => row[0].cellData.isDaylightHole)).toBe(false);
      expect(POM.getTimePanelContent()[0]).toBe('1:00 AM');
    });
  });
};

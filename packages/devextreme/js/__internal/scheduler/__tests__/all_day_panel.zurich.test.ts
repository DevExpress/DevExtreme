/**
 * @timezone Europe/Zurich
 */
import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const groupCount = 3;
const daysInWeek = 7;
const appointmentDayIndex = 4;

const resources = [{
  fieldExpr: 'ownerId',
  dataSource: Array.from({ length: groupCount }, (_, i) => ({ id: i, text: `Owner ${i}` })),
}];

const dataSource = Array.from({ length: groupCount }, (_, i) => ({
  text: `Owner ${i} appointment`,
  ownerId: i,
  startDate: new Date('2021-10-29T17:00:00.000Z'),
  endDate: new Date('2021-10-29T18:00:00.000Z'),
  allDay: true,
}));

const getExpectedLeft = (groupIndex: number): number => (
  groupIndex * daysInWeek + appointmentDayIndex
) * DEFAULT_CELL_WIDTH;

describe('All-day panel on DST end week in Europe/Zurich', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render grouped all-day appointments in their own day cells (T1337427)', async () => {
    const { POM } = await createScheduler({
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 9, 28),
      firstDayOfWeek: 1,
      startDayHour: 9,
      groups: ['ownerId'],
      resources,
      dataSource,
    });

    const lefts = dataSource.map(({ text }) => POM.getAppointment(text).getGeometry().left);

    expect(lefts).toEqual([0, 1, 2].map(getExpectedLeft));
  });
});

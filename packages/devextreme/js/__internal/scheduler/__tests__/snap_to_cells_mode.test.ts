import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import {
  DEFAULT_CELL_HEIGHT,
  setupSchedulerTestEnvironment,
} from './__mock__/mock_scheduler';

describe('snapToCellsMode', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('default snapToCellsMode on day view', async () => {
    const { POM } = await createScheduler({
      width: 800,
      height: 600,
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2026, 2, 15),
      cellDuration: 30,
      startDayHour: 9,
      endDayHour: 18,
      dataSource: [{
        text: 'short',
        startDate: new Date(2026, 2, 15, 10, 0),
        endDate: new Date(2026, 2, 15, 10, 10),
      }],
    });

    const appH = POM.getAppointment('short').getGeometry().height;

    expect(appH).toBeLessThan(DEFAULT_CELL_HEIGHT / 2);
  });

  it('root snapToCellsMode always overrides default on day view', async () => {
    const { POM } = await createScheduler({
      width: 800,
      height: 600,
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2026, 2, 15),
      cellDuration: 30,
      startDayHour: 9,
      endDayHour: 18,
      dataSource: [{
        text: 'short',
        startDate: new Date(2026, 2, 15, 10, 0),
        endDate: new Date(2026, 2, 15, 10, 10),
      }],
      snapToCellsMode: 'always',
    });

    const appH = POM.getAppointment('short').getGeometry().height;

    expect(appH).toEqual(DEFAULT_CELL_HEIGHT);
  });

  it('changing snapToCellsMode at runtime regenerates appointment view model', async () => {
    const { POM, scheduler } = await createScheduler({
      width: 800,
      height: 600,
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2026, 2, 15),
      cellDuration: 30,
      startDayHour: 9,
      endDayHour: 18,
      dataSource: [{
        text: 'short',
        startDate: new Date(2026, 2, 15, 10, 0),
        endDate: new Date(2026, 2, 15, 10, 10),
      }],
    });

    let appH = POM.getAppointment('short').getGeometry().height;

    expect(appH).toBeLessThan(DEFAULT_CELL_HEIGHT / 2);

    scheduler.option('snapToCellsMode', 'always');
    await new Promise(process.nextTick);

    appH = POM.getAppointment('short').getGeometry().height;

    expect(appH).toEqual(DEFAULT_CELL_HEIGHT);
  });

  it('views[].snapToCellsMode always overrides default on day view', async () => {
    const { POM } = await createScheduler({
      width: 800,
      height: 600,
      views: [{ type: 'day', snapToCellsMode: 'always' }],
      currentView: 'day',
      currentDate: new Date(2026, 2, 15),
      cellDuration: 30,
      startDayHour: 9,
      endDayHour: 18,
      dataSource: [{
        text: 'short',
        startDate: new Date(2026, 2, 15, 10, 0),
        endDate: new Date(2026, 2, 15, 10, 10),
      }],
    });

    const appH = POM.getAppointment('short').getGeometry().height;

    expect(appH).toEqual(DEFAULT_CELL_HEIGHT);
  });
});

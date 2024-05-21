import asyncForEach from '../../../../helpers/asyncForEach';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Layout:AllDayPanelMode`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const ALL_DAY_PANEL_OPTION_NAME = 'allDayPanelMode';

[
  {
    testCaseName: 'Usual appointment',
    dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T10:00:00', text: 'Usual appt' }],
    modesOrder: ['all', 'allDay', 'hidden'],
    expectedCollapsed: [true, true, false],
    expectedVisible: [true, true, false],
  },
  {
    testCaseName: 'Usual appointment reverse',
    dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T10:00:00', text: 'Usual appt' }],
    modesOrder: ['hidden', 'allDay', 'all'],
    expectedCollapsed: [false, true, true],
    expectedVisible: [false, true, true],
  },
  {
    testCaseName: 'Long appointment',
    dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2024-01-01T00:00:00', text: 'Long appt' }],
    modesOrder: ['all', 'allDay', 'hidden'],
    expectedCollapsed: [false, true, false],
    expectedVisible: [true, true, false],
  },
  {
    testCaseName: 'Long appointment reverse',
    dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2024-01-01T00:00:00', text: 'Long appt' }],
    modesOrder: ['hidden', 'allDay', 'all'],
    expectedCollapsed: [false, true, false],
    expectedVisible: [false, true, true],
  },
  {
    testCaseName: 'All-day appointment',
    dataSource: [{
      startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T00:00:00', text: 'All-day appt', allDay: true,
    }],
    modesOrder: ['all', 'allDay', 'hidden'],
    expectedCollapsed: [false, false, false],
    expectedVisible: [true, true, false],
  },
  {
    testCaseName: 'All-day appointment reverse',
    dataSource: [{
      startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T00:00:00', text: 'All-day appt', allDay: true,
    }],
    modesOrder: ['hidden', 'allDay', 'all'],
    expectedCollapsed: [false, false, false],
    expectedVisible: [false, true, true],
  },
].forEach(({
  testCaseName,
  dataSource,
  modesOrder,
  expectedCollapsed,
  expectedVisible,
}) => {
  test(
    `${testCaseName}: AllDayPanel visibility and collapsed state should be correct in runtime`,
    async (t) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await asyncForEach(modesOrder, async (mode, idx) => {
        await scheduler.option(ALL_DAY_PANEL_OPTION_NAME, mode);

        const isAllDayPanelCollapsed = await scheduler.isAllDayPanelCollapsed();
        const isAllDayPanelVisible = await scheduler.allDayRow.exists;

        await t.expect(isAllDayPanelCollapsed)
          .eql(
            expectedCollapsed[idx],
            `allDayPanel (mode: ${mode}) should be ${expectedCollapsed[idx] ? 'collapsed' : 'extended'}`,
          );
        await t.expect(isAllDayPanelVisible)
          .eql(
            expectedVisible[idx],
            `allDayPanel (mode: ${mode}) should be ${expectedVisible[idx] ? 'visible' : 'hidden'}`,
          );
      });
    },
  ).before(async () => {
    await createWidget('dxScheduler', {
      currentView: 'week',
      currentDate: '2023-12-01',
      dataSource,
    });
  });
});

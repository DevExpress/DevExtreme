import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';

import { createWidget, disposeWidget } from '../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../helpers/domUtils';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture.disablePageReloads`Offset: Markup appointments ordering`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

test('Appointments are ordered correctly with both recurrent and usual appointments (T1212573)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot(
    'view_markup_ordering-appts_T1212573.png',
    scheduler.workSpace,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const data = [
    {
      text: 'Recurr 1',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    }, {
      text: 'Recurr 2',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,WE;COUNT=10',
    }, {
      text: 'Recurr 3',
      startDate: new Date('2020-11-01T20:00:00.000Z'),
      endDate: new Date('2020-11-01T21:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU;WKST=TU;INTERVAL=2;COUNT=2',
    }, {
      text: 'Recurr 4',
      startDate: new Date('2020-11-01T17:00:00.000Z'),
      endDate: new Date('2020-11-01T17:15:00.000Z'),
      recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203',
    }, {
      text: 'Test 1',
      startDate: new Date('2020-11-01T15:00:00.000Z'),
      endDate: new Date('2020-11-01T15:30:00.000Z'),
    }, {
      text: 'Test 2',
      startDate: new Date('2020-11-01T18:00:00.000Z'),
      endDate: new Date('2020-11-01T18:30:00.000Z'),
    }, {
      text: 'Test 3',
      startDate: new Date('2020-11-02T15:00:00.000Z'),
      endDate: new Date('2020-11-02T15:30:00.000Z'),
    }, {
      text: 'Test 4',
      startDate: new Date('2020-11-02T18:00:00.000Z'),
      endDate: new Date('2020-11-02T18:30:00.000Z'),
    }, {
      text: 'Test 5',
      startDate: new Date('2020-11-03T15:00:00.000Z'),
      endDate: new Date('2020-11-03T15:30:00.000Z'),
    }, {
      text: 'Test 6',
      startDate: new Date('2020-11-03T18:00:00.000Z'),
      endDate: new Date('2020-11-03T18:30:00.000Z'),
    }, {
      text: 'Test 7',
      startDate: new Date('2020-11-04T15:00:00.000Z'),
      endDate: new Date('2020-11-04T15:30:00.000Z'),
    }, {
      text: 'Test 8',
      startDate: new Date('2020-11-04T18:00:00.000Z'),
      endDate: new Date('2020-11-04T18:30:00.000Z'),
    },
  ];

  await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
  await createWidget('dxScheduler', {
    currentDate: '2020-11-07',
    height: 800,
    dataSource: data,
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
  });
}).after(async () => {
  await removeStylesheetRulesFromPage();
  await disposeWidget('dxScheduler');
});

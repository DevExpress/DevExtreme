import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Scheduler: Grouping overflow`
  .page(url(__dirname, '../../container.html'));

['week', 'month'].forEach((viewType) => {
  ['vertical', 'horizontal'].forEach((groupOrientation) => {
    ['hidden', 'allDay'].forEach((allDayPanelMode) => {
      [[9, 14, 60], [0, 24, 360]].forEach(([startDayHour, endDayHour, cellDuration]) => {
        const allParams = `${viewType}-${groupOrientation}-${allDayPanelMode}-${startDayHour}-${endDayHour}`;

        safeSizeTest(`Long appointments should not overflow group view (${allParams})`, async (t) => {
          const scheduler = new Scheduler('#container');
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          await t
            .expect(await takeScreenshot(`group-overflow-(${allParams}).png`, scheduler.element))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }, [1200, 800]).before(async () => createWidget('dxScheduler', {
          dataSource: [
            {
              text: '1',
              priorityId: 1,
              startDate: '2021-04-19T16:30:00',
              endDate: '2021-04-25T18:30:00',
            }, {
              text: '2',
              priorityId: 2,
              startDate: '2021-04-19T16:30:00',
              endDate: '2021-04-25T18:30:00',
            }, {
              text: '3',
              priorityId: 3,
              startDate: '2021-04-19T16:30:00',
              endDate: '2021-04-25T18:30:00',
            },
          ],
          views: [{
            type: viewType,
            name: 'myView',
            groupOrientation,
          }],
          cellDuration,
          currentView: 'myView',
          currentDate: new Date(2021, 3, 21),
          allDayPanelMode,
          startDayHour,
          endDayHour,
          groups: ['priorityId'],
          resources: [
            {
              fieldExpr: 'priorityId',
              dataSource: [
                {
                  text: 'Low Priority',
                  id: 1,
                  color: '#1e90ff',
                }, {
                  text: 'High Priority',
                  id: 2,
                  color: '#ff9747',
                },
                {
                  text: 'Custom',
                  id: 3,
                  color: 'red',
                },
              ],
            },
          ],
          showAllDayPanel: false,
        }));
      });
    });
  });
});

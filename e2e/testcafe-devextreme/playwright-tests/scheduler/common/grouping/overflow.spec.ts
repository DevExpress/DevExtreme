import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Scheduler: Grouping overflow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['week', 'month'].forEach((viewType) => {
    ['vertical', 'horizontal'].forEach((groupOrientation) => {
      ['hidden', 'allDay'].forEach((allDayPanelMode) => {
        [[9, 14, 60], [0, 24, 360]].forEach(([startDayHour, endDayHour, cellDuration]) => {
          const allParams = `${viewType}-${groupOrientation}-${allDayPanelMode}-${startDayHour}-${endDayHour}`;

          test(`Long appointments should not overflow group view (${allParams})`, async ({ page }) => {
            await createWidget(page, 'dxScheduler', {
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
            });

            await testScreenshot(page, `group-overflow-(${allParams}).png`, {
              element: page.locator('.dx-scheduler'),
            });
          });
        });
      });
    });
  });
});

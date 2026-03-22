import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const createScheduler = async (page, groups: undefined | string[], rtlEnabled: boolean): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      { text: 'Website Re-Design Plan', priorityId: 2, startDate: new Date(2021, 4, 21, 16, 30), endDate: new Date(2021, 4, 21, 18, 30) },
      { text: 'Approve Personal Computer Upgrade Plan', priorityId: 2, startDate: new Date(2021, 4, 21, 17), endDate: new Date(2021, 4, 21, 18) },
      { text: 'Install New Database', priorityId: 1, startDate: new Date(2021, 4, 21, 16), endDate: new Date(2021, 4, 21, 19, 15) },
      { text: 'Approve New Online Marketing Strategy', priorityId: 1, startDate: new Date(2021, 4, 21, 19), endDate: new Date(2021, 4, 21, 21) },
    ],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 21),
    rtlEnabled,
    groups,
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: [
        { text: 'Low Priority', id: 1, color: '#1e90ff' },
        { text: 'High Priority', id: 2, color: '#ff9747' },
      ],
      label: 'Priority',
    }],
  });
};

test.describe('Agenda:adaptive', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [false, true].forEach((rtlEnabled) => {
    [
      { groups: undefined, text: 'without-groups' },
      { groups: ['priorityId'], text: 'groups' },
    ].forEach((testCase) => {
      test(`${testCase.text} adaptive rtl=${rtlEnabled}`, async ({ page }) => {
        await createScheduler(page, testCase.groups, rtlEnabled);
        await testScreenshot(page, `agenda-${testCase.text}-adaptive-rtl=${rtlEnabled}.png`);
      });
    });
  });
});

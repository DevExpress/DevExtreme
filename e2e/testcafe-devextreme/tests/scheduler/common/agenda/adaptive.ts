import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { ADAPTIVE_SIZE } from '../const';

fixture.disablePageReloads`Agenda:adaptive`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async (groups: undefined | string[], rtlEnabled: boolean):
Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Website Re-Design Plan',
      priorityId: 2,
      startDate: new Date(2021, 4, 21, 16, 30),
      endDate: new Date(2021, 4, 21, 18, 30),
    }, {
      text: 'Approve Personal Computer Upgrade Plan',
      priorityId: 2,
      startDate: new Date(2021, 4, 21, 17),
      endDate: new Date(2021, 4, 21, 18),
    }, {
      text: 'Install New Database',
      priorityId: 1,
      startDate: new Date(2021, 4, 21, 16),
      endDate: new Date(2021, 4, 21, 19, 15),
    }, {
      text: 'Approve New Online Marketing Strategy',
      priorityId: 1,
      startDate: new Date(2021, 4, 21, 19),
      endDate: new Date(2021, 4, 21, 21),
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 21),
    rtlEnabled,
    groups,
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: [{
        text: 'Low Priority',
        id: 1,
        color: '#1e90ff',
      }, {
        text: 'High Priority',
        id: 2,
        color: '#ff9747',
      }],
      label: 'Priority',
    }],
  });
};

[false, true].forEach((rtlEnabled) => {
  [{
    groups: undefined,
    text: 'without-groups',
  }, {
    groups: ['priorityId'],
    text: 'groups',
  }].forEach((testCase) => {
      test.meta({ browserSize: ADAPTIVE_SIZE })(testCase.text, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `agenda-${testCase.text}-adaptive-rtl=${rtlEnabled}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    })
      .before(async () => createScheduler(testCase.groups, rtlEnabled));
  });
});

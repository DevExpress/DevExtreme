import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { ADAPTIVE_SIZE } from '../const';

fixture`Agenda:adaptive`
  .page(url(__dirname, '../../container.html'));

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
    safeSizeTest(testCase.text, async (t) => {
      await t.expect(await compareScreenshot(t, `agenda-${testCase.text}-adaptive-rtl=${rtlEnabled}.png`)).ok();
    }, ADAPTIVE_SIZE)
      .before(async () => createScheduler(testCase.groups, rtlEnabled));
  });
});

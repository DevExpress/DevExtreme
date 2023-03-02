import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Renovated scheduler - Virtual Scrolling');

const resources = [{
  id: 0,
  text: 'David Carter',
  color: '#74d57b',
}, {
  id: 1,
  text: 'Emma Lewis',
  color: '#1db2f5',
}, {
  id: 2,
  text: 'Noah Hill',
  color: '#f5564a',
}, {
  id: 3,
  text: 'William Bell',
  color: '#97c95c',
}, {
  id: 4,
  text: 'Jane Jones',
  color: '#ffc720',
}, {
  id: 5,
  text: 'Violet Young',
  color: '#eb3573',
}, {
  id: 6,
  text: 'Samuel Perry',
  color: '#a63db8',
}, {
  id: 7,
  text: 'Luther Murphy',
  color: '#ffaa66',
}, {
  id: 8,
  text: 'Craig Morris',
  color: '#2dcdc4',
}, {
  id: 9,
  text: 'Sandy Wood',
  color: '#c34cb9',
}, {
  id: 10,
  text: 'Susan Bennett',
  color: '#3d44ec',
}, {
  id: 11,
  text: 'Lilly Barnes',
  color: '#4ddcca',
}, {
  id: 12,
  text: 'Marcus Price',
  color: '#2ec98d',
}, {
  id: 13,
  text: 'David Stewart',
  color: '#3ff6ca',
}, {
  id: 14,
  text: 'Joseph Smith',
  color: '#f665aa',
}, {
  id: 15,
  text: 'Carter Wilson',
  color: '#d1c974',
}, {
  id: 16,
  text: 'Wyatt Lopez',
  color: '#ff6741',
}, {
  id: 17,
  text: 'John Long',
  color: '#ee53dc',
}, {
  id: 18,
  text: 'Jack Rivera',
  color: '#795ac3',
}, {
  id: 19,
  text: 'Victoria Adams',
  color: '#ff7d8a',
}, {
  id: 20,
  text: 'Madison Anderson',
  color: '#4cd482',
}, {
  id: 21,
  text: 'Luna Moore',
  color: '#9d67cc',
}, {
  id: 22,
  text: 'Michael Bailey',
  color: '#5ab1ef',
}, {
  id: 23,
  text: 'Jenny Powell',
  color: '#68e18f',
}, {
  id: 24,
  text: 'Daniel Peterson',
  color: '#4dd155',
}, {
  id: 25,
  text: 'Gabriel Gray',
  color: '#ef9e44',
}, {
  id: 26,
  text: 'Anthony Robinson',
  color: '#45a5cc',
}, {
  id: 27,
  text: 'Ellie Tomson',
  color: '#a067bd',
}, {
  id: 28,
  text: 'Natalie Adams',
  color: '#3d44ec',
}, {
  id: 29,
  text: 'Sofia Green',
  color: '#4ddcca',
}];

[
  'day',
  'week',
  'month',
  'timelineDay',
  'timelineWeek',
  'timelineMonth',
].forEach((view) => {
  test(
    `virtual scrolling should work in "${view}" view`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await t
        .expect(await compareScreenshot(
          t,
          `virtual_scrolling_in_${view}.png`,
          scheduler.workSpace,
          screenshotComparerOptions,
        ))
        .ok();
    },
  ).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        dataSource: [],
        views: [view],
        currentView: view,
        currentDate: new Date(2021, 3, 4),
        startDayHour: 9,
        endDayHour: 14,
        groups: ['personId'],
        resources: [{
          fieldExpr: 'personId',
          dataSource: resources,
          label: 'Priority',
        }],
        showCurrentTimeIndicator: false,
        scrolling: { mode: 'virtual' },
        height: 600,
      });
    },
  ).after(async (t) => restoreBrowserSize(t));
});

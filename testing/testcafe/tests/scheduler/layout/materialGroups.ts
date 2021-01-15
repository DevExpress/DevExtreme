import { compareScreenshot } from '../../../helpers/screenshort-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler: Material theme layout`
  .page(url(__dirname, './material.html'));

const createScheduler = async (options = {}) => {
  await createWidget('dxScheduler', options, true);
};

const createDataSetForScreenShotTests = () => {
  const result: {
    text: string;
    startDate: Date;
    endDate: Date;
    priorityId: number;
    allDay?: boolean;
  }[] = [];
    // eslint-disable-next-line no-plusplus
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment',
      startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1),
      priorityId: 0,
    });

    result.push({
      text: '2 appointment',
      startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2),
      priorityId: 1,
    });

    result.push({
      text: '3 appointment',
      startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5),
      allDay: true,
      priorityId: 0,
    });
  }

  return result;
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`General layout test in material theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `material-layout-with-groups-${view}-${groupOrientation}.png`)).ok();
    }).before(() => createScheduler({
      dataSource: createDataSetForScreenShotTests(),
      currentDate: new Date(2020, 6, 15),
      startDayHour: 0,
      endDayHour: 4,
      views: [{
        type: view,
        name: view,
        groupOrientation,
      }],
      currentView: view,
      crossScrollingEnabled: true,
      resources: [{
        fieldExpr: 'priorityId',
        dataSource: [
          {
            text: 'Low Priority',
            id: 0,
            color: '#24ff50',
          }, {
            text: 'High Priority',
            id: 1,
            color: '#ff9747',
          },
        ],
        label: 'Priority',
      }],
      groups: ['priorityId'],
      height: 700,
    }));
  });
});

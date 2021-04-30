import { ClientFunction } from 'testcafe';

export const resources = [{
  fieldExpr: 'resourceId',
  allowMultiple: true,
  dataSource: [
    {
      text: 'Resource 0',
      id: 0,
      color: '#20B2AA',
    }, {
      text: 'Resource 1',
      id: 1,
      color: '#87CEEB',
    }, {
      text: 'Resource 2',
      id: 2,
      color: '#228B22',
    }, {
      text: 'Resource 3',
      id: 3,
      color: '#98FB98',
    }, {
      text: 'Resource 4',
      id: 4,
      color: '#2E8B57',
    }, {
      text: 'Resource 5',
      id: 5,
      color: '#66CDAA',
    }, {
      text: 'Resource 6',
      id: 6,
      color: '#008080',
    }, {
      text: 'Resource 7',
      id: 7,
      color: '#00FFFF',
    },
  ],
  label: 'Priority',
}];

export const views = [{
  type: 'day',
  intervalCount: 7,
}, {
  type: 'week',
  intervalCount: 10,
}, {
  type: 'month',
}, {
  type: 'timelineDay',
  intervalCount: 7,
}, {
  type: 'timelineWeek',
  intervalCount: 3,
}, {
  type: 'timelineMonth',
}];

export const verticalViews = views
  .map((view) => ({
    ...view,
    groupOrientation: 'vertical',
  }));
export const horizontalViews = views
  .map((view) => ({
    ...view,
    groupOrientation: 'horizontal',
  }));
export const groupedByDateViews = views
  .map((view) => ({
    ...view,
    groupOrientation: 'horizontal',
    groupByDate: true,
  }));

export const createDataSetForScreenShotTests = (): Record<string, unknown>[] => {
  const result: {
    text: string;
    startDate: Date;
    endDate: Date;
    resourceId: number[];
    allDay?: boolean;
  }[] = [];
  for (let day = 1; day < 31; day += 1) {
    result.push({
      text: '1 appointment',
      startDate: new Date(2021, 0, day, 0),
      endDate: new Date(2021, 0, day, 1),
      resourceId: [0, 1, 2, 3, 4, 5, 6, 7],
    });

    result.push({
      text: '2 appointment',
      startDate: new Date(2021, 0, day, 2),
      endDate: new Date(2021, 0, day, 3),
      resourceId: [0, 1, 2, 3, 4, 5, 6, 7],
    });
  }

  return result;
};

export const scrollTo = ClientFunction((date) => {
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollTo(date);
});

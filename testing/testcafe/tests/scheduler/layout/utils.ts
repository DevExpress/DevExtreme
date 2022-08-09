export const viewsWithAllDay = [
  'day',
  'week',
  'month',
] as const;

export const viewsWithoutAllDay = [
  'timelineDay',
  'timelineWeek',
  'timelineMonth',
] as const;

export type TViewTypes = typeof viewsWithAllDay | typeof viewsWithoutAllDay;

export interface ITestAppointment {
  text: string;
  startDate: Date;
  endDate: Date;
  priorityId: number;
  allDay?: boolean;
}

export interface ITestViewWithGrouping {
  type: string;
  groupOrientation: string;
}

export const resourceDataSource = [{
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
}];

export const getVerticalViews = (views: TViewTypes): ITestViewWithGrouping[] => views
  .map((viewType) => ({
    type: viewType,
    groupOrientation: 'vertical',
  }));

export const getHorizontalViews = (views: TViewTypes): ITestViewWithGrouping[] => views
  .map((viewType) => ({
    type: viewType,
    groupOrientation: 'horizontal',
  }));

// NOTE: Array from 1 to 24 range.
const DATA_SET_DAYS = new Array(24).fill(0).map((_, idx) => idx + 1);

export const createDataSetWithAllDay = (): ITestAppointment[] => DATA_SET_DAYS
  .reduce<ITestAppointment[]>((result, dayIdx) => {
  result.push({
    text: '1 appointment',
    startDate: new Date(2020, 6, dayIdx, 0),
    endDate: new Date(2020, 6, dayIdx, 1),
    priorityId: 0,
  });

  result.push({
    text: '2 appointment',
    startDate: new Date(2020, 6, dayIdx, 1),
    endDate: new Date(2020, 6, dayIdx, 2),
    priorityId: 1,
  });

  result.push({
    text: '3 appointment',
    startDate: new Date(2020, 6, dayIdx, 3),
    endDate: new Date(2020, 6, dayIdx, 5),
    allDay: true,
    priorityId: 0,
  });

  return result;
}, []);

export const createDataSetWithoutAllDay = (): ITestAppointment[] => DATA_SET_DAYS
  .reduce<ITestAppointment[]>((result, dayIdx) => {
  result.push({
    text: '1 appointment',
    startDate: new Date(2020, 6, dayIdx, 0),
    endDate: new Date(2020, 6, dayIdx, 1),
    priorityId: 0,
  });

  result.push({
    text: '2 appointment',
    startDate: new Date(2020, 6, dayIdx, 1),
    endDate: new Date(2020, 6, dayIdx, 2),
    priorityId: 1,
  });

  result.push({
    text: '3 long appointment',
    startDate: new Date(2020, 6, dayIdx, 0),
    endDate: new Date(2020, 6, dayIdx + 1, 0),
    priorityId: 0,
  });

  return result;
}, []);

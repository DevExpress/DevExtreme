import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

import type {
  Appointment,
  Orientation,
  ScrollMode,
  ViewType,
} from 'devextreme/ui/scheduler';

import { generateOptionMatrix } from '../../../../helpers/generateOptionMatrix';
import { scrollTo } from '../../virtualScrolling/utils';

fixture.disablePageReloads`Layout:Templates:appointmentTemplate:targetedData`
  .page(url(__dirname, '../../../container.html'));

const getResourceCount = (
  viewType: ViewType,
  scrollMode: ScrollMode,
  groupOrientation: Orientation,
): number => {
  if (
    (viewType === 'workWeek'
      || viewType === 'timelineWorkWeek'
      || viewType === 'week'
      || viewType === 'timelineWeek')
    && (scrollMode === 'standard' && groupOrientation === 'horizontal')
  ) {
    return 2;
  }

  if (scrollMode === 'standard') {
    return 10;
  }

  return 30;
};

const getGroupAppointmentDates = (viewType: ViewType): Date[] => {
  const isWorkWeek = viewType === 'workWeek' || viewType === 'timelineWorkWeek';

  if (isWorkWeek || viewType === 'week' || viewType === 'timelineWeek') {
    const [
      dayCount,
      startDate,
    ] = isWorkWeek
      ? [5, new Date(2024, 0, 1, 8)]
      : [7, new Date(2023, 11, 31, 8)];

    return Array.from(
      { length: 12 * dayCount },
      (_, index) => {
        const result = new Date(startDate);
        result.setDate(result.getDate() + Math.floor(index / 12));
        result.setHours(result.getHours() + (index % 12));
        return result;
      },
    );
  }

  if (viewType === 'month' || viewType === 'timelineMonth') {
    return Array.from(
      { length: 31 },
      (_, index) => {
        const result = new Date(2024, 0, 1, 8);
        result.setDate(result.getDate() + index);
        return result;
      },
    );
  }

  const startDate = viewType === 'agenda'
    ? new Date(2024, 0, 1, 8)
    : new Date(2024, 0, 2, 8);

  return Array.from(
    { length: 12 },
    (_, index) => {
      const result = new Date(startDate);
      result.setHours(result.getHours() + index);
      return result;
    },
  );
};

const viewTypes: ViewType[] = [
  'agenda',
  'day',
  'week',
  'workWeek',
  'month',
  'timelineDay',
  'timelineWeek',
  'timelineWorkWeek',
  'timelineMonth',
];

const groupOrientations: Orientation[] = ['horizontal', 'vertical'];
const scrollModes: ScrollMode[] = ['standard', 'virtual'];
const rtlEnabledOptions: boolean[] = [false, true];

const testOptions = generateOptionMatrix({
  viewType: viewTypes,
  groupOrientation: groupOrientations,
  scrollMode: scrollModes,
  rtlEnabled: rtlEnabledOptions,
}, [
  // Not supported
  {
    viewType: 'agenda',
    scrollMode: 'virtual',
  },
  // Not supported
  {
    viewType: 'agenda',
    groupOrientation: 'horizontal',
  },
  {
    viewType: 'day',
    groupOrientation: 'vertical',
    scrollMode: 'standard',
  },
  {
    viewType: 'week',
    groupOrientation: 'vertical',
    scrollMode: 'standard',
  },
  {
    viewType: 'workWeek',
    groupOrientation: 'vertical',
    scrollMode: 'standard',
  },
  {
    viewType: 'day',
    groupOrientation: 'horizontal',
    rtlEnabled: true,
  },
  {
    viewType: 'week',
    groupOrientation: 'horizontal',
    rtlEnabled: true,
  },
  {
    viewType: 'workWeek',
    groupOrientation: 'horizontal',
    rtlEnabled: true,
  },
  {
    viewType: 'month',
    groupOrientation: 'horizontal',
    rtlEnabled: true,
  },
  {
    viewType: 'timelineDay',
    groupOrientation: 'vertical',
    rtlEnabled: true,
  },
  {
    viewType: 'timelineWeek',
    groupOrientation: 'vertical',
    rtlEnabled: true,
  },
  {
    viewType: 'timelineWorkWeek',
    groupOrientation: 'vertical',
    rtlEnabled: true,
  },
  {
    viewType: 'timelineMonth',
    groupOrientation: 'vertical',
    rtlEnabled: true,
  },
]);

// NOTE: no assertions are present, checking but not throwing an error in a template function
testOptions.forEach(({
  viewType,
  groupOrientation,
  scrollMode,
  rtlEnabled,
}) => {
  test(`targetedAppointmentData should be correct with groups (viewType="${viewType}", groupOrientation="${groupOrientation}", scrollMode="${scrollMode}", rtlEnabled="${rtlEnabled}") (T1205120)`, async (t) => {
    const currentDate = new Date(2024, 0, 2);
    const HOUR = 1000 * 60 * 60;
    const resourceCount = getResourceCount(viewType, scrollMode, groupOrientation);
    const appointmentDates = getGroupAppointmentDates(viewType);

    const datesToCheck = [
      appointmentDates[0],
      appointmentDates[Math.floor(appointmentDates.length / 3)],
      appointmentDates[appointmentDates.length - 1],
    ];

    const groupsToCheck = [
      { groupId: 0 },
      { groupId: Math.floor(resourceCount / 3) },
      { groupId: resourceCount - 1 },
    ];

    const resourceDataSource = Array.from({ length: resourceCount }, (_, index) => ({
      id: index,
      text: `Resource ${index}`,
    }));

    const appointments = resourceDataSource.reduce<Appointment[]>((acc, resource) => acc.concat(
      appointmentDates
        .map<Appointment>((date) => ({
        text: resource.text,
        startDate: date,
        endDate: new Date(date.getTime() + HOUR / 2),
        groupId: resource.id,
      })),
    ), []);

    await createWidget('dxScheduler', {
      rtlEnabled,
      height: 600,
      width: 800,
      currentDate,
      startDayHour: 8,
      endDayHour: 20,
      scrolling: {
        mode: scrollMode,
      },
      groups: ['groupId'],
      views: [
        {
          type: viewType,
          groupOrientation,
        },
      ],
      currentView: viewType,
      dataSource: appointments,
      resources: [
        {
          fieldExpr: 'groupId',
          allowMultiple: true,
          dataSource: resourceDataSource,
          label: 'Employees',
          displayExpr: 'id',
        },
      ],
      appointmentTemplate(model, _, element) {
        const { groupId: targetedId } = model.targetedAppointmentData;
        const { groupId } = model.appointmentData;

        if (groupId !== targetedId) {
          throw new Error('Group ID and targeted ID are mismatched');
        }

        element.append(`tid[${targetedId}] gid[${groupId}]`);
        return element;
      },
    });

    if (scrollMode !== 'virtual') {
      return;
    }

    const scrollOptions = generateOptionMatrix({
      date: datesToCheck,
      group: groupsToCheck,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const { date, group } of scrollOptions) {
      await scrollTo(date, group);
      await t.wait(50);
    }
  });
});

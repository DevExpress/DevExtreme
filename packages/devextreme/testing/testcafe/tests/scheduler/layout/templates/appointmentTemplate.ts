import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

import type {
  Appointment,
  Orientation,
  ScrollMode,
  ViewType,
} from '../../../../../../js/ui/scheduler';

import { generateOptionMatrix } from '../../../../helpers/generateOptionMatrix';
import { scrollTo } from '../../virtualScrolling/utils';

fixture.disablePageReloads`Layout:Templates:appointmentTemplate`
  .page(url(__dirname, '../../../container.html'));

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'agenda'].forEach((currentView) => {
  test(`appointmentTemplate layout should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`appointment-template-currentView=${currentView}.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        startDate: new Date(2017, 4, 21, 0, 30),
        endDate: new Date(2017, 4, 21, 2, 30),
      }, {
        startDate: new Date(2017, 4, 22, 0, 30),
        endDate: new Date(2017, 4, 22, 2, 30),
      }, {
        startDate: new Date(2017, 4, 23, 0, 30),
        endDate: new Date(2017, 4, 23, 2, 30),
      }, {
        startDate: new Date(2017, 4, 24, 0, 30),
        endDate: new Date(2017, 4, 24, 2, 30),
      }, {
        startDate: new Date(2017, 4, 25, 0, 30),
        endDate: new Date(2017, 4, 25, 2, 30),
      }, {
        startDate: new Date(2017, 4, 26, 0, 30),
        endDate: new Date(2017, 4, 26, 2, 30),
      }, {
        startDate: new Date(2017, 4, 27, 0, 30),
        endDate: new Date(2017, 4, 27, 2, 30),
      }],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      appointmentTemplate: ClientFunction((appointment) => {
        const result = $('<div  style=\'display: flex; flex-wrap: wrap;\' />');

        const startDateBox = ($('<div />') as any).dxDateBox({
          type: 'datetime',
          value: appointment.appointmentData.startDate,
        });

        const endDateBox = ($('<div />') as any).dxDateBox({
          type: 'datetime',
          value: appointment.appointmentData.endDate,
        });

        result.append(startDateBox, endDateBox);

        return result;
      }),
      height: 600,
    });
  });
});

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

testOptions.forEach(({
  viewType,
  groupOrientation,
  scrollMode,
  rtlEnabled,
}) => {
  const currentDate = new Date(2024, 0, 2);
  const HOUR = 1000 * 60 * 60;

  const startDayHour = 8;
  const endDayHour = 20;

  let resourceCount = 30;

  let appointmentDates: Date[];

  if (scrollMode === 'standard') {
    resourceCount = 10;
  }

  switch (viewType) {
    case 'agenda': {
      appointmentDates = Array.from(
        { length: 12 },
        (_, index) => {
          const result = new Date(2024, 0, 1, 8);
          result.setHours(result.getHours() + index);
          return result;
        },
      );

      break;
    }
    case 'week':
    case 'timelineWeek': {
      if (scrollMode === 'standard' && groupOrientation === 'horizontal') {
        resourceCount = 2;
      }

      appointmentDates = Array.from(
        { length: 12 * 7 },
        (_, index) => {
          const result = new Date(2023, 11, 31, 8);
          result.setDate(result.getDate() + Math.floor(index / 12));
          result.setHours(result.getHours() + (index % 12));
          return result;
        },
      );

      break;
    }
    case 'workWeek':
    case 'timelineWorkWeek': {
      if (scrollMode === 'standard' && groupOrientation === 'horizontal') {
        resourceCount = 2;
      }

      appointmentDates = Array.from(
        { length: 12 * 5 },
        (_, index) => {
          const result = new Date(2024, 0, 1, 8);
          result.setDate(result.getDate() + Math.floor(index / 12));
          result.setHours(result.getHours() + (index % 12));
          return result;
        },
      );

      break;
    }
    case 'month':
    case 'timelineMonth': {
      appointmentDates = Array.from(
        { length: 31 },
        (_, index) => {
          const result = new Date(2024, 0, 1, 8);
          result.setDate(result.getDate() + index);
          return result;
        },
      );

      break;
    }
    case 'day':
    case 'timelineDay':
    default: {
      appointmentDates = Array.from(
        { length: 12 },
        (_, index) => {
          const result = new Date(2024, 0, 2, 8);
          result.setHours(result.getHours() + index);
          return result;
        },
      );

      break;
    }
  }

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

  test(`targetedAppointmentData should be correct with groups (viewType="${viewType}", groupOrientation="${groupOrientation}", scrollMode="${scrollMode}", rtlEnabled="${rtlEnabled}") (T1205120)`, async (t) => {
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
      startDayHour,
      endDayHour,
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

    if (scrollMode === 'virtual') {
      const scrollOptions = generateOptionMatrix({
        date: datesToCheck,
        group: groupsToCheck,
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const { date, group } of scrollOptions) {
        await scrollTo(date, group);
        await t.wait(50);
      }
    }
  });
});

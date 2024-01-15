import { getStyleAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { scrollTo } from './utils';

import type {
  Appointment,
  ViewType,
  Orientation,
  ScrollMode,
} from '../../../../../js/ui/scheduler';

import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Scheduler: Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

test.skip('Appointment should not repaint after scrolling if present on viewport', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('', 0);

  await setStyleAttribute(element, 'background-color: red;');
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');

  await scrollTo(new Date(2020, 8, 17, 4));

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');
}).before(async () => {
  await createWidget('dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    scrolling: {
      mode: 'virtual',
      orientation: 'both',
      outlineCount: 0,
    },
    currentView: 'week',
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
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

const groupOrientations: Orientation[] = [
  'horizontal',
  'vertical',
];

const scrollModes: ScrollMode[] = [
  'standard',
  'virtual',
];

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
  let startDate = new Date(2024, 0, 1, 8);
  const currentDate = new Date(2024, 0, 2);

  const startDayHour = 8;
  const endDayHour = 20;
  let resourceCount = 30;
  let resourceAppointmentCount = 12;

  const HOUR = 1000 * 60 * 60;

  let appointmentOffset = HOUR;
  let appointmentDuration = HOUR / 2;

  let datesToCheck = [
    new Date(2024, 0, 1, 8),
    new Date(2024, 0, 2, 8),
    new Date(2024, 0, 3, 8),
  ];

  switch (viewType) {
    case 'agenda': {
      resourceCount = 10;

      datesToCheck = [
        new Date(2024, 0, 1, 8),
      ];
      break;
    }
    case 'day':
    case 'timelineDay': {
      resourceCount = 30;

      startDate = new Date(2024, 0, 2, 8);

      datesToCheck = [
        new Date(2024, 0, 2, 8),
        new Date(2024, 0, 2, 12),
        new Date(2024, 0, 2, 19),
      ];

      if (scrollMode === 'standard' && groupOrientation === 'horizontal') {
        resourceCount = 10;
      }
      break;
    }
    case 'week':
    case 'timelineWeek': {
      startDate = new Date(2024, 0, 1, 8);

      datesToCheck = [
        new Date(2023, 11, 31, 8),
        new Date(2024, 0, 3, 12),
        new Date(2024, 0, 6, 19),
      ];

      appointmentOffset = HOUR * 2;
      appointmentDuration = HOUR;

      resourceAppointmentCount = 12 * 7;

      if (scrollMode === 'standard' && groupOrientation === 'horizontal') {
        resourceCount = 2;
      }

      break;
    }
    case 'workWeek':
    case 'timelineWorkWeek': {
      startDate = new Date(2024, 0, 1, 8);

      datesToCheck = [
        new Date(2024, 0, 1, 8),
        new Date(2024, 0, 2, 12),
        new Date(2024, 0, 5, 19),
      ];

      appointmentOffset = HOUR * 2;
      appointmentDuration = HOUR;

      resourceAppointmentCount = 12 * 5;

      if (scrollMode === 'standard' && groupOrientation === 'horizontal') {
        resourceCount = 2;
      }

      break;
    }
    case 'month':
    case 'timelineMonth': {
      startDate = new Date(2024, 0, 1, 8);

      datesToCheck = [
        new Date(2024, 0, 1, 8),
        new Date(2024, 0, 2, 12),
        new Date(2024, 0, 31, 19),
      ];

      appointmentOffset = HOUR * 24;
      appointmentDuration = HOUR * 2;

      resourceAppointmentCount = 31;

      break;
    }
    default: {
      break;
    }
  }

  const groupsToCheck = [
    { groupId: 0 },
    { groupId: Math.floor(resourceCount / 3) },
    { groupId: resourceCount - 1 },
  ];

  test(`targetedAppointmentData should be correct with groups (viewType="${viewType}", groupOrientation="${groupOrientation}", scrollMode="${scrollMode}", rtlEnabled="${rtlEnabled}") (T1205120)`, async () => {
    const resourceDataSource = Array.from({ length: resourceCount }, (_, index) => ({
      id: index,
      text: `Resource ${index}`,
    }));

    const startDates = Array
      .from({ length: resourceAppointmentCount })
      .map<Date>((_, index) => new Date(startDate.getTime() + index * appointmentOffset));

    const endDates = startDates.map((date) => new Date(date.getTime() + appointmentDuration));

    const appointments = resourceDataSource.reduce<Appointment[]>((acc, resource) => acc.concat(
      Array
        .from({ length: resourceAppointmentCount })
        .map<Appointment>((_, index) => ({
        text: resource.text,
        startDate: startDates[index],
        endDate: endDates[index],
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
      appointmentTemplate({ targetedAppointmentData, appointmentData }) {
        const { groupId: targetedId } = targetedAppointmentData;
        const { groupId } = appointmentData;

        const $element = $(`<div>tid[${targetedId}] gid[${groupId}]</div>`);

        if (groupId !== targetedId) {
          throw new Error('Group ID and targeted ID are mismatched');
        }

        return $element;
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
      }
    }
  });
});

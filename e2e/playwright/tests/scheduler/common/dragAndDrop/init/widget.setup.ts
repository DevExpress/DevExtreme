import type { Page } from '@playwright/test';
import { createWidget } from '../../../../../helpers/createWidget';

type SchedulerOptions = Record<string, unknown>;

const resources = [
  { id: 0, color: '#e01e38' },
  { id: 1, color: '#f98322' },
  { id: 2, color: '#1e65e8' },
];

const getOptions = (options: SchedulerOptions): SchedulerOptions => ({
  views: ['day'],
  dataSource: [],
  resources: [
    {
      fieldExpr: 'resourceId',
      dataSource: resources,
      label: 'Color',
    },
  ],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
  ...options,
});

export default async (
  page: Page,
  options: SchedulerOptions = {},
  selector = '#container',
  withHandlers?: (options: SchedulerOptions) => SchedulerOptions,
): Promise<void> => {
  const widgetOptions = getOptions(options);

  if (withHandlers) {
    await createWidget(page, 'dxScheduler', withHandlers, selector, { arg: widgetOptions });
    return;
  }

  await createWidget(page, 'dxScheduler', widgetOptions, selector);
};

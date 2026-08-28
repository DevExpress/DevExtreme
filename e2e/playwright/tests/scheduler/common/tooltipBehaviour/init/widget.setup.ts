import type { Page } from '@playwright/test';
import { createWidget } from '../../../../../helpers/createWidget';

export const createScheduler = async (
  page: Page,
  options = {},
): Promise<void> => createWidget(page, 'dxScheduler', {
  views: ['day'],
  dataSource: [],
  width: 600,
  height: 600,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
  ...options,
});

export const scroll = async (
  page: Page,
  horizontal: number,
  vertical: number,
): Promise<void> => page.evaluate(
  ({ x, y }) => { window.scroll(x, y); },
  { x: horizontal, y: vertical },
);

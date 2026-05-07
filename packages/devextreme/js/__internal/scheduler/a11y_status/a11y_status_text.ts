import messageLocalization from '@js/common/core/localization/message';
import type { ViewType } from '@js/ui/scheduler';

import { formatImplicitSchedulerDate, formatImplicitSchedulerMonth } from '../utils/global_formats';
import type { NormalizedView } from '../utils/options/types';

const KEYS = {
  dateRange: 'dxScheduler-dateRange',
  label: 'dxScheduler-ariaLabel',
  indicatorPresent: 'dxScheduler-ariaLabel-currentIndicator-present',
  indicatorNotPresent: 'dxScheduler-ariaLabel-currentIndicator-not-present',
};
const viewTypeLocalization: Record<ViewType, string> = {
  agenda: 'dxScheduler-switcherAgenda',
  day: 'dxScheduler-switcherDay',
  month: 'dxScheduler-switcherMonth',
  week: 'dxScheduler-switcherWeek',
  workWeek: 'dxScheduler-switcherWorkWeek',
  timelineDay: 'dxScheduler-switcherTimelineDay',
  timelineMonth: 'dxScheduler-switcherTimelineMonth',
  timelineWeek: 'dxScheduler-switcherTimelineWeek',
  timelineWorkWeek: 'dxScheduler-switcherTimelineWorkWeek',
};

const localizeMonth = (date: Date): string => formatImplicitSchedulerMonth(date);
const localizeDate = (date: Date): string => formatImplicitSchedulerDate(date);
const localizeCurrentIndicator = (
  date: Date,
  startDate: Date,
  endDate: Date,
): string => messageLocalization.format(
  date >= startDate && date < endDate
    ? KEYS.indicatorPresent
    : KEYS.indicatorNotPresent,
);
const localizeName = (viewName?: string, viewType?: string): string => {
  if (viewName) {
    return viewName;
  }
  if (viewType) {
    return messageLocalization.format(viewTypeLocalization[viewType]);
  }

  return '';
};

export const getA11yStatusText = (
  view: NormalizedView | undefined,
  startDate: Date,
  endDate: Date,
  appointmentCount: number,
  indicatorTime?: Date,
): string => {
  const viewType = view?.type;
  const viewName = view?.name;
  const viewTypeLabel = localizeName(viewName, viewType);
  const isMonth = viewType === 'month' || viewType === 'timelineMonth';
  const startDateText = isMonth ? localizeMonth(startDate) : localizeDate(startDate);
  const endDateText = isMonth ? localizeMonth(endDate) : localizeDate(endDate);
  const intervalText = startDateText === endDateText
    ? `${startDateText}`
    // @ts-expect-error ts-error
    : messageLocalization.format(KEYS.dateRange, startDateText, endDateText);

  const statusText = messageLocalization
    // @ts-expect-error
    .format(KEYS.label, viewTypeLabel, intervalText, appointmentCount);

  if (indicatorTime) {
    const indicatorStatus = localizeCurrentIndicator(indicatorTime, startDate, endDate);

    return `${statusText}. ${indicatorStatus}`;
  }

  return statusText;
};

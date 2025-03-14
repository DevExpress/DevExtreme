import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import { isObject } from '@js/core/utils/type';
import type { ViewType } from '@js/ui/scheduler';

import type { RawViewType } from '../header/types';

const KEYS = {
  label: 'dxScheduler-ariaLabel',
  indicatorPresent: 'dxScheduler-ariaLabel-currentIndicator-present',
  indicatorFuture: 'dxScheduler-ariaLabel-currentIndicator-future',
  indicatorPast: 'dxScheduler-ariaLabel-currentIndicator-past',
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

const localizeMonth = (date: Date): string => String(dateLocalization.format(date, 'monthAndYear'));
const localizeDate = (date: Date): string => `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;
const localizeCurrentIndicator = (
  date: Date,
  startDate: Date,
  endDate: Date,
): string => {
  switch (true) {
    case date < startDate:
      return messageLocalization.format(KEYS.indicatorPast);
    case date > endDate:
      return messageLocalization.format(KEYS.indicatorFuture);
    default:
      return messageLocalization.format(KEYS.indicatorPresent);
  }
};
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
  view: RawViewType,
  startDate: Date,
  endDate: Date,
  appointmentCount: number,
  indicatorTime?: Date,
): string => {
  const viewType = isObject(view) ? view.type : view;
  const viewName = isObject(view) ? view.name : undefined;
  const viewTypeLabel = localizeName(viewName, viewType);

  const isMonth = viewType === 'month' || viewType === 'timelineMonth';
  const startDateText = isMonth ? localizeMonth(startDate) : localizeDate(startDate);
  const endDateText = isMonth ? localizeMonth(endDate) : localizeDate(endDate);
  const intervalText = startDateText === endDateText
    ? `${startDateText}`
    : `from ${startDateText} to ${endDateText}`;

  const statusText = messageLocalization
    // @ts-expect-error
    .format(KEYS.label, viewTypeLabel, intervalText, appointmentCount);
  const labelParts = [statusText];

  if (indicatorTime) {
    labelParts.push(localizeCurrentIndicator(indicatorTime, startDate, endDate));
  }

  return labelParts.join('. ');
};

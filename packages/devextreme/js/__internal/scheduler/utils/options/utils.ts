import { isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import { dateUtils } from '@ts/core/utils/m_date';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';
import { extend } from '@ts/core/utils/m_extend';

import { isValidWeekday } from '../skipped_days';
import { DEFAULT_VIEW_OPTIONS, VIEW_TYPES } from './constants_view';
import type {
  DateOption, NormalizedView, RawViewType, SafeSchedulerOptions, ViewType,
} from './types';

const normalizeHiddenWeekDays = (
  days: unknown,
): number[] | undefined => {
  if (!Array.isArray(days)) {
    return undefined;
  }
  const valid = [...new Set(days)]
    .filter(isValidWeekday)
    .sort((a, b) => a - b);
  if (valid.length >= 7) {
    errors.log('W1029');
    return [];
  }
  return valid;
};

const resolveSkippedDays = (
  perViewHiddenWeekDays: unknown,
  globalHiddenWeekDays: number[] | undefined,
  viewDefault: number[],
): number[] => {
  const perView = normalizeHiddenWeekDays(perViewHiddenWeekDays);
  if (perView !== undefined) {
    return perView;
  }
  if (globalHiddenWeekDays !== undefined) {
    return normalizeHiddenWeekDays(globalHiddenWeekDays) ?? [];
  }
  return viewDefault;
};

const isKnownView = (view: RawViewType): boolean => VIEW_TYPES
  .includes((isObject(view) ? view.type : view) as ViewType);
const isExistedView = (view: NormalizedView | undefined): view is NormalizedView => Boolean(view);

const normalizeView = (view: RawViewType): NormalizedView | undefined => (isObject(view)
  ? extend({}, DEFAULT_VIEW_OPTIONS[view.type as string], view) as NormalizedView
  : DEFAULT_VIEW_OPTIONS[view]);

export const getViews = (
  views: RawViewType[],
): NormalizedView[] => views
  .filter(isKnownView)
  .map((v) => normalizeView(v))
  .filter(isExistedView);

export function getCurrentView(
  currentView: string | ViewType,
  views: RawViewType[],
): NormalizedView {
  const viewsProps = getViews(views);
  const currentViewProps = viewsProps.find(
    (view) => [view.name, view.type].includes(currentView),
  );

  return currentViewProps
    ?? DEFAULT_VIEW_OPTIONS[currentView as ViewType]
    ?? viewsProps[0]
    ?? DEFAULT_VIEW_OPTIONS[VIEW_TYPES[0]];
}

export const parseDateOption = (date?: Date | number | string): Date | undefined => (date
  ? new Date(dateSerialization.deserializeDate(date))
  : undefined);

export const parseCurrentDate = (date: Date | number | string): Date => {
  const deserialized = parseDateOption(date) as Date;
  return dateUtils.trimTime(deserialized) as Date;
};

const isDateOption = (
  optionName: string,
): optionName is DateOption => ['currentDate', 'min', 'max'].includes(optionName);

export const getViewOption = <K extends keyof SafeSchedulerOptions>(
  optionName: K,
  currentOptionValue: SafeSchedulerOptions[K],
  currentView?: NormalizedView,
  globalHiddenWeekDays?: number[],
): SafeSchedulerOptions[K] => {
  if (optionName === 'skippedDays') {
    if (!currentView) {
      return currentOptionValue;
    }

    return resolveSkippedDays(
      currentView.hiddenWeekDays,
      globalHiddenWeekDays,
      DEFAULT_VIEW_OPTIONS[currentView.type].skippedDays,
    ) as SafeSchedulerOptions[K];
  }

  if (!isDateOption(optionName)) {
    return currentOptionValue;
  }

  const date = optionName === 'currentDate'
    ? parseCurrentDate(currentOptionValue as SafeSchedulerOptions['currentDate'])
    : parseDateOption(currentOptionValue as SafeSchedulerOptions[DateOption]);
  return date as SafeSchedulerOptions[K];
};

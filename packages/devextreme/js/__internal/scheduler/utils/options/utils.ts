import { isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import { dateUtils } from '@ts/core/utils/m_date';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';
import { extend } from '@ts/core/utils/m_extend';

import { DEFAULT_VIEW_OPTIONS, VIEW_TYPES } from './constants_view';
import type {
  DateOption, NormalizedView, RawViewType, SafeSchedulerOptions, ViewType,
} from './types';

const VIEWS_SUPPORTING_HIDDEN_DAYS: ReadonlySet<ViewType> = new Set<ViewType>([
  'week', 'month', 'timelineWeek', 'timelineMonth',
]);

const VIEWS_WITH_BUILTIN_SKIPPED: ReadonlySet<ViewType> = new Set<ViewType>([
  'workWeek', 'timelineWorkWeek',
]);

const normalizeHiddenDays = (
  days: readonly unknown[] | undefined,
): number[] | undefined => {
  if (!Array.isArray(days)) {
    return undefined;
  }
  const valid = [...new Set(days)]
    .filter((d): d is number => typeof d === 'number' && Number.isInteger(d) && d >= 0 && d <= 6)
    .sort((a, b) => a - b);
  if (valid.length >= 7) {
    errors.log('W1029');
    return [];
  }
  return valid;
};

const resolveSkippedDays = (
  viewType: ViewType,
  perViewHiddenDays: unknown,
  globalHiddenDays: number[] | undefined,
  viewDefault: number[],
): number[] => {
  const perView = normalizeHiddenDays(perViewHiddenDays as readonly unknown[] | undefined);
  if (perView !== undefined) {
    return perView;
  }
  if (VIEWS_WITH_BUILTIN_SKIPPED.has(viewType)) {
    return viewDefault;
  }
  if (globalHiddenDays !== undefined && VIEWS_SUPPORTING_HIDDEN_DAYS.has(viewType)) {
    return normalizeHiddenDays(globalHiddenDays) ?? [];
  }
  return viewDefault;
};

const isKnownView = (view: RawViewType): boolean => VIEW_TYPES
  .includes((isObject(view) ? view.type : view) as ViewType);
const isExistedView = (view: NormalizedView | undefined): view is NormalizedView => Boolean(view);

const normalizeView = (
  view: RawViewType,
  globalHiddenDays?: number[],
): NormalizedView | undefined => {
  if (isObject(view)) {
    const viewType = view.type as ViewType;
    const viewDefault = DEFAULT_VIEW_OPTIONS[viewType];
    if (!viewDefault) {
      return undefined;
    }
    const merged = extend({}, viewDefault, view) as NormalizedView;
    merged.skippedDays = resolveSkippedDays(
      viewType,
      (view as { hiddenWeekDays?: unknown }).hiddenWeekDays,
      globalHiddenDays,
      viewDefault.skippedDays,
    );
    return merged;
  }
  const defaultView = DEFAULT_VIEW_OPTIONS[view];
  if (!defaultView) {
    return undefined;
  }
  const skippedDays = resolveSkippedDays(
    view as ViewType,
    undefined,
    globalHiddenDays,
    defaultView.skippedDays,
  );
  if (skippedDays === defaultView.skippedDays) {
    return defaultView;
  }
  return { ...defaultView, skippedDays } as NormalizedView;
};

export const getViews = (
  views: RawViewType[],
  globalHiddenDays?: number[],
): NormalizedView[] => views
  .filter(isKnownView)
  .map((v) => normalizeView(v, globalHiddenDays))
  .filter(isExistedView);

export function getCurrentView(
  currentView: string | ViewType,
  views: RawViewType[],
  globalHiddenDays?: number[],
): NormalizedView {
  const viewsProps = getViews(views, globalHiddenDays);
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
): SafeSchedulerOptions[K] => {
  if (!isDateOption(optionName)) {
    return currentOptionValue;
  }

  const date = optionName === 'currentDate'
    ? parseCurrentDate(currentOptionValue as SafeSchedulerOptions['currentDate'])
    : parseDateOption(currentOptionValue as SafeSchedulerOptions[DateOption]);
  return date as SafeSchedulerOptions[K];
};

import messageLocalization from '@js/common/core/localization/message';
import { isObject } from '@js/core/utils/type';
import { dateUtils } from '@ts/core/utils/m_date';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';
import { extend } from '@ts/core/utils/m_extend';
import { camelize } from '@ts/core/utils/m_inflector';

import { DEFAULT_VIEW_OPTIONS, VIEW_TYPES } from './constants_view';
import type {
  DateOption, NormalizedView, RawViewType, SafeSchedulerOptions, ViewType,
} from './types';

const isKnownView = (view: RawViewType): boolean => VIEW_TYPES
  .includes((isObject(view) ? view.type : view) as ViewType);
const isExistedView = (view: NormalizedView | undefined): view is NormalizedView => Boolean(view);

const normalizeView = (view: RawViewType): NormalizedView | undefined => {
  const normalized = isObject(view)
    ? extend({}, DEFAULT_VIEW_OPTIONS[view.type as string], view) as NormalizedView
    : DEFAULT_VIEW_OPTIONS[view];

  if (normalized) {
    if (!isObject(view) || !view.name) {
      normalized.name = messageLocalization.format(`dxScheduler-switcher${camelize(normalized.type, true)}`);
    }
  }

  return normalized;
};

export const getViews = (views: RawViewType[]): NormalizedView[] => views
  .filter(isKnownView)
  .map(normalizeView)
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
): SafeSchedulerOptions[K] => {
  if (!isDateOption(optionName)) {
    return currentOptionValue;
  }

  const date = optionName === 'currentDate'
    ? parseCurrentDate(currentOptionValue as SafeSchedulerOptions['currentDate'])
    : parseDateOption(currentOptionValue as SafeSchedulerOptions[DateOption]);
  return date as SafeSchedulerOptions[K];
};

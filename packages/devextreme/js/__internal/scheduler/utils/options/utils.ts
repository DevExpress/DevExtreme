import { isObject } from '@js/core/utils/type';
import { dateUtils } from '@ts/core/utils/m_date';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';

import { DEFAULT_VIEW_OPTIONS } from './constants_view';
import type {
  AgendaView, NormalizedView, RawViewType, View, ViewType,
} from './types';

export const getViews = (views: RawViewType[]): NormalizedView[] => views.map(
  (view) => (isObject(view)
    ? {
      ...view,
      ...DEFAULT_VIEW_OPTIONS[view.type as ViewType],
    } as NormalizedView
    : DEFAULT_VIEW_OPTIONS[view]),
).filter(Boolean);

export function getCurrentView(currentView: 'agenda', views: RawViewType[]): AgendaView;
export function getCurrentView(currentView: string | ViewType, views: RawViewType[]): View;
export function getCurrentView(
  currentView: string | ViewType,
  views: RawViewType[],
): NormalizedView {
  const viewsProps = getViews(views);
  const currentViewProps = viewsProps.find(
    (view) => [view.name, view.type].includes(currentView),
  );

  return currentViewProps ?? DEFAULT_VIEW_OPTIONS[currentView as ViewType];
}

export const parseDateOption = (date?: Date | number | string): Date | undefined => (date
  ? new Date(dateSerialization.deserializeDate(date))
  : undefined);

export const parseCurrentDate = (date?: Date | number | string): Date | undefined => {
  const deserialized = parseDateOption(date);
  return deserialized
    ? dateUtils.trimTime(deserialized) as Date
    : undefined;
};

import { equalByValue } from '@js/core/utils/common';

import type { AppointmentViewModelPlain } from '../../view_model/generate_view_model/types';
import type { DiffItem } from './get_arrays_diff';
import { getArraysDiff } from './get_arrays_diff';

const getObjectToCompare = (
  item: AppointmentViewModelPlain,
): Omit<AppointmentViewModelPlain, 'itemData' | 'info' | 'agendaSettings' | 'items'> & {
  itemData: string;
  info: false;
  agendaSettings: false;
  items: number;
} => ({
  ...item,
  itemData: JSON.stringify(item.itemData),
  info: false,
  agendaSettings: false,
  items: 'items' in item ? item.items.length : 0,
  sortedIndex: 0,
});

const compareViewModel = (
  x: AppointmentViewModelPlain,
  y: AppointmentViewModelPlain,
): boolean => equalByValue(getObjectToCompare(x), getObjectToCompare(y));

export const getViewModelDiff = (
  viewModelOld: AppointmentViewModelPlain[],
  viewModelNext: AppointmentViewModelPlain[],
): DiffItem<AppointmentViewModelPlain, AppointmentViewModelPlain>[] => getArraysDiff(
  viewModelOld,
  viewModelNext,
  compareViewModel,
);

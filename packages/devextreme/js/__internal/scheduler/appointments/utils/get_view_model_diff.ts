import { equalByValue } from '@js/core/utils/common';

import type { AppointmentViewModelPlain } from '../../view_model/generate_view_model/types';
import type { DiffItem } from './get_arrays_diff';
import { getArraysDiff } from './get_arrays_diff';

const getObjectToCompare = (
  item: AppointmentViewModelPlain,
): object => {
  if ('agendaSettings' in item) {
    return {};
  }

  if ('items' in item) {
    return {
      allDay: item.allDay,
      groupIndex: item.groupIndex,
      top: item.top,
      left: item.left,
      items: item.items.length,
    };
  }

  return {
    allDay: item.allDay,
    groupIndex: item.groupIndex,
    direction: item.direction,
    left: item.left,
    top: item.top,
    height: item.height,
    width: item.width,
    reduced: item.reduced,
    partIndex: item.partIndex,
    partTotalCount: item.partTotalCount,
    rowIndex: item.rowIndex,
    columnIndex: item.columnIndex,
  };
};

const compareViewModel = (
  x: AppointmentViewModelPlain,
  y: AppointmentViewModelPlain,
): boolean => x.itemData === y.itemData
  && equalByValue(getObjectToCompare(x), getObjectToCompare(y));

export const getViewModelDiff = (
  viewModelOld: AppointmentViewModelPlain[],
  viewModelNext: AppointmentViewModelPlain[],
): DiffItem<AppointmentViewModelPlain, AppointmentViewModelPlain>[] => getArraysDiff(
  viewModelOld,
  viewModelNext,
  compareViewModel,
);

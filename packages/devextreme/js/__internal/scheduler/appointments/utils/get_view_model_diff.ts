import { equalByValue } from '@js/core/utils/common';

import type { SafeAppointment } from '../../types';
import type { AppointmentDataSource } from '../../view_model/m_appointment_data_source';
import type { AppointmentViewModelPlain } from '../../view_model/types';
import type { DiffItem } from './get_arrays_diff';
import { getArraysDiff } from './get_arrays_diff';

const getObjectToCompare = (
  item: AppointmentViewModelPlain,
): object => {
  if ('isAgendaModel' in item) {
    return {};
  }

  if ('items' in item) {
    return {
      allDay: item.allDay,
      groupIndex: item.groupIndex,
      top: item.top,
      left: item.left,
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

const getItemsLengthToCompare = (item: AppointmentViewModelPlain): object => {
  if ('items' in item) {
    return {
      items: item.items.length,
    };
  }

  return {};
};

const isDataChanged = (
  data: SafeAppointment,
  appointmentDataSource: AppointmentDataSource,
): boolean => {
  const updatedData = appointmentDataSource.getUpdatedAppointment();

  return updatedData === data || appointmentDataSource
    .getUpdatedAppointmentKeys()
    .some((item) => data[item.key] === item.value);
};

export const getViewModelDiff = (
  viewModelOld: AppointmentViewModelPlain[],
  viewModelNext: AppointmentViewModelPlain[],
  appointmentDataSource: AppointmentDataSource,
): DiffItem<AppointmentViewModelPlain, AppointmentViewModelPlain>[] => {
  const equal = (
    a: AppointmentViewModelPlain,
    b: AppointmentViewModelPlain,
  ): boolean => equalByValue(getObjectToCompare(a), getObjectToCompare(b));

  const match = (
    a: AppointmentViewModelPlain,
    b: AppointmentViewModelPlain,
  ): boolean => {
    if ('items' in a && 'items' in b) {
      return equal(a, b);
    }

    return a.itemData === b.itemData && !isDataChanged(a.itemData, appointmentDataSource);
  };

  const itemsLengthEqual = (
    a: AppointmentViewModelPlain,
    b: AppointmentViewModelPlain,
  ): boolean => equalByValue(getItemsLengthToCompare(a), getItemsLengthToCompare(b));

  const result = getArraysDiff(
    viewModelOld,
    viewModelNext,
    match,
    equal,
    itemsLengthEqual,
  );

  return result;
};

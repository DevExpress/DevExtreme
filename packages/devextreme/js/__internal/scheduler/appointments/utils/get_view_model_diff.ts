import { equalByValue } from '@js/core/utils/common';

import type { SafeAppointment } from '../../types';
import type { AppointmentDataSource } from '../../view_model/generate_view_model/data_provider/m_appointment_data_source';
import type { AppointmentViewModelPlain } from '../../view_model/generate_view_model/types';
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

const isDataChanged = (
  data: SafeAppointment,
  appointmentDataSource: AppointmentDataSource,
): boolean => {
  const updatedData = appointmentDataSource.getUpdatedAppointment();

  return updatedData === data || appointmentDataSource
    .getUpdatedAppointmentKeys()
    .some((item) => data[item.key] === item.value);
};

const compareViewModel = (appointmentDataSource: AppointmentDataSource) => (
  viewModelOld: AppointmentViewModelPlain,
  viewModelNext: AppointmentViewModelPlain,
): boolean => viewModelOld.itemData === viewModelNext.itemData
  && !isDataChanged(viewModelNext.itemData, appointmentDataSource)
  && equalByValue(getObjectToCompare(viewModelOld), getObjectToCompare(viewModelNext));

export const getViewModelDiff = (
  viewModelOld: AppointmentViewModelPlain[],
  viewModelNext: AppointmentViewModelPlain[],
  appointmentDataSource: AppointmentDataSource,
): DiffItem<AppointmentViewModelPlain, AppointmentViewModelPlain>[] => getArraysDiff(
  viewModelOld,
  viewModelNext,
  compareViewModel(appointmentDataSource),
);

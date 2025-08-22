import { isDefined } from '@js/core/utils/type';
import type { SafeAppointment } from '@ts/scheduler/types';

import { plainViewModel } from './plain_view_model';
import type {
  AppointmentCollectorViewModel,
  AppointmentItemViewModel,
  AppointmentViewModelInternal,
  AppointmentViewModelPlain,
  AppointmentViewModelSettingsInternal,
} from './types';

const cropSettingsProps = (
  setting: AppointmentViewModelSettingsInternal & {
    itemData: SafeAppointment;
  },
): AppointmentItemViewModel => ({
  itemData: setting.itemData,
  allDay: Boolean(setting.allDay),
  direction: setting.direction,
  groupIndex: setting.groupIndex,
  sortedIndex: setting.sortedIndex,
  skipResizing: setting.skipResizing,
  level: setting.index,
  maxLevel: setting.count,
  info: {
    sourceAppointment: setting.info.sourceAppointment,
    appointment: setting.info.appointment,
  },
  empty: setting.geometry.empty,
  left: setting.geometry.left,
  top: setting.geometry.top,
  height: setting.geometry.height,
  width: setting.geometry.width,
  reduced: setting.appointmentReduced,
  partIndex: setting.partIndex,
  partTotalCount: setting.partTotalCount,
  rowIndex: setting.positionByMap.rowIndex,
  columnIndex: setting.positionByMap.columnIndex,
});

const processVirtualAppointment = (
  virtualAppointments: Record<string, AppointmentCollectorViewModel>,
  appointmentSetting: AppointmentViewModelSettingsInternal & {
    itemData: SafeAppointment;
  },
): void => {
  if (!appointmentSetting.virtual) {
    return;
  }

  const virtualAppointment = appointmentSetting.virtual;
  const virtualGroupIndex = virtualAppointment.index;

  if (!isDefined(virtualAppointments[virtualGroupIndex])) {
    virtualAppointments[virtualGroupIndex] = {
      itemData: appointmentSetting.itemData,
      allDay: Boolean(virtualAppointment.isAllDay),
      groupIndex: appointmentSetting.groupIndex,
      sortedIndex: appointmentSetting.sortedIndex,
      top: virtualAppointment.top,
      left: virtualAppointment.left,
      width: virtualAppointment.width,
      height: virtualAppointment.height,
      isCompact: virtualAppointment.isCompact,
      items: [],
    };
  }

  virtualAppointments[virtualGroupIndex].items.push(cropSettingsProps(appointmentSetting));
};

export const addCollector = (
  viewModel: AppointmentViewModelInternal[],
): AppointmentViewModelPlain[] => {
  const settings = plainViewModel(viewModel);
  const result: AppointmentViewModelPlain[] = [];
  const virtualAppointments: Record<string, AppointmentCollectorViewModel> = {};

  settings.forEach((setting) => {
    switch (true) {
      case Boolean(setting.virtual):
        processVirtualAppointment(virtualAppointments, setting);
        break;
      default:
        result.push(cropSettingsProps(setting));
    }
  });

  const combined = [
    ...result,
    ...Object.values(virtualAppointments),
  ];

  return combined
    .sort((a, b) => a.sortedIndex - b.sortedIndex)
    .map((item, sortedIndex) => ({
      ...item,
      sortedIndex,
    }));
};

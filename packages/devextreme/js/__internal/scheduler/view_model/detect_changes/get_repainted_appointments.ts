import { equalByValue } from '@js/core/utils/common';
import type {
  AgendaViewModelSettings,
  AppointmentViewModel,
  AppointmentViewModelSettings,
  SafeAppointment,
} from '@ts/scheduler/types';

import type {
  AppointmentDataProvider,
} from '../generate_view_model/data_provider/m_appointment_data_provider';

type Settings = AppointmentViewModelSettings & AgendaViewModelSettings & {
  columnIndex: number;
  rowIndex: number;
  positionByMap: number;
  topVirtualCellCount: number;
  leftVirtualCellCount: number;
  leftVirtualWidth: number;
  topVirtualHeight: number;
  hMax: number;
  vMax: number;
  reduced?: string;
};

const isDataChanged = (
  data: SafeAppointment,
  appointmentDataProvider: AppointmentDataProvider,
): boolean => {
  const updatedData = appointmentDataProvider.getUpdatedAppointment();

  return updatedData === data || appointmentDataProvider
    .getUpdatedAppointmentKeys()
    .some((item) => data[item.key] === item.value);
};

const isAppointmentShouldAppear = (
  currentAppointment: AppointmentViewModel,
  sourceAppointment: AppointmentViewModel,
): boolean => currentAppointment.needRepaint && sourceAppointment.needRemove;

const createSettingsToCompare = (
  currentSetting: Settings,
): Partial<Settings> => {
  const leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
  const topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
  const columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
  const rowIndex = currentSetting.rowIndex + topVirtualCellCount;
  const hMax = currentSetting.reduced ? currentSetting.hMax : undefined;
  const vMax = currentSetting.reduced ? currentSetting.vMax : undefined;

  return {
    ...currentSetting,
    columnIndex,
    rowIndex,
    positionByMap: undefined,
    topVirtualCellCount: undefined,
    leftVirtualCellCount: undefined,
    leftVirtualWidth: undefined,
    topVirtualHeight: undefined,
    hMax,
    vMax,
    info: undefined,
  };
};

const isSettingChanged = (
  settings: Settings[],
  sourceSetting: Settings[],
): boolean => {
  if (settings.length !== sourceSetting.length) {
    return true;
  }

  for (let i = 0; i < settings.length; i += 1) {
    const newSettings = createSettingsToCompare(settings[i]);
    const oldSettings = createSettingsToCompare(sourceSetting[i]);

    if (oldSettings) { // exclude sortedIndex property for comparison in commonUtils.equalByValue
      oldSettings.sortedIndex = newSettings.sortedIndex;
    }

    if (!equalByValue(newSettings, oldSettings)) {
      return true;
    }
  }

  return false;
};

const getAssociatedSourceAppointment = (
  currentAppointment: AppointmentViewModel,
  sourceAppointments: AppointmentViewModel[],
): AppointmentViewModel | undefined => sourceAppointments
  .find((item) => item.itemData === currentAppointment.itemData);

const getDeletedAppointments = (
  currentAppointments: AppointmentViewModel[],
  sourceAppointments: AppointmentViewModel[],
): AppointmentViewModel[] => {
  const result: AppointmentViewModel[] = [];

  sourceAppointments.forEach((sourceAppointment) => {
    const currentAppointment = getAssociatedSourceAppointment(
      sourceAppointment,
      currentAppointments,
    );
    if (!currentAppointment) {
      sourceAppointment.needRemove = true;
      result.push(sourceAppointment);
    }
  });

  return result;
};

export const getRepaintedAppointments = (
  currentAppointments: AppointmentViewModel[],
  sourceAppointments: AppointmentViewModel[],
  {
    appointmentRenderingStrategyName,
    appointmentDataProvider,
  }: {
    appointmentRenderingStrategyName: string;
    appointmentDataProvider: AppointmentDataProvider;
  },
): AppointmentViewModel[] => {
  if (sourceAppointments.length === 0 || appointmentRenderingStrategyName === 'agenda') {
    return currentAppointments;
  }

  currentAppointments.forEach((appointment) => {
    const sourceAppointment = getAssociatedSourceAppointment(appointment, sourceAppointments);

    if (sourceAppointment) {
      const isDataChangedBool = isDataChanged(appointment.itemData, appointmentDataProvider);
      const isSettingChangedBool = isSettingChanged(
        appointment.settings as unknown as Settings[],
        sourceAppointment.settings as unknown as Settings[],
      );
      const isAppointmentShouldAppearBool = isAppointmentShouldAppear(
        appointment,
        sourceAppointment,
      );

      appointment.needRepaint = isDataChangedBool
        || isSettingChangedBool
        || isAppointmentShouldAppearBool;
    }
  });

  return currentAppointments
    .concat(getDeletedAppointments(currentAppointments, sourceAppointments));
};

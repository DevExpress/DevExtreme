import type { AppointmentGeometry, SafeAppointment } from '@ts/scheduler/types';

interface SimpleAppointment {
  allDay?: boolean;
  startDate: Date;
  endDate: Date;
}

export interface BaseViewModelSettingsInternal {
  allDay?: boolean;
  direction: string;
  groupIndex: number;
  sortedIndex: number;
  // added by getAppointmentGeometry
  skipResizing?: true;
  geometry: AppointmentGeometry;
  virtual?: {
    left: number;
    top: number;
    width: number;
    height: number;
    index: string;
    isAllDay?: boolean;
    groupIndex: number;
    isCompact: true;
  };
}

export interface AppointmentViewModelSettingsInternal extends BaseViewModelSettingsInternal {
  index: number;
  count: number;
  info: {
    sourceAppointment: SimpleAppointment;
    appointment: SimpleAppointment & {
      savedBeforeSplit: {
        startDate: Date;
        endDate: Date;
      };
    };
  };
  positionByMap: {
    rowIndex: number;
    columnIndex: number;
  };
  left: number;
  top: number;
  height: number;
  width: number;
  isCompact: boolean;
  appointmentReduced: 'head' | 'body' | 'tail' | undefined;
  partIndex: number;
  partTotalCount: number;
}

export interface AgendaViewModelSettingsInternal extends BaseViewModelSettingsInternal {
  agendaSettings?: SafeAppointment;
  height: number;
  width: string;
}

export interface AppointmentViewModelInternal {
  itemData: SafeAppointment; // it will save in DOM by key: dxItemData
  needRepaint: boolean;
  needRemove: boolean;
  settings: (AppointmentViewModelSettingsInternal & AgendaViewModelSettingsInternal)[];
}

interface AppointmentInfo {
  info: {
    sourceAppointment: SimpleAppointment;
    appointment: SimpleAppointment;
  };
}

export interface BaseAppointmentViewModel {
  itemData: SafeAppointment;
  allDay: boolean;
  groupIndex: number;
  sortedIndex: number;
}

export interface AppointmentCollectorViewModel extends BaseAppointmentViewModel {
  top: number;
  left: number;
  height: number;
  width: number;
  isCompact: boolean;
  items: AppointmentItemViewModel[];
}

export interface AppointmentAgendaViewModel extends BaseAppointmentViewModel, AppointmentInfo {
  isAgendaModel: true;
  direction: string;
  height: number;
  width: string;
}

export interface AppointmentItemViewModel extends BaseAppointmentViewModel, AppointmentInfo {
  direction: string;
  skipResizing?: true;
  level: number;
  maxLevel: number;
  empty: boolean;
  left: number;
  top: number;
  height: number;
  width: number;
  isCompact: boolean;
  reduced: 'head' | 'body' | 'tail' | undefined;
  partIndex: number;
  partTotalCount: number;
  rowIndex: number;
  columnIndex: number;
}

export type AppointmentViewModelPlain =
  | AppointmentAgendaViewModel
  | AppointmentItemViewModel
  | AppointmentCollectorViewModel;

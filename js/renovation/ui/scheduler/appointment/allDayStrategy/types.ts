enum EAllDayPanelModeOptionTypes {
  all = 'all',
  allDay = 'allDay',
  hidden = 'hidden',
}

type AllDayPanelModeType =
  EAllDayPanelModeOptionTypes.all
  | EAllDayPanelModeOptionTypes.allDay
  | EAllDayPanelModeOptionTypes.hidden;

enum EAllDayAppointmentStrategy {
  separate = 'separate',
  allLongAppointment = 'allLongAppointment',
  withoutAllDayAppointments = 'withoutAllDayAppointments',
}

interface IAllDayPanelBehavior {
  allDayPanelVisible: boolean;
  allDayStrategy: EAllDayAppointmentStrategy;
}

export type {
  AllDayPanelModeType,
  IAllDayPanelBehavior,
};

export {
  EAllDayAppointmentStrategy,
  EAllDayPanelModeOptionTypes,
};

import { EAllDayAppointmentStrategy, IAllDayPanelBehavior } from './types';

const DEFAULT_ALL_DAY_PANEL_BEHAVIOR: IAllDayPanelBehavior = {
  allDayPanelVisible: true,
  allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
};

const ALL_DAY_BEHAVIOR_JS_NAMES = {
  optionName: 'allDayPanelBehavior',
  publicOptionName: 'internalOptionAllDayPanelBehavior',
};

export {
  DEFAULT_ALL_DAY_PANEL_BEHAVIOR,
  ALL_DAY_BEHAVIOR_JS_NAMES,
};

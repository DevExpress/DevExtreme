/* istanbul ignore file */
/* this is index.ts file, so ignore test coverage here */

import {
  EAllDayAppointmentStrategy,
  EAllDayPanelModeOptionTypes,
} from './types';

import {
  DEFAULT_ALL_DAY_PANEL_BEHAVIOR,
  ALL_DAY_BEHAVIOR_JS_NAMES,
} from './consts';

import {
  compareAllDayPanelBehaviors,
  isAllDayPanelAppointment,
  mergeAllDayPanelPublicOptions,
} from './funcs/index';

export {
  // types
  EAllDayAppointmentStrategy,
  EAllDayPanelModeOptionTypes,
  // const
  DEFAULT_ALL_DAY_PANEL_BEHAVIOR,
  ALL_DAY_BEHAVIOR_JS_NAMES,
  // func
  compareAllDayPanelBehaviors,
  isAllDayPanelAppointment,
  mergeAllDayPanelPublicOptions,
};

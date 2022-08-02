import {
  AllDayPanelModeType,
  EAllDayAppointmentStrategy,
  EAllDayPanelModeOptionTypes,
  IAllDayPanelBehavior,
} from '../types';

function mergeAllDayPanelPublicOptions(
  showAllDayPanelOption: boolean | undefined,
  allDayPanelModeOption: AllDayPanelModeType | undefined,
): IAllDayPanelBehavior {
  switch (allDayPanelModeOption) {
    case EAllDayPanelModeOptionTypes.allDay:
      return {
        allDayPanelVisible: showAllDayPanelOption !== false,
        allDayStrategy: EAllDayAppointmentStrategy.separate,
      };
    case EAllDayPanelModeOptionTypes.hidden:
      return {
        allDayPanelVisible: showAllDayPanelOption === undefined ? false : showAllDayPanelOption,
        allDayStrategy: EAllDayAppointmentStrategy.withoutAllDayAppointments,
      };
    case EAllDayPanelModeOptionTypes.all:
    default:
      return {
        allDayPanelVisible: showAllDayPanelOption !== false,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      };
  }
}

export default mergeAllDayPanelPublicOptions;

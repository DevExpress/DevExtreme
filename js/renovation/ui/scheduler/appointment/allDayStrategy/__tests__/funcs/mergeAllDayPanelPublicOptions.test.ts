import { EAllDayAppointmentStrategy, EAllDayPanelModeOptionTypes, IAllDayPanelBehavior } from '../../types';
import mergeAllDayPanelPublicOptions from '../../funcs/mergeAllDayPanelPublicOptions';

describe('allDayStrategy functions: mergeAllDayPanelPublicOptions', () => {
  const showAllDayPanelOptionValues = [true, false, undefined] as const;
  const allDayPanelModeOptionValues = [...Object.values(EAllDayPanelModeOptionTypes), undefined];

  // eslint-disable-next-line @typescript-eslint/no-type-alias
  type TExpectedResult = Record<EAllDayPanelModeOptionTypes | 'undefined', Record<'true' | 'false' | 'undefined', IAllDayPanelBehavior>>;
  const expectedResults: TExpectedResult = {
    [EAllDayPanelModeOptionTypes.allDay]: {
      true: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.separate,
      },
      false: {
        allDayPanelVisible: false,
        allDayStrategy: EAllDayAppointmentStrategy.separate,
      },
      undefined: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.separate,
      },
    },
    [EAllDayPanelModeOptionTypes.all]: {
      true: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
      false: {
        allDayPanelVisible: false,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
      undefined: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
    },
    [EAllDayPanelModeOptionTypes.hidden]: {
      true: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.withoutAllDayAppointments,
      },
      false: {
        allDayPanelVisible: false,
        allDayStrategy: EAllDayAppointmentStrategy.withoutAllDayAppointments,
      },
      undefined: {
        allDayPanelVisible: false,
        allDayStrategy: EAllDayAppointmentStrategy.withoutAllDayAppointments,
      },
    },
    undefined: {
      true: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
      false: {
        allDayPanelVisible: false,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
      undefined: {
        allDayPanelVisible: true,
        allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
      },
    },
  };

  const getExpectedResult = (
    allDayModeValue: EAllDayPanelModeOptionTypes | undefined,
    showAllDayPanel: boolean | undefined,
  ): TExpectedResult => {
    const convertedAllDayModeValue = !allDayModeValue ? 'undefined' : allDayModeValue;
    const convertedShowAllDayPanelValue = showAllDayPanel === undefined ? 'undefined' : showAllDayPanel.toString();
    return expectedResults[convertedAllDayModeValue][convertedShowAllDayPanelValue];
  };

  allDayPanelModeOptionValues.forEach((allDayValue) => {
    showAllDayPanelOptionValues.forEach((showAllDayValue) => {
      it(`should correctly merge options  allDayPanelMode=${allDayValue}, showAllDayPanel=${showAllDayValue}`, () => {
        const expectedResult = getExpectedResult(allDayValue, showAllDayValue);

        const result = mergeAllDayPanelPublicOptions(showAllDayValue, allDayValue);

        expect(result).toEqual(expectedResult);
      });
    });
  });
});

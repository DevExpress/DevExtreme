import { EAllDayAppointmentStrategy, IAllDayPanelBehavior } from '../../types';
import compareAllDayPanelBehaviors from '../../funcs/compareAllDayPanelBehaviors';

describe('allDayStrategy functions: compareAllDayAppointment', () => {
  it('should return true if two IAllDayPanelBehavior objects equal by value', () => {
    const expectedResult = true;
    const first: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };
    const second: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };

    const result = compareAllDayPanelBehaviors(first, second);

    expect(result).toEqual(expectedResult);
  });

  it('should return false if \'allDayPanelVisible\' field different', () => {
    const expectedResult = false;
    const first: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };
    const second: IAllDayPanelBehavior = {
      allDayPanelVisible: false,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };

    const result = compareAllDayPanelBehaviors(first, second);

    expect(result).toEqual(expectedResult);
  });

  it('should return false if \'allDayStrategy\' field different', () => {
    const expectedResult = false;
    const first: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };
    const second: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.separate,
    };

    const result = compareAllDayPanelBehaviors(first, second);

    expect(result).toEqual(expectedResult);
  });

  it('should return false if first object to compare equals undefined', () => {
    const expectedResult = false;
    const allDayBehavior: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };

    const result = compareAllDayPanelBehaviors(allDayBehavior, undefined);

    expect(result).toEqual(expectedResult);
  });

  it('should return false if second object to compare equals undefined', () => {
    const expectedResult = false;
    const allDayBehavior: IAllDayPanelBehavior = {
      allDayPanelVisible: true,
      allDayStrategy: EAllDayAppointmentStrategy.allLongAppointment,
    };

    const result = compareAllDayPanelBehaviors(undefined, allDayBehavior);

    expect(result).toEqual(expectedResult);
  });

  it('should return true if objects to compare both equals undefined', () => {
    const expectedResult = true;

    const result = compareAllDayPanelBehaviors(undefined, undefined);

    expect(result).toEqual(expectedResult);
  });
});

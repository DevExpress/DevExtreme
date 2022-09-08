import { compileGetter, compileSetter } from '../../../../../../core/utils/data';
import { DataAccessorType } from '../../../types';
import patchDates from '../patchDates';

const convertUTCDateMock = jest.fn((date: Date | string): Date | string => date);
jest.mock(
  '../../date/convertUTCDate',
  () => ({
    ...jest.requireActual('../../date/convertUTCDate'),
    convertUTCDate: jest.fn(
      (date: Date | string): Date | string => convertUTCDateMock(date),
    ),
  }),
);

const defaultDataAccessors: DataAccessorType = {
  getter: {
    startDate: compileGetter('startDate') as any,
    endDate: compileGetter('endDate') as any,
    allDay: compileGetter('allDay') as any,
    recurrenceRule: compileGetter('recurrenceRule') as any,
    visible: compileGetter('visible') as any,
  },
  setter: {
    startDate: compileSetter('startDate') as any,
    endDate: compileSetter('endDate') as any,
  },
  expr: {
    startDateExpr: 'startDate',
    endDateExpr: 'endDate',
    allDayExpr: 'allDay',
    recurrenceRuleExpr: 'recurrenceRule',
    visibleExpr: 'visible',
  } as any,
};

describe('Data API', () => {
  describe('patchDates', () => {
    [{
      datesInUTC: false,
      allDay: false,
      expectedCallCount: 0,
    }, {
      datesInUTC: true,
      allDay: false,
      expectedCallCount: 0,
    }, {
      datesInUTC: false,
      allDay: true,
      expectedCallCount: 0,
    }, {
      datesInUTC: true,
      allDay: true,
      expectedCallCount: 2,
    }].forEach(({ datesInUTC, allDay, expectedCallCount }) => {
      it(`should return correct source appointment if datesInUTC=${datesInUTC}, allDay=${allDay}`, () => {
        patchDates({
          startDate: new Date(2021, 9, 8),
          endDate: new Date(2021, 9, 8, 1),
          allDay,
        },
        defaultDataAccessors,
        30,
        datesInUTC);

        expect(convertUTCDateMock)
          .toBeCalledTimes(expectedCallCount);
      });
    });
  });
});

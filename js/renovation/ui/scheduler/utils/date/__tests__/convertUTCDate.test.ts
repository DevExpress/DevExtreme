import { convertUTCDate, TConvertDirection } from '../convertUTCDate';

jest.mock('../../../../../../ui/scheduler/utils.timeZone', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../ui/scheduler/utils.timeZone'),
  default: {
    getClientTimezoneOffset: () => -240,
  },
}));

describe('ConvertUTCDate', () => {
  [{
    date: '2021-05-12T12:00:00.000Z',
    direction: 'toLocal',
    expected: '2021-05-12T12:00:00.240Z',
  }, {
    date: '2021-05-12T12:00:00.000Z',
    direction: 'toUtc',
    expected: '2021-05-12T11:59:59.760Z',
  }].forEach(({ date, direction, expected }) => {
    it(`should return correct date=${date}, direction=${direction} if dates as string`, () => {
      const convertedDate = convertUTCDate(date, direction as TConvertDirection) as Date;
      expect(convertedDate.toISOString())
        .toEqual(expected);
    });
  });

  [{
    date: new Date('2021-05-12T12:00:00.000Z'),
    direction: 'toLocal',
    expected: '2021-05-12T12:00:00.240Z',
  }, {
    date: new Date('2021-05-12T12:00:00.000Z'),
    direction: 'toUtc',
    expected: '2021-05-12T11:59:59.760Z',
  }].forEach(({ date, direction, expected }) => {
    it(`should return correct date=${date}, direction=${direction} if dates as Date`, () => {
      const convertedDate = convertUTCDate(date, direction as TConvertDirection) as Date;
      expect(convertedDate.toISOString())
        .toEqual(expected);
    });
  });

  it('should return correct value for the empty date', () => {
    expect(convertUTCDate('', 'toLocal').toString())
      .toEqual('');
  });
});

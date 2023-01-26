import { TimeZoneEditor } from '../timeZoneEditor';

jest.mock('../../../../../../../ui/scheduler/timezones/utils.timezones_data', () => ({
  ...jest.requireActual('../../../../../../../ui/scheduler/timezones/utils.timezones_data'),
  __esModule: true,
  default: {
    getDisplayedTimeZones: (args) => args,
  },
}));
jest.mock('../../../../../../../data/data_source', () => ({
  ...jest.requireActual('../../../../../../../data/data_source'),
  __esModule: true,
  default: jest.fn((...args) => args),
}));

describe('Logic', () => {
  describe('initDate', () => {
    it('should correctly change value', () => {
      const expected = 'Russia / Moscow';
      const editor = new TimeZoneEditor({
        value: expected,
        date: new Date(2022, 5, 15),
        valueChange: jest.fn((value) => value),
      });

      expect(editor.timeZone)
        .toEqual(undefined);

      editor.initDate();
      expect(editor.timeZone)
        .toEqual(expected);

      editor.props.value = 'America / New York';
      editor.initDate();
      expect(editor.timeZone)
        .toEqual(expected);
    });
  });

  describe('updateDate', () => {
    it('should correctly update date', () => {
      const editor = new TimeZoneEditor({
        value: 'Russia / Moscow',
        date: new Date(2022, 5, 15),
        valueChange: jest.fn((value) => value),
      });
      const expected = 'America / New York';

      editor.updateDate(expected);

      expect(editor.timeZone)
        .toEqual(expected);

      expect(editor.props.valueChange)
        .toHaveBeenCalledWith(expected);
    });
  });

  describe('dataSource', () => {
    it('should correctly return dataSource', () => {
      const date = new Date(2022, 5, 15, 10);
      const editor = new TimeZoneEditor({
        value: 'Russia / Moscow',
        date,
        valueChange: jest.fn((value) => value),
      });

      expect(editor.dataSource)
        .toEqual([{
          pageSize: 10,
          paginate: true,
          store: date,
        }]);
    });
  });
});

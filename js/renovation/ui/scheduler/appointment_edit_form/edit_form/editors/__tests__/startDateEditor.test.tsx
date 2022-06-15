import { StartDateEditor } from '../startDateEditor';

describe('Logic', () => {
  describe('valueChange', () => {
    it('should correctly change value', () => {
      const startDate = new Date(2022, 5, 15, 10);
      const endDate = new Date(2022, 5, 15, 11);
      const editor = new StartDateEditor({
        startDate,
        endDate,
        dateChange: jest.fn((value) => value),
      } as any);

      expect(editor.valueChange(new Date(2022, 5, 15, 12)))
        .toEqual(endDate);

      expect(editor.props.dateChange)
        .toBeCalledTimes(1);

      expect(editor.props.dateChange)
        .toBeCalledWith(endDate);
    });
  });
});

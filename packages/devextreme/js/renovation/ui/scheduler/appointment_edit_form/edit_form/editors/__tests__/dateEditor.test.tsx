import { DateEditor } from '../dateEditor';

describe('Logic', () => {
  describe('initDate', () => {
    it('should correctly init date', () => {
      const expectedDate = new Date(2022, 5, 15, 13, 30);
      const editForm = new DateEditor({
        value: expectedDate,
      } as any);

      expect(editForm.date)
        .toEqual(undefined);

      editForm.initDate();
      expect(editForm.date)
        .toEqual(expectedDate);

      editForm.props.value = new Date(2022, 5, 15, 14, 30);
      editForm.initDate();
      expect(editForm.date)
        .toEqual(expectedDate);
    });
  });

  describe('updateDate', () => {
    it('should correctly update date', () => {
      const expectedDate = new Date(2022, 5, 15, 12);
      const dateEditor = new DateEditor({
        value: new Date(2022, 5, 15),
        valueChange: jest.fn(() => expectedDate),
      } as any);

      dateEditor.updateDate(expectedDate);

      expect(dateEditor.props.valueChange)
        .toHaveBeenCalledWith(expectedDate);

      expect(dateEditor.date)
        .toEqual(expectedDate);
    });
  });

  describe('calendarOptions', () => {
    it('should correctly return options', () => {
      const dateEditor = new DateEditor({
        firstDayOfWeek: 1,
      } as any);

      expect(dateEditor.calendarOptions)
        .toEqual({ firstDayOfWeek: 1 });
    });
  });

  describe('type', () => {
    [
      { isAllDay: true, expected: 'date' },
      { isAllDay: false, expected: 'datetime' },
    ].forEach(({ isAllDay, expected }) => {
      it(`should correctly return type if allDay=${isAllDay}`, () => {
        const dateEditor = new DateEditor({ isAllDay } as any);

        expect(dateEditor.type)
          .toEqual(expected);
      });
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import {
  MonthDateTableCell as Cell,
  viewFunction as CellView,
} from '../cell';

jest.mock('../../../base/date_table/cell', () => ({
  ...require.requireActual('../../../base/date_table/cell'),
  DateTableCellBase: (props) => <div {...props} />,
}));

describe('MonthDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9);
    const endDate = new Date(2020, 6, 10);
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }) as any);

    it('should pass correct class', () => {
      const cell = render({ classes: 'test' });

      expect(cell.is('.test'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render day correctly', () => {
      const cell = render({});

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.childAt(0).text())
        .toBe(startDate.getDate().toString());
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        it('should return undefined in basic case', () => {
          const cell = new Cell({});

          expect(cell.classes)
            .toBeUndefined();
        });

        it('should return "other-month" class if otherMotnh is "true"', () => {
          const cell = new Cell({ otherMonth: true });

          expect(cell.classes)
            .toBe('dx-scheduler-date-table-other-month');
        });

        it('should return "today" class if today is "true"', () => {
          const cell = new Cell({ today: true });

          expect(cell.classes)
            .toBe('dx-scheduler-date-table-current-date');
        });

        it('should combine "today" and "othermonth" classes', () => {
          const cell = new Cell({ otherMonth: true, today: true });

          expect(cell.classes)
            .toBe('dx-scheduler-date-table-other-month dx-scheduler-date-table-current-date');
        });

        it('should combine basic classes with custom className', () => {
          const cell = new Cell({ otherMonth: true, today: true, className: 'custom-class' });

          expect(cell.classes)
            .toBe('dx-scheduler-date-table-other-month dx-scheduler-date-table-current-date custom-class');
        });
      });
    });
  });
});

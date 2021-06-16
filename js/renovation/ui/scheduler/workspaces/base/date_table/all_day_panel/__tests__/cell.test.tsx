import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';
import { DateTableCellBase, DateTableCellBaseProps } from '../../cell';

describe('AllDayPanelCell', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(
      <CellView
        {...viewModel}
        props={{ ...viewModel.props }}
      />,
    );

    it('should be rendered correctly', () => {
      const cell = render({ props: { className: 'test-class' } });

      expect(cell.type())
        .toBe(DateTableCellBase);
      expect(cell.children())
        .toHaveLength(0);

      expect(cell.hasClass('dx-scheduler-all-day-table-cell'))
        .toBe(true);
      expect(cell.hasClass('test-class'))
        .toBe(true);
    });

    it('should passs correct props to the root component', () => {
      const props = {
        startDate: new Date(2021, 5, 17, 11),
        endDate: new Date(2021, 5, 17, 11, 30),
        groups: { id: 1, text: '1' },
        groupIndex: 1,
        isFirstGroupCell: false,
        isLastGroupCell: true,
        index: 4,
        dataCellTemplate: jest.fn(),
        isSelected: true,
        isFocused: true,
      };
      const cell = render({ props });

      expect(cell.props())
        .toEqual({
          ...new DateTableCellBaseProps(),
          ...props,
          allDay: true,
          className: expect.any(String),
        });
    });
  });
});

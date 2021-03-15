import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';
import { DateTableCellBase } from '../../cell';

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
  });
});

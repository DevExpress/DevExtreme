import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';

jest.mock('../../../base/date_table/cell', () => ({
  ...require.requireActual('../../../base/date_table/cell'),
  DateTableCellBase: (props) => <div {...props} />,
}));

describe('DayDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const endDate = new Date(2020, 6, 9, 10);
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }) as any);

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render day correctly', () => {
      const cell = render({});

      expect(cell.children())
        .toHaveLength(0);
    });
  });
});

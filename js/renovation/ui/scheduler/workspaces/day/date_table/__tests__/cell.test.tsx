import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView } from '../cell';

jest.mock('../../../base/date_table/cell', () => ({
  ...require.requireActual('../../../base/date_table/cell'),
  DateTableCellBase: (props): JSX.Element => <div {...props} />,
}));

describe('DayDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const endDate = new Date(2020, 6, 9, 10);
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }));

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should ahead props correctly', () => {
      const cell = render({
        props: {
          isFirstCell: true,
          isLastCell: true,
          className: 'some-class',
        },
      });

      expect(cell.prop('isFirstCell'))
        .toBe(true);
      expect(cell.prop('isLastCell'))
        .toBe(true);
      expect(cell.prop('className'))
        .toEqual('some-class');
    });

    it('should render day correctly', () => {
      const cell = render({});

      expect(cell.children())
        .toHaveLength(0);
    });
  });
});

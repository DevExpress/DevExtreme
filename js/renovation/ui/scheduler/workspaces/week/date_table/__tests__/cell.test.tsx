import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';

jest.mock('../../../base/date_table/cell', () => ({
  ...jest.requireActual('../../../base/date_table/cell'),
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

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to the base cell', () => {
      const groups = { id: 1 };
      const groupIndex = 234;
      const index = 123;
      const isFirstGroupCell = true;
      const isLastGroupCell = false;
      const dataCellTemplate = () => null;

      const cell = render({
        props: {
          groups,
          groupIndex,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          dataCellTemplate,
        },
      });

      expect(cell.props())
        .toMatchObject({
          groups,
          groupIndex,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          dataCellTemplate,
          startDate,
          endDate,
        });
    });
  });
});

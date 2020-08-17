import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { DayDateTableCell } from '../cell';

jest.mock('../../../base/date_table/layout', () => ({
  ...require.requireActual('../../../base/date_table/layout'),
  DateTableLayoutBase: (props): JSX.Element => <div {...props} />,
}));

describe('DayDateTableLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };

    const render = (viewModel): ShallowWrapper => shallow(LayoutView({
      ...viewModel,
      props: { viewData, ...viewModel.props },
    }));

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to base layout', () => {
      const layout = render({});

      expect(layout.props())
        .toMatchObject({
          viewData,
          cellTemplate: DayDateTableCell,
        });
    });
  });
});

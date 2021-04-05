import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { MonthDateTableCell } from '../cell';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';

jest.mock('../../../base/date_table/layout', () => ({
  ...jest.requireActual('../../../base/date_table/layout'),
  DateTableLayoutBase: (props) => <div {...props} />,
}));

describe('MonthDateTableLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };

    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        viewData,
        groupOrientation: VERTICAL_GROUP_ORIENTATION,
        ...viewModel.props,
      },
    }) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should pass correct props to base layout', () => {
      const layout = render({
        props: {
          addDateTableClass: 'addDateTableClass',
        },
      });

      expect(layout.props())
        .toMatchObject({
          viewData,
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
          cellTemplate: MonthDateTableCell,
          addDateTableClass: 'addDateTableClass',
        });
    });
  });
});

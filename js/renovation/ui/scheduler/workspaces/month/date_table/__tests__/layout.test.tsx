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
        dateTable: [{
          cells: [{
            startDate: new Date(2020, 6, 9, 0),
            endDate: new Date(2020, 6, 9, 0, 30),
            groups: 1,
          }],
          key: 0,
        }, {
          cells: [{
            startDate: new Date(2020, 6, 9, 0, 30),
            endDate: new Date(2020, 6, 9, 1),
            groups: 2,
          }],
          key: 1,
        },
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
          tableRef: 'tableRef',
          addVerticalSizesClassToRows: false,
          width: 123,
        },
      });

      expect(layout.props())
        .toEqual({
          viewData,
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
          cellTemplate: MonthDateTableCell,
          addDateTableClass: 'addDateTableClass',
          tableRef: 'tableRef',
          addVerticalSizesClassToRows: false,
          width: 123,
        });
    });
  });
});

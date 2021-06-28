import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  viewFunction as CellView,
} from '../ordinary_cell';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
}));

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should render td', () => {
      const props = {
        colSpan: 32,
        styles: { width: 500 },
        className: 'custom-class',
      };

      const cell = render({ props });

      expect(cell.is('td'))
        .toBe(true);
      expect(cell.props())
        .toMatchObject({
          colSpan: props.colSpan,
          className: props.className,
          style: props.styles,
        });
    });

    it('should render children', () => {
      const cell = render({ props: { children: <div className="child-class" /> } });

      expect(cell.find('.child-class').exists())
        .toBe(true);
    });
  });
});

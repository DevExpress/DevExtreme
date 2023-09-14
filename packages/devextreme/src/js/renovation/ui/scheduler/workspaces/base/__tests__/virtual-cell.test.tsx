import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView, VirtualCell } from '../virtual_cell';
import { addWidthToStyle } from '../../utils';
import { HeaderCell } from '../header_cell';
import { OrdinaryCell } from '../ordinary_cell';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
}));

jest.mock('../../utils', () => ({
  addWidthToStyle: jest.fn(() => 'style'),
}));

describe('VirtualCell', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(
      <CellView
        {...viewModel}
        props={{
          isHeaderCell: false,
          ...viewModel.props,
        }}
      />,
    );

    it('should pass style to the root component', () => {
      const cell = render({ style: { with: '31px' } });

      expect(cell.prop('styles'))
        .toEqual({ with: '31px' });
      expect(cell.is(OrdinaryCell))
        .toBe(true);
    });

    it('should pass colSpan to the root component', () => {
      const cell = render({ props: { colSpan: 34 } });

      expect(cell.prop('colSpan'))
        .toBe(34);
    });

    it('should render header cell', () => {
      const cell = render({ props: { isHeaderCell: true } });

      expect(cell.is(HeaderCell))
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addWidthToStyle with proper parameters', () => {
          const style = { width: '100px', height: '200px' };
          const cell = new VirtualCell({ width: 500 });
          cell.restAttributes = { style };

          expect(cell.style)
            .toBe('style');

          expect(addWidthToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });
    });
  });
});

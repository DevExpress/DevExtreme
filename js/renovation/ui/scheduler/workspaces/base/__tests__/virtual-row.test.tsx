import React from 'react';
import { shallow } from 'enzyme';
import { VirtualRow, viewFunction as RowView } from '../virtual_row';
import { addHeightToStyle } from '../../utils';
import { VirtualCell } from '../virtual_cell';

jest.mock('../../utils', () => ({
  addHeightToStyle: jest.fn(() => 'style'),
}));
jest.mock('../row', () => ({
  ...jest.requireActual('../row'),
  Row: (props) => <tr {...props} />,
}));

describe('VirtualRow', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(RowView({
      virtualCells: [{}, {}],
      ...viewModel,
      props: { ...viewModel.props },
    }) as any);

    it('should pass className and style', () => {
      const row = render({
        classes: 'custom-class',
        style: 'style',
      });

      expect(row.is('.custom-class'))
        .toBe(true);
      expect(row.prop('styles'))
        .toBe('style');
    });

    it('should render virtual cells', () => {
      const row = render({});

      const virtualCells = row.find(VirtualCell);
      expect(virtualCells)
        .toHaveLength(2);

      expect(virtualCells.at(0).key())
        .toBe('0');
      expect(virtualCells.at(1).key())
        .toBe('1');
    });

    it('should correctly set virtual cells width', () => {
      const row = render({
        props: {
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 150,
          leftVirtualCellCount: 10,
          rightVirtualCellCount: 15,
        },
      });

      expect(row.props())
        .toMatchObject({
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 150,
          leftVirtualCellCount: 10,
          rightVirtualCellCount: 15,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addHeightToStyle with proper parameters', () => {
          const style = { width: '555px', height: '666px' };
          const row = new VirtualRow({ height: 500 });
          row.restAttributes = { style };

          expect(row.style)
            .toBe('style');

          expect(addHeightToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });

      describe('classes', () => {
        it('should correctly combine classes', () => {
          const row = new VirtualRow({ className: 'some-class' });

          expect(row.classes)
            .toBe('dx-scheduler-virtual-row some-class');
        });
      });

      describe('virtualCells', () => {
        it('should create an array of a specififc size that depends on cellsCount', () => {
          const row = new VirtualRow({ cellsCount: 4 });

          expect(row.virtualCells.length)
            .toBe(4);
        });
      });
    });
  });
});

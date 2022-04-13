import React from 'react';
import { mount } from 'enzyme';
import { VirtualRow, VirtualRowProps, viewFunction as VirtualRowView } from '../virtual_row';
import CLASSES from '../../classes';

describe('Virtual row', () => {
  describe('View', () => {
    it('should contain elements with attributes', () => {
      const viewProps = {
        virtualCells: [
          { key: 0, height: 10, cellClass: 'a' },
          { key: 1, height: 10, cellClass: 'b' },
        ],
        props: {
          rowKey: 1,
        },
      } as Partial<VirtualRow>;

      const tree = mount(
        <table>
          <tbody>
            <VirtualRowView {...viewProps as any} />
          </tbody>
        </table>,
      );

      const rowElement = tree.find('tr');
      const cellElements = rowElement.find('td');

      expect(rowElement.length).toEqual(1);
      expect(rowElement.at(0).key()).toEqual('1');
      expect(rowElement.props().role).toEqual('presentation');
      expect(rowElement.hasClass(CLASSES.row)).toBe(true);
      expect(rowElement.hasClass(CLASSES.columnLines)).toBe(true);
      expect(rowElement.hasClass(CLASSES.virtualRow)).toBe(true);
      expect(cellElements.length).toEqual(2);
      expect(cellElements.at(0).key()).toEqual('0');
      expect(cellElements.at(0).hasClass('a')).toBe(true);
      expect(cellElements.at(0).props().style?.height).toEqual(10);
      expect(cellElements.at(1).key()).toEqual('1');
      expect(cellElements.at(1).hasClass('b')).toBe(true);
      expect(cellElements.at(1).props().style?.height).toEqual(10);
    });
  });

  describe('Methods', () => {
    describe('virtualCells', () => {
      it('virtual cells', () => {
        const viewModel = new VirtualRow({
          height: 5,
          cellClasses: ['a', 'b', 'c'],
          rowKey: 3,
        } as VirtualRowProps);

        expect(viewModel.virtualCells).toEqual([
          { height: 5, key: 0, cellClass: 'a' },
          { height: 5, key: 1, cellClass: 'b' },
          { height: 5, key: 2, cellClass: 'c' },
        ]);
      });

      it('empty virtual cells', () => {
        const viewModel = new VirtualRow({
          height: 5,
          cellClasses: [],
          rowKey: 3,
        } as VirtualRowProps);

        expect(viewModel.virtualCells).toEqual([]);
      });
    });
  });
});

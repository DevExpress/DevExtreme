import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableView, Table } from '../table';
import { VirtualRow } from '../virtual_row';

describe('LayoutBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(TableView({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('render should be correct', () => {
      const layout = render({
        props: {
          className: 'some-class',
        },
        style: {
          height: 100,
        },
      });

      const table = layout.find('table');
      expect(table.exists())
        .toBe(true);
      expect(table.hasClass('some-class'))
        .toBe(true);
      expect(table.prop('style'))
        .toStrictEqual({ height: 100 });

      const tbody = layout.find('tbody');
      expect(tbody.exists())
        .toBe(true);
    });

    it('should render content', () => {
      const layout = render({
        props: { children: <div className="some-class" /> },
      });

      const content = layout.find('.some-class');
      expect(content.exists())
        .toBe(true);
    });

    [true, false].forEach((hasTopVirtualRow) => {
      [true, false].forEach((hasBottomVirtualRow) => {
        it(`should render virtual table correctly when hasTopVirtualRow
          is ${hasTopVirtualRow} and hasBottomVirtualRow is ${hasBottomVirtualRow}`, () => {
          const table = render({
            hasTopVirtualRow,
            hasBottomVirtualRow,
          });

          const topVirtualRowsCount = hasTopVirtualRow ? 1 : 0;
          const bottomVirtualRowsCount = hasBottomVirtualRow ? 1 : 0;

          const virtualRows = table.find(VirtualRow);
          expect(virtualRows)
            .toHaveLength(topVirtualRowsCount + bottomVirtualRowsCount);
        });
      });
    });

    it('should correctly set virtual cells width', () => {
      const table = render({
        hasTopVirtualRow: true,
        hasBottomVirtualRow: true,
        props: {
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 150,
        },
      });

      const virtualRows = table.find(VirtualRow);

      expect(virtualRows)
        .toHaveLength(2);

      virtualRows
        .forEach((item) => {
          expect(item.prop('leftVirtualCellWidth'))
            .toEqual(100);

          expect(item.prop('rightVirtualCellWidth'))
            .toEqual(150);
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('style', () => {
        const layout = new Table({ height: 100 });

        expect(layout.style)
          .toStrictEqual({ height: '100px' });
      });

      describe('hasTopVirtualRow,  hasBottomVirtualRow', () => {
        [{
          topVirtualRowHeight: undefined,
          hasTopVirtualRow: false,
        }, {
          topVirtualRowHeight: 0,
          hasTopVirtualRow: false,
        }, {
          topVirtualRowHeight: 100,
          hasTopVirtualRow: true,
        }].forEach(({ topVirtualRowHeight, hasTopVirtualRow }) => {
          it(`should return correct "hasTopVirtualRow" value if "topVirtualRowHeight" is ${topVirtualRowHeight}`, () => {
            const layout = new Table({
              topVirtualRowHeight,
            });

            expect(layout.hasTopVirtualRow)
              .toBe(hasTopVirtualRow);
          });
        });

        [{
          bottomVirtualRowHeight: undefined,
          hasBottomVirtualRow: false,
        }, {
          bottomVirtualRowHeight: 0,
          hasBottomVirtualRow: false,
        }, {
          bottomVirtualRowHeight: 100,
          hasBottomVirtualRow: true,
        }].forEach(({ bottomVirtualRowHeight, hasBottomVirtualRow }) => {
          it(`should return correct "hasBottomVirtualRow" value if "bottomVirtualRowHeight" is ${bottomVirtualRowHeight}`, () => {
            const layout = new Table({
              bottomVirtualRowHeight,
            });

            expect(layout.hasBottomVirtualRow)
              .toBe(hasBottomVirtualRow);
          });
        });
      });
    });
  });
});

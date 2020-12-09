import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableView, Table } from '../table';
import { VirtualRow } from '../virtual-row';

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
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('style', () => {
        const layout = new Table({ height: 100 });

        expect(layout.style)
          .toStrictEqual({ height: '100px' });
      });

      describe('Virtual Rows', () => {
        [true, false].forEach((isVirtual) => {
          it(`should return "hasTopVirtualRow" as false if "isVirtual" is ${isVirtual} and "topVirtualRowHeight" is undefined`, () => {
            const layout = new Table({
              isVirtual,
              topVirtualRowHeight: undefined,
            });

            expect(layout.hasTopVirtualRow)
              .toBe(false);
          });

          it(`should return "hasTopVirtualRow" as ${isVirtual} if "isVirtual" is ${isVirtual} and "topVirtualRowHeight" is defined`, () => {
            const layout = new Table({
              isVirtual,
              topVirtualRowHeight: 500,
            });

            expect(layout.hasTopVirtualRow)
              .toBe(isVirtual);
          });

          it(`should return "hasTopVirtualRow" as false if "isVirtual" is ${isVirtual} and "bottomVirtualRowHeight" is undefined`, () => {
            const layout = new Table({
              isVirtual,
              bottomVirtualRowHeight: undefined,
            });

            expect(layout.hasBottomVirtualRow)
              .toBe(false);
          });

          it(`should return "hasTopVirtualRow" as ${isVirtual} if "isVirtual" is ${isVirtual} and "bottomVirtualRowHeight" is defined`, () => {
            const layout = new Table({
              isVirtual,
              bottomVirtualRowHeight: 500,
            });

            expect(layout.hasBottomVirtualRow)
              .toBe(isVirtual);
          });
        });
      });
    });
  });
});

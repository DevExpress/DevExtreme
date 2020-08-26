import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { viewFunction as LayoutView, TimePanelTableLayout } from '../layout';
import { Row } from '../../row';
import { TimePanelCell as Cell } from '../cell';
import * as utilsModule from '../../../utils';
import { AllDayPanelTitle } from '../../date_table/all_day_panel/title';
import { Table } from '../../table';

const getIsAllDayPanelInsideDateTable = jest.spyOn(utilsModule, 'getIsAllDayPanelInsideDateTable');

describe('TimePanelLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 1), text: '0:00 AM' }, { startDate: new Date(2020, 6, 9, 2), text: '0:00 AM' }],
          [{ startDate: new Date(2020, 6, 9, 3), text: '1:00 AM' }, { startDate: new Date(2020, 6, 9, 4), text: '1:00 AM' }],
        ],
      }],
    };
    const render = (viewModel): ReactWrapper => mount(<LayoutView {...{
      ...viewModel,
      props: { viewData, ...viewModel.props },
    }}
    />);

    beforeEach(() => getIsAllDayPanelInsideDateTable.mockClear());

    it('should spread restAttributes', () => {
      const layout = render(
        { restAttributes: { 'custom-attribute': 'customAttribute' } },
      ).childAt(0);

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const layout = render({ props: { className: 'test-class' } });

      const table = layout.find('table');

      expect(table.exists())
        .toBe(true);

      expect(table.hasClass('dx-scheduler-time-panel'))
        .toBe(true);

      const tbody = layout.find('tbody');

      expect(tbody.exists())
        .toBe(true);

      expect(tbody.hasClass(''))
        .toBe(true);

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({ });

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      const { dateTable } = viewData.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: dateTable[0][0].startDate,
          text: dateTable[0][0].text,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: dateTable[1][0].startDate,
          text: dateTable[1][0].text,
        });
    });

    it('should render correct first, last group cells', () => {
      const layout = render({
        props: {
          viewData: {
            groupedData: [{
              dateTable: [
                [{ startDate: new Date(2020, 6, 9, 1), text: '0:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 2), text: '1:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 3), text: '2:00 AM' }],
                [{ startDate: new Date(2020, 6, 9, 4), text: '3:00 AM' }],
              ],
            }],
          },
        },
      });

      const assert = (
        cells: any,
        index: number,
        isFirstCell: boolean,
        isLastCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.prop('isFirstCell'))
          .toBe(isFirstCell);
        expect(cell.prop('isLastCell'))
          .toBe(isLastCell);
      };

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(4);

      assert(cells, 0, true, false);
      assert(cells, 1, false, false);
      assert(cells, 2, false, false);
      assert(cells, 3, false, true);
    });

    it('should render virtual table', () => {
      const layout = render({
        isVirtual: true,
        topVirtualRowHeight: 100,
        bottomVirtualRowHeight: 200,
      });

      const table = layout.find(Table);
      expect(table.exists())
        .toBe(true);
      expect(table.prop('isVirtual'))
        .toBe(true);
      expect(table.prop('topVirtualRowHeight'))
        .toEqual(100);
      expect(table.prop('bottomVirtualRowHeight'))
        .toEqual(200);
    });

    it('should call getIsAllDayPanelInsideDateTable with correct arguments', () => {
      render({ });

      expect(getIsAllDayPanelInsideDateTable)
        .toHaveBeenCalledTimes(1);

      expect(getIsAllDayPanelInsideDateTable)
        .toHaveBeenNthCalledWith(
          1,
          viewData,
          0,
        );
    });

    [true, false].forEach((mockValue) => {
      it(`AllDayPanelTitle if groupedAllDayPanel=${mockValue}`, () => {
        getIsAllDayPanelInsideDateTable.mockImplementation(() => mockValue);

        const layout = render({ });
        const titleCell = layout.find('.dx-scheduler-time-panel-title-cell');

        expect(titleCell.find(AllDayPanelTitle).exists())
          .toBe(mockValue);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      [true, false].forEach((isVirtual) => {
        it(`should get correct isVirtial flag if isVirtual=${isVirtual}`, () => {
          const layout = new TimePanelTableLayout({
            viewData: {
              groupedData: [],
              isVirtual,
            },
          });

          expect(layout.isVirtual)
            .toBe(isVirtual);
        });
      });

      [100, undefined].forEach((topVirtualRowHeight) => {
        [500, undefined].forEach((bottomVirtualRowHeight) => {
          it(`topVirtualRowHeight=${topVirtualRowHeight}, bottomVirtualRowHeight=${bottomVirtualRowHeight}`, () => {
            const layout = new TimePanelTableLayout({
              viewData: {
                groupedData: [],
                topVirtualRowHeight,
                bottomVirtualRowHeight,
              },
            });

            let value = topVirtualRowHeight || 0;
            expect(layout.topVirtualRowHeight)
              .toEqual(value);

            value = bottomVirtualRowHeight || 0;
            expect(layout.bottomVirtualRowHeight)
              .toEqual(value);
          });
        });
      });
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, TimePanelTableLayout } from '../layout';
import { Row } from '../../row';
import { TimePanelCell as Cell } from '../cell';
import * as utilsModule from '../../../utils';
import { AllDayPanelTitle } from '../../date_table/all_day_panel/title';
import { Table } from '../../table';

const getIsGroupedAllDayPanel = jest.spyOn(utilsModule, 'getIsGroupedAllDayPanel');
const getKeyByGroup = jest.spyOn(utilsModule, 'getKeyByGroup');

jest.mock('../../table', () => ({
  ...jest.requireActual('../../table'),
  Table: ({ children }) => (
    <table>
      <tbody>
        {children}
      </tbody>
    </table>
  ),
}));

describe('TimePanelLayout', () => {
  const timePanelDataBase = {
    groupedData: [{
      dateTable: [{
        startDate: new Date(2020, 6, 9, 1),
        endDate: new Date(2020, 6, 9, 2),
        text: '0:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 0,
        key: '1',
        isFirstGroupCell: false,
        isLastGroupCell: false,
      }, {
        startDate: new Date(2020, 6, 9, 3),
        endDate: new Date(2020, 6, 9, 4),
        text: '1:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 2,
        key: '3',
        isFirstGroupCell: false,
        isLastGroupCell: false,
      }],
      groupIndex: 2,
    }],
    cellCountInGroupRow: 2,
  };

  describe('Render', () => {
    const render = (viewModel) => shallow(
      <LayoutView
        {...{
          ...viewModel,
          props: { timePanelData: timePanelDataBase, ...viewModel.props },
        }}
      /> as any,
    );

    afterEach(jest.resetAllMocks);

    beforeEach(() => {
      getKeyByGroup.mockImplementation((key) => (key ? key.toString() : '0'));
    });

    it('should spread restAttributes', () => {
      const layout = render(
        { restAttributes: { 'custom-attribute': 'customAttribute' } },
      );

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render Table and Rows correctly', () => {
      const layout = render({
        topVirtualRowHeight: 100,
        bottomVirtualRowHeight: 200,
      });

      expect(layout.is(Table))
        .toBe(true);
      expect(layout.hasClass('dx-scheduler-time-panel'))
        .toBe(true);
      expect(layout.props())
        .toMatchObject({
          topVirtualRowHeight: 100,
          bottomVirtualRowHeight: 200,
          virtualCellsCount: 1,
        });

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
      expect(rows.at(0).key())
        .toBe('1');
      expect(rows.at(1).key())
        .toBe('3');
    });

    it('should render cells and pass correct props to them in basic case', () => {
      const layout = render({});

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      const { dateTable } = timePanelDataBase.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: dateTable[0].startDate,
          groups: dateTable[0].groups,
          groupIndex: dateTable[0].groupIndex,
          index: 0,
          text: dateTable[0].text,
          isFirstGroupCell: dateTable[0].isFirstGroupCell,
          isLastGroupCell: dateTable[0].isLastGroupCell,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          startDate: dateTable[1].startDate,
          groups: dateTable[1].groups,
          groupIndex: dateTable[1].groupIndex,
          index: 1,
          text: dateTable[1].text,
          isFirstGroupCell: dateTable[1].isFirstGroupCell,
          isLastGroupCell: dateTable[1].isLastGroupCell,
        });
    });

    it('should pass groups and groupIndex to cells', () => {
      const layout = render({
        isVerticalGroupingApplied: true,
      });

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      const { dateTable } = timePanelDataBase.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          groups: dateTable[0].groups,
          groupIndex: dateTable[0].groupIndex,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          groups: dateTable[1].groups,
          groupIndex: dateTable[1].groupIndex,
        });
    });

    it('should call getIsGroupedAllDayPanel with correct arguments', () => {
      render({ });

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledTimes(1);

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledWith(
          timePanelDataBase,
          0,
        );
    });

    [true, false].forEach((mockValue) => {
      it(`should render AllDayPanelTitle if isGroupedAllDayPanel=${mockValue}`, () => {
        getIsGroupedAllDayPanel.mockImplementation(() => mockValue);

        const layout = render({ });
        const titleCell = layout.find('.dx-scheduler-time-panel-title-cell');

        expect(titleCell.find(AllDayPanelTitle).exists())
          .toBe(mockValue);
      });

      it(`should render AllDayPanelTitle if isGroupedAllDayPanel=${mockValue} and dateTable is empty`, () => {
        getIsGroupedAllDayPanel.mockImplementation(() => mockValue);

        const timePanelData = {
          groupedData: [{
            dateTable: [],
            groupIndex: 33,
          }],
          cellCountInGroupRow: 2,
          isGroupedAllDayPanel: true,
        };
        const layout = render({ props: { timePanelData } });
        const titleCell = layout.find('.dx-scheduler-time-panel-title-cell');

        expect(titleCell.find(AllDayPanelTitle).exists())
          .toBe(mockValue);
      });
    });

    it('should call getKeyByGroup with correct arguments', () => {
      render({});

      expect(getKeyByGroup)
        .toHaveBeenCalledTimes(1);
      expect(getKeyByGroup)
        .toHaveBeenCalledWith(2, undefined);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      [100, undefined].forEach((topVirtualRowHeight) => {
        [500, undefined].forEach((bottomVirtualRowHeight) => {
          it(`topVirtualRowHeight=${topVirtualRowHeight}, bottomVirtualRowHeight=${bottomVirtualRowHeight}`, () => {
            const layout = new TimePanelTableLayout({
              timePanelData: {
                ...timePanelDataBase,
                topVirtualRowHeight,
                bottomVirtualRowHeight,
              } as any,
            });

            let value = topVirtualRowHeight ?? 0;
            expect(layout.topVirtualRowHeight)
              .toEqual(value);

            value = bottomVirtualRowHeight ?? 0;
            expect(layout.bottomVirtualRowHeight)
              .toEqual(value);
          });
        });
      });
    });
  });
});

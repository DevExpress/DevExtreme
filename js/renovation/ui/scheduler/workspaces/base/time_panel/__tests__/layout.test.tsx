import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, TimePanelTableLayout } from '../layout';
import { Row } from '../../row';
import { TimePanelCell as Cell } from '../cell';
import * as utilsModule from '../../../utils';
import { AllDayPanelTitle } from '../../date_table/all_day_panel/title';
import { Table } from '../../table';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';

const getIsGroupedAllDayPanel = jest.spyOn(utilsModule, 'getIsGroupedAllDayPanel');
const getKeyByGroup = jest.spyOn(utilsModule, 'getKeyByGroup');
const isVerticalGroupOrientation = jest.spyOn(utilsModule, 'isVerticalGroupOrientation');

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
  const viewDataBase = {
    groupedData: [{
      dateTable: [[{
        startDate: new Date(2020, 6, 9, 1),
        endDate: new Date(2020, 6, 9, 2),
        text: '0:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 0,
        key: '1',
      }, {
        startDate: new Date(2020, 6, 9, 2),
        endDate: new Date(2020, 6, 9, 3),
        text: '0:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 1,
        key: '2',
      }], [{
        startDate: new Date(2020, 6, 9, 3),
        endDate: new Date(2020, 6, 9, 4),
        text: '1:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 2,
        key: '3',
      }, {
        startDate: new Date(2020, 6, 9, 4),
        endDate: new Date(2020, 6, 9, 4),
        text: '1:00 AM',
        groups: { id: 2 },
        groupIndex: 2,
        index: 3,
        key: '4',
      }]],
      groupIndex: 2,
    }],
    cellCountInGroupRow: 2,
  };

  describe('Render', () => {
    const render = (viewModel) => shallow(<LayoutView {...{
      ...viewModel,
      props: { viewData: viewDataBase, ...viewModel.props },
    }}
    />);

    afterEach(jest.resetAllMocks);

    beforeEach(() => {
      getKeyByGroup.mockImplementation((key) => key.toString());
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
        isVirtual: 'isVirtual',
        topVirtualRowHeight: 100,
        bottomVirtualRowHeight: 200,
      });

      expect(layout.is(Table))
        .toBe(true);
      expect(layout.hasClass('dx-scheduler-time-panel'))
        .toBe(true);
      expect(layout.props())
        .toMatchObject({
          isVirtual: 'isVirtual',
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

      const { dateTable } = viewDataBase.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: dateTable[0][0].startDate,
          groups: undefined,
          groupIndex: undefined,
          index: 0,
          text: dateTable[0][0].text,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          startDate: dateTable[1][0].startDate,
          groups: undefined,
          groupIndex: undefined,
          index: 1,
          text: dateTable[1][0].text,
        });
    });

    it('should not pass groups and groupIndex to cells if groupOrientation is not vertical', () => {
      const layout = render({
        isVerticalGroupOrientation: false,
      });

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          groups: undefined,
          groupIndex: undefined,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          groups: undefined,
          groupIndex: undefined,
        });
    });

    it('should pass groups and groupIndex to cells if groupOrientation is vertical', () => {
      const layout = render({
        isVerticalGroupOrientation: true,
      });

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      const { dateTable } = viewDataBase.groupedData[0];

      expect(cells.at(0).props())
        .toMatchObject({
          groups: dateTable[0][0].groups,
          groupIndex: dateTable[0][0].groupIndex,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          groups: dateTable[1][0].groups,
          groupIndex: dateTable[1][0].groupIndex,
        });
    });

    describe('firstGroupCell, lastGroupCell', () => {
      const viewData = {
        groupedData: [{
          dateTable: [
            [{
              startDate: new Date(2020, 6, 9, 1),
              text: '0:00 AM',
              isFirstGroupCell: true,
              isLastGroupCell: false,
              key: '1',
            }],
            [{
              startDate: new Date(2020, 6, 9, 2),
              text: '1:00 AM',
              isFirstGroupCell: false,
              isLastGroupCell: false,
              key: '2',
            }],
            [{
              startDate: new Date(2020, 6, 9, 3),
              text: '2:00 AM',
              isFirstGroupCell: false,
              isLastGroupCell: false,
              key: '3',
            }],
            [{
              startDate: new Date(2020, 6, 9, 4),
              text: '3:00 AM',
              isFirstGroupCell: false,
              isLastGroupCell: true,
              key: '4',
            }],
          ],
          groupIndex: 10,
        }],
      };
      const assert = (
        cells: any,
        index: number,
        isFirstGroupCell: boolean,
        isLastGroupCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.prop('isFirstGroupCell'))
          .toBe(isFirstGroupCell);
        expect(cell.prop('isLastGroupCell'))
          .toBe(isLastGroupCell);
      };

      it('should pass correct "isFirstGroupCell" and "isLastGroupCell" props to the cells', () => {
        const layout = render({
          props: { viewData },
          isVerticalGroupOrientation: true,
        });

        const cells = layout.find(Cell);
        expect(cells)
          .toHaveLength(4);

        assert(cells, 0, true, false);
        assert(cells, 1, false, false);
        assert(cells, 2, false, false);
        assert(cells, 3, false, true);
      });

      it('should not pass "isFirstGroupCell" and "isLastGroupCell" props to the cells if grouping is not vertical', () => {
        const layout = render({
          props: { viewData },
          isVerticalGroupOrientation: false,
        });

        const cells = layout.find(Cell);
        expect(cells)
          .toHaveLength(4);

        assert(cells, 0, false, false);
        assert(cells, 1, false, false);
        assert(cells, 2, false, false);
        assert(cells, 3, false, false);
      });
    });

    it('should call getIsGroupedAllDayPanel with correct arguments', () => {
      render({ });

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledTimes(1);

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledWith(
          viewDataBase,
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

        const viewData = {
          groupedData: [{
            dateTable: [],
            groupIndex: 33,
          }],
          cellCountInGroupRow: 2,
          isGroupedAllDayPanel: true,
        };
        const layout = render({ props: { viewData } });
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
        .toHaveBeenCalledWith(2);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      [true, false].forEach((isVirtual) => {
        it(`should get correct isVirtial flag if isVirtual=${isVirtual}`, () => {
          const layout = new TimePanelTableLayout({
            viewData: {
              ...viewDataBase,
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
                ...viewDataBase,
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

      it('should calculate isVerticalGroupOrientation correctly', () => {
        const layout = new TimePanelTableLayout({
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.isVerticalGroupOrientation;

        expect(isVerticalGroupOrientation)
          .toHaveBeenCalledWith(VERTICAL_GROUP_ORIENTATION);
      });
    });
  });
});

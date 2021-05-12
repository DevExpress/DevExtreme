import * as React from 'react';
import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
  TimelineDateHeaderLayout,
} from '../layout';
import { Row } from '../../../../base/row';
import * as utilsModule from '../../../../utils';
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '../../../../../consts';
import { DateHeaderCell } from '../../../../base/header_panel/date_header/cell';

const isHorizontalGroupOrientation = jest.spyOn(utilsModule, 'isHorizontalGroupOrientation');

describe('TimelineDateHeaderLayout', () => {
  const dateHeaderData: any = {
    dataMap: [[{
      startDate: new Date(2020, 6, 9),
      endDate: new Date(2020, 6, 10),
      today: true,
      groups: { id: 1 },
      groupIndex: 1,
      index: 0,
      text: 'Text',
      isFirstGroupCell: true,
      isLastGroupCell: false,
      colSpan: 34,
      key: '0',
    }, {
      startDate: new Date(2020, 6, 10),
      endDate: new Date(2020, 6, 11),
      today: false,
      groups: { id: 1 },
      groupIndex: 1,
      index: 1,
      text: 'Text',
      isFirstGroupCell: false,
      isLastGroupCell: true,
      colSpan: 34,
      key: '1',
    }]],
    leftVirtualCellCount: 1,
    leftVirtualCellWidth: 2,
    rightVirtualCellCount: 3,
    rightVirtualCellWidth: 4,
  };

  describe('Render', () => {
    const render = (viewModel) => shallow(
      <LayoutView
        {...viewModel}
        props={{
          dateHeaderData,
          ...viewModel.props,
        }}
      /> as any,
    );

    it('should render components correctly', () => {
      const layout = render({});

      const row = layout.find(Row);

      expect(row.exists())
        .toBe(true);
      expect(row)
        .toHaveLength(1);
    });

    it('should render cells and pass correct props to them in basic case', () => {
      const dateCellTemplate = () => null;
      const timeCellTemplate = () => null;
      const layout = render({
        props: {
          dateCellTemplate,
          timeCellTemplate,
        },
        isHorizontalGrouping: true,
      });

      const cells = layout.find(DateHeaderCell);
      expect(cells)
        .toHaveLength(2);

      const firstCell = cells.at(0);
      const firstCellData = dateHeaderData.dataMap[0][0];

      expect(firstCell.props())
        .toMatchObject({
          startDate: firstCellData.startDate,
          endDate: firstCellData.endDate,
          today: firstCellData.today,
          groups: firstCellData.groups,
          groupIndex: firstCellData.groupIndex,
          index: firstCellData.index,
          text: firstCellData.text,
          isFirstGroupCell: firstCellData.isFirstGroupCell,
          isLastGroupCell: firstCellData.isLastGroupCell,
          colSpan: firstCellData.colSpan,
          isWeekDayCell: false,
          dateCellTemplate,
          timeCellTemplate,
          isTimeCellTemplate: true,
        });
      expect(firstCell.key())
        .toBe(firstCellData.key);

      const secondCell = cells.at(1);
      const secondCellData = dateHeaderData.dataMap[0][1];

      expect(secondCell.props())
        .toMatchObject({
          startDate: secondCellData.startDate,
          endDate: secondCellData.endDate,
          today: secondCellData.today,
          groups: secondCellData.groups,
          groupIndex: secondCellData.groupIndex,
          index: secondCellData.index,
          text: secondCellData.text,
          isFirstGroupCell: secondCellData.isFirstGroupCell,
          isLastGroupCell: secondCellData.isLastGroupCell,
          colSpan: secondCellData.colSpan,
          isWeekDayCell: false,
          dateCellTemplate,
          timeCellTemplate,
          isTimeCellTemplate: true,
        });
      expect(secondCell.key())
        .toBe(secondCellData.key);
    });

    describe('templates', () => {
      const dateCellTemplate = () => null;
      const timeCellTemplate = () => null;

      [{
        testDateHeaderData: {
          dataMap: [[dateHeaderData.dataMap[0][0]]],
          leftVirtualCellCount: 1,
          leftVirtualCellWidth: 2,
          rightVirtualCellCount: 3,
          rightVirtualCellWidth: 4,
        },
        cellCount: 1,
        expectedCellData: [{
          isWeekDayCell: false,
          isTimeCellTemplate: true,
        }],
        expectedRowProps: [{
          className: 'dx-scheduler-header-row',
          leftVirtualCellCount: 1,
          leftVirtualCellWidth: 2,
          rightVirtualCellCount: 3,
          rightVirtualCellWidth: 4,
          children: expect.anything(),
        }],
        rowsCount: 1,
      }, {
        testDateHeaderData: {
          dataMap: [[dateHeaderData.dataMap[0][0]], [dateHeaderData.dataMap[0][1]]],
          leftVirtualCellCount: 1,
          leftVirtualCellWidth: 2,
          rightVirtualCellCount: 3,
          rightVirtualCellWidth: 4,
          weekDayLeftVirtualCellCount: 5,
          weekDayLeftVirtualCellWidth: 6,
          weekDayRightVirtualCellCount: 7,
          weekDayRightVirtualCellWidth: 8,
        },
        cellCount: 2,
        expectedCellData: [{
          isWeekDayCell: true,
          isTimeCellTemplate: false,
        }, {
          isWeekDayCell: false,
          isTimeCellTemplate: true,
        }],
        expectedRowProps: [{
          className: 'dx-scheduler-header-row',
          leftVirtualCellCount: 5,
          leftVirtualCellWidth: 6,
          rightVirtualCellCount: 7,
          rightVirtualCellWidth: 8,
          children: expect.anything(),
        }, {
          className: 'dx-scheduler-header-row',
          leftVirtualCellCount: 1,
          leftVirtualCellWidth: 2,
          rightVirtualCellCount: 3,
          rightVirtualCellWidth: 4,
          children: expect.anything(),
        }],
        rowsCount: 2,
      }].forEach(({
        testDateHeaderData,
        cellCount,
        expectedCellData,
        expectedRowProps,
        rowsCount,
      }) => {
        it(`should pass correct props to the cells when there are ${rowsCount} rows`, () => {
          const layout = render({
            isHorizontalGrouping: true,
            props: {
              dateHeaderData: testDateHeaderData,
              dateCellTemplate,
              timeCellTemplate,
            },
          });

          const cells = layout.find(DateHeaderCell);
          expect(cells)
            .toHaveLength(cellCount);

          cells.forEach((cell, index) => {
            expect(cell.props())
              .toMatchObject(expectedCellData[index]);
          });
        });

        it(`should pass correct props to the Row components when there are ${rowsCount} rows`, () => {
          const layout = render({
            isHorizontalGrouping: true,
            props: {
              dateHeaderData: testDateHeaderData,
              dateCellTemplate,
              timeCellTemplate,
            },
          });

          const rows = layout.find(Row);
          expect(rows)
            .toHaveLength(rowsCount);

          rows.forEach((row, index) => {
            expect(row.props())
              .toMatchObject(expectedRowProps[index]);
          });
        });
      });
    });

    it('should not pass groups and groupInex to cells in case of Vertical Gruping', () => {
      const layout = render({
        isHorizontalGrouping: false,
      });

      const cells = layout.find(DateHeaderCell);

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
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isHorizontalGrouping', () => {
        it('should call "isHorizontalGroupOrientation" with correct parameters', () => {
          const groups = [];
          const layout = new TimelineDateHeaderLayout({
            groupOrientation: VERTICAL_GROUP_ORIENTATION,
            groups,
            dateHeaderData,
          });

          expect(layout.isHorizontalGrouping)
            .toBe(false);

          expect(isHorizontalGroupOrientation)
            .toHaveBeenCalledWith(groups, VERTICAL_GROUP_ORIENTATION);
        });

        it('should return false if grouping by date is used', () => {
          const groups = [{ name: 'group', items: [{ id: 1 }], data: [{ id: 1 }] }];
          const layout = new TimelineDateHeaderLayout({
            groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
            groups,
            groupByDate: true,
            dateHeaderData,
          });

          expect(layout.isHorizontalGrouping)
            .toBe(false);

          expect(isHorizontalGroupOrientation)
            .toHaveBeenCalledWith(groups, HORIZONTAL_GROUP_ORIENTATION);
        });

        it('should return true if horizontal grouping is used', () => {
          const groups = [{ name: 'group', items: [{ id: 1 }], data: [{ id: 1 }] }];
          const layout = new TimelineDateHeaderLayout({
            groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
            groups,
            groupByDate: false,
            dateHeaderData,
          });

          expect(layout.isHorizontalGrouping)
            .toBe(true);

          expect(isHorizontalGroupOrientation)
            .toHaveBeenCalledWith(groups, HORIZONTAL_GROUP_ORIENTATION);
        });
      });
    });
  });
});

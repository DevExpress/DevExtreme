import * as React from 'react';
import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
  TimelineDateHeaderLayout,
} from '../layout';
import { Row } from '../../../../base/row';
import * as utilsModule from '../../../../utils';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../../consts';
import { DateHeaderCell } from '../../../../base/header_panel/date_header/cell';

const isHorizontalGroupOrientation = jest.spyOn(utilsModule, 'isHorizontalGroupOrientation');

describe('DateHeaderLayout', () => {
  describe('Render', () => {
    const dateHeaderMap: any = [[{
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
    }]];

    const render = (viewModel) => shallow(
      <LayoutView
        {...viewModel}
        props={{
          dateHeaderMap,
          ...viewModel.props,
        }}
      />,
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
      const firstCellData = dateHeaderMap[0][0];

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
      const secondCellData = dateHeaderMap[0][1];

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
        testDateHeaderMap: [[dateHeaderMap[0][0]]],
        cellCount: 1,
        expectedCellData: [{
          isWeekDayCell: false,
          isTimeCellTemplate: true,
        }],
        description: 'should pass correct props to the cell when there is one row and "useTimeCellTemplate" is true',
      }, {
        testDateHeaderMap: [[dateHeaderMap[0][0]], [dateHeaderMap[0][1]]],
        cellCount: 2,
        expectedCellData: [{
          isWeekDayCell: true,
          isTimeCellTemplate: false,
        }, {
          isWeekDayCell: false,
          isTimeCellTemplate: true,
        }],
        description: 'should pass correct props to the cells when there are 2 rows and "useTimeCellTemplate" is true',
      }].forEach(({
        testDateHeaderMap,
        cellCount,
        expectedCellData,
        description,
      }) => {
        it(description, () => {
          const layout = render({
            isHorizontalGrouping: true,
            props: {
              dateHeaderMap: testDateHeaderMap,
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
          });

          expect(layout.isHorizontalGrouping)
            .toBe(false);

          expect(isHorizontalGroupOrientation)
            .toHaveBeenCalledWith(groups, VERTICAL_GROUP_ORIENTATION);
        });
      });
    });
  });
});

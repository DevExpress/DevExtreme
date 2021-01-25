import * as React from 'react';
import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
  DateHeader,
  DateHeaderProps,
} from '../layout';
import { Row } from '../../../row';
import * as utilsModule from '../../../../utils';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../../consts';
import { DateHeaderCell } from '../cell';

const isHorizontalGroupOrientation = jest.spyOn(utilsModule, 'isHorizontalGroupOrientation');

describe('HeaderPanelLayoutBase', () => {
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
          ...(new DateHeaderProps()),
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
      const layout = render({ props: { dateCellTemplate }, isHorizontalGrouping: true });

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
          dateCellTemplate,
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
          dateCellTemplate,
        });
      expect(secondCell.key())
        .toBe(secondCellData.key);
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
      it('should calculate isVerticalGroupOrientation correctly', () => {
        const groups = [];
        const layout = new DateHeader({
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

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { viewFunction as TableBodyView, AllDayPanelTableBody } from '../table_body';
import { Row } from '../../../row';
import { AllDayPanelCell } from '../cell';
import * as combineClassesModule from '../../../../../../../utils/combine_classes';

const combineClasses = jest.spyOn(combineClassesModule, 'combineClasses');

describe('AllDayPanelTableBody', () => {
  describe('Render', () => {
    const viewData = [{
      startDate: new Date(2020, 7, 28),
      endDate: new Date(2020, 7, 29),
      groups: { id: 1 },
      groupIndex: 1,
      index: 3,
      isFirstGroupCell: true,
      isLastGroupCell: false,
      key: '0',
      isSelected: true,
      isFocused: false,
    }, {
      startDate: new Date(2020, 7, 29),
      endDate: new Date(2020, 7, 30),
      groups: { id: 2 },
      groupIndex: 2,
      index: 4,
      isFirstGroupCell: false,
      isLastGroupCell: true,
      key: '1',
      isSelected: true,
      isFocused: true,
    }];

    const render = (viewModel): ReactWrapper<AllDayPanelTableBody> => mount(
      <table>
        <tbody>
          <TableBodyView
            {...viewModel}
            props={{
              viewData,
              ...viewModel.props,
            }}
          />
        </tbody>
      </table> as any,
    ).find(TableBodyView).childAt(0);

    it('should render components and pass correct arguments to them', () => {
      const tableBody = render({
        classes: 'some-class',
        props: {
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 200,
          leftVirtualCellCount: 34,
          rightVirtualCellCount: 44,
        },
      });

      const row = tableBody.find(Row);

      expect(row)
        .toHaveLength(1);

      expect(row.props())
        .toMatchObject({
          className: 'some-class',
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 200,
          leftVirtualCellCount: 34,
          rightVirtualCellCount: 44,
        });

      const cells = tableBody.find(AllDayPanelCell);

      expect(cells)
        .toHaveLength(2);

      const firstCell = cells.at(0);
      expect(firstCell.props())
        .toMatchObject({
          isFirstGroupCell: true,
          isLastGroupCell: false,
          startDate: viewData[0].startDate,
          endDate: viewData[0].endDate,
          groups: viewData[0].groups,
          groupIndex: viewData[0].groupIndex,
          index: viewData[0].index,
          isSelected: viewData[0].isSelected,
          isFocused: viewData[0].isFocused,
        });
      expect(firstCell.key())
        .toBe(viewData[0].key);

      const secondCell = cells.at(1);
      expect(secondCell.props())
        .toMatchObject({
          isFirstGroupCell: false,
          isLastGroupCell: true,
          startDate: viewData[1].startDate,
          endDate: viewData[1].endDate,
          groups: viewData[1].groups,
          groupIndex: viewData[1].groupIndex,
          index: viewData[1].index,
          isSelected: viewData[1].isSelected,
          isFocused: viewData[1].isFocused,
        });
      expect(secondCell.key())
        .toBe(viewData[1].key);
    });

    it('should not pass "isFirstGroupCell" and "isLastGroupCell" when grouped vertically', () => {
      const tableBody = render({ props: { isVerticalGroupOrientation: true } });

      expect(tableBody.find(Row))
        .toHaveLength(1);

      const cells = tableBody.find(AllDayPanelCell);

      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).prop('isFirstGroupCell'))
        .toBe(false);
      expect(cells.at(0).prop('isLastGroupCell'))
        .toBe(false);

      expect(cells.at(1).prop('isFirstGroupCell'))
        .toBe(false);
      expect(cells.at(1).prop('isLastGroupCell'))
        .toBe(false);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        afterEach(jest.resetAllMocks);

        it('should call combineClasses with correct parameters', () => {
          const tableBody = new AllDayPanelTableBody({ });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          tableBody.classes;

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-all-day-table-row': true,
              '': false,
            });
        });
      });
    });
  });
});

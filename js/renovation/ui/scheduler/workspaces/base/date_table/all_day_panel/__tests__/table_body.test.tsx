import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { viewFunction as TableBodyView, AllDayPanelTableBody } from '../table_body';
import { AllDayPanelRow as Row } from '../row';
import { AllDayPanelCell as Cell } from '../cell';
import * as utilsModule from '../../../../utils';

const getKeyByDateAndGroup = jest.spyOn(utilsModule, 'getKeyByDateAndGroup');

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
    }, {
      startDate: new Date(2020, 7, 29),
      endDate: new Date(2020, 7, 30),
      groups: { id: 2 },
      groupIndex: 2,
      index: 4,
      isFirstGroupCell: false,
      isLastGroupCell: true,
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
      </table>,
    ).find(TableBodyView).childAt(0);

    afterEach(getKeyByDateAndGroup.mockClear);

    it('should spread restAttributes', () => {
      const tableBody = render({
        restAttributes: { 'custom-attribute': 'customAttribute' },
      });

      expect(tableBody.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const tableBody = render({});

      expect(tableBody.find(Row))
        .toHaveLength(1);

      const cells = tableBody.find(Cell);

      expect(cells)
        .toHaveLength(2);
      expect(cells.at(0).props())
        .toMatchObject({
          isFirstGroupCell: true,
          isLastGroupCell: false,
          startDate: viewData[0].startDate,
          endDate: viewData[0].endDate,
          groups: viewData[0].groups,
          groupIndex: viewData[0].groupIndex,
          index: viewData[0].index,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          isFirstGroupCell: false,
          isLastGroupCell: true,
          startDate: viewData[1].startDate,
          endDate: viewData[1].endDate,
          groups: viewData[1].groups,
          groupIndex: viewData[1].groupIndex,
          index: viewData[1].index,
        });
    });

    it('should not pass "isFirstGroupCell" and "isLastGroupCell" when grouped vertically', () => {
      const tableBody = render({ props: { isVerticalGroupOrientation: true } });

      expect(tableBody.find(Row))
        .toHaveLength(1);

      const cells = tableBody.find(Cell);

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

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(2);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1,
          viewData[0].startDate,
          viewData[0].groups,
        );

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          2,
          viewData[1].startDate,
          viewData[1].groups,
        );
    });
  });
});

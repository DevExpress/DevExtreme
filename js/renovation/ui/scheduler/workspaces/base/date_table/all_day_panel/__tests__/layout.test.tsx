import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, AllDayPanelLayout } from '../layout';
import { AllDayPanelTableBody } from '../table_body';
import { DefaultSizes } from '../../../../const';
import { TableProps } from '../../../table';

describe('AllDayPanelLayout', () => {
  const viewData: any = {
    groupedData: [{
      allDayPanel: [{
        startDate: new Date(2020, 6, 9),
        endDate: new Date(2020, 6, 10),
        text: '',
        index: 0,
        isFirstGroupCell: false,
        isLastGroupCell: false,
        key: '1',
      }],
      dateTable: [[]],
      groupIndex: 1,
    }],
    leftVirtualCellWidth: 100,
    rightVirtualCellWidth: 200,
    leftVirtualCellCount: 34,
    rightVirtualCellCount: 44,
  };
  const allDayPanelData = viewData.groupedData[0].allDayPanel;

  describe('Render', () => {
    const render = (viewModel) => shallow(
      <LayoutView
        allDayPanelData={allDayPanelData}
        {...viewModel}
        props={{
          visible: true,
          viewData,
          ...viewModel.props,
        }}
      /> as any,
    );

    it('should render components and pass correct arguments to them', () => {
      const dataCellTemplate = () => null;
      const layout = render({
        restAttributes: { style: { height: 500 } },
        emptyTableHeight: 123,
        props: {
          dataCellTemplate,
          width: 321,
        },
      });

      const allDayTable = layout.find('.dx-scheduler-all-day-table');

      expect(allDayTable.props())
        .toEqual({
          ...new TableProps(),
          height: 123,
          width: 321,
          className: 'dx-scheduler-all-day-table',
          children: expect.anything(),
        });

      expect(allDayTable.exists())
        .toBe(true);

      const tableBody = allDayTable.find(AllDayPanelTableBody);

      expect(tableBody.exists())
        .toBe(true);

      expect(tableBody)
        .toHaveLength(1);

      expect(tableBody.props())
        .toMatchObject({
          viewData: allDayPanelData,
          dataCellTemplate,
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 200,
          leftVirtualCellCount: 34,
          rightVirtualCellCount: 44,
        });
    });

    it('should render all-day appointments', () => {
      const layout = render({
        props: {
          allDayAppointments: (
            <div className="all-day-appointments" />
          ),
        },
      });

      expect(layout.find('.all-day-appointments').exists())
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('allDayPanelData', () => {
        const layout = new AllDayPanelLayout({ viewData });

        expect(layout.allDayPanelData)
          .toStrictEqual(viewData.groupedData[0].allDayPanel);
      });

      it('emptyTableHeight should not return height if allDayPanel data is present', () => {
        const layout = new AllDayPanelLayout({ viewData });

        expect(layout.emptyTableHeight)
          .toEqual(undefined);
      });

      it('emptyTableHeight should return default height if allDayPanel data is empty', () => {
        const layout = new AllDayPanelLayout({
          viewData: {
            groupedData: [{
              dateTable: [[]],
              allDayPanel: undefined,
              groupIndex: 1,
            }],
          } as any,
        });

        expect(layout.emptyTableHeight)
          .toEqual(DefaultSizes.allDayPanelHeight);
      });
    });
  });
});

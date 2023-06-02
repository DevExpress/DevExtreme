import React from 'react';
import { shallow } from 'enzyme';
import { AppointmentLayout } from '../../../../../appointment/layout';
import { viewFunction as LayoutView } from '../layout';
import { AllDayTable, AllDayTableProps } from '../table';

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
      dateTable: [{
        cells: [],
        key: 0,
      }],
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
          tableRef: 'tableRef',
        },
      });

      const allDayTable = layout.find(AllDayTable);

      expect(allDayTable.props())
        .toEqual({
          ...new AllDayTableProps(),
          dataCellTemplate,
          width: 321,
          tableRef: 'tableRef',
          viewData,
        });

      expect(layout.hasClass('dx-scheduler-all-day-panel'))
        .toBe(true);
    });

    it('should render all-day appointments', () => {
      const layout = render({});

      expect(layout.find(AppointmentLayout).exists())
        .toBe(true);
      expect(layout.find(AppointmentLayout).props())
        .toEqual({
          isAllDay: true,
        });
    });
  });
});

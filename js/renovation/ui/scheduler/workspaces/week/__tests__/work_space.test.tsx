import React from 'react';
import { shallow } from 'enzyme';
import { formatWeekdayAndDay } from '../../../../../../ui/scheduler/workspaces/utils/base';
import { TimePanelTableLayout } from '../../base/time_panel/layout';
import {
  viewFunction as WorkSpaceLayout,
} from '../work_space';

jest.mock('../../base/work_space', () => ({
  WorkSpaceBase: (props) => <div {...props} />,
}));

describe('WorkSpaceWeek', () => {
  describe('Render', () => {
    const currentDate = new Date();
    const renderComponent = (viewModel) => shallow(WorkSpaceLayout({
      ...viewModel,
      props: {
        currentDate,
        ...viewModel.props,
      },
    }) as any);

    it('should pass correct props to the root component', () => {
      const props = {
        intervalCount: 3,
        groups: [],
        groupByDate: false,
        groupOrientation: 'horizontal',
        crossScrollingEnabled: true,
        startDayHour: 5,
        endDayHour: 7,
        currentDate: new Date(),
        startDate: new Date(),
        firstDayOfWeek: 4,
        hoursInterval: 0.5,
        showAllDayPanel: true,
        allDayPanelExpanded: false,
        allowMultipleCellSelection: false,
        indicatorTime: new Date(),
        indicatorUpdateInterval: 30,
        shadeUntilCurrentTime: true,
        selectedCellData: [],
        scrolling: { mode: 'standard' },
        onViewRendered: () => null,
        showCurrentTimeIndicator: false,
        cellDuration: 30,
      };

      const workSpace = renderComponent({ props });

      expect(workSpace.props())
        .toEqual({
          ...props,
          isWorkWeekView: false,
          type: 'week',
          isAllDayPanelSupported: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          className: 'dx-scheduler-work-space-week',
          timePanelTemplate: TimePanelTableLayout,
          headerCellTextFormat: formatWeekdayAndDay,
        });
    });
  });
});

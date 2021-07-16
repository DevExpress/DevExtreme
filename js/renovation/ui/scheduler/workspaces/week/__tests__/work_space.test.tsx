import { mount } from 'enzyme';
import { formatWeekdayAndDay } from '../../../../../../ui/scheduler/workspaces/utils/base';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { HeaderPanelLayout } from '../../base/header_panel/layout';
import { TimePanelTableLayout } from '../../base/time_panel/layout';
import { WorkSpaceBase } from '../../base/work_space';
import {
  viewFunction as WorkSpaceLayout,
} from '../work_space';

describe('WorkSpaceBase', () => {
  describe('Render', () => {
    const currentDate = new Date();
    const renderComponent = (viewModel) => mount(WorkSpaceLayout({
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
      };

      const workSpace = renderComponent({ props });

      expect(workSpace.is(WorkSpaceBase))
        .toBe(true);

      expect(workSpace.props())
        .toEqual({
          ...props,
          isWorkWeekView: false,
          type: 'week',
          isAllDayPanelSupported: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          className: 'dx-scheduler-work-space-week',
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          headerCellTextFormat: formatWeekdayAndDay,
        });
    });
  });
});

import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { formatWeekdayAndDay } from '../../../../../ui/scheduler/workspaces/utils/base';
import { DateTableLayoutBase } from '../base/date_table/layout';
import { HeaderPanelLayout } from '../base/header_panel/layout';
import { TimePanelTableLayout } from '../base/time_panel/layout';
import { WorkSpaceBase, WorkSpaceBaseProps } from '../base/work_space';

export const viewFunction = ({
  props: {
    intervalCount,
    groups,
    groupByDate,
    groupOrientation,
    crossScrollingEnabled,
    startDayHour,
    endDayHour,
    currentDate,
    startDate,
    firstDayOfWeek,
    hoursInterval,
    showAllDayPanel,
    allDayPanelExpanded,
    allowMultipleCellSelection,
    indicatorTime,
    indicatorUpdateInterval,
    shadeUntilCurrentTime,
    selectedCellData,
    scrolling,
  },
}: WorkSpaceWeek): JSX.Element => (
  <WorkSpaceBase
    intervalCount={intervalCount}
    groups={groups}
    groupByDate={groupByDate}
    groupOrientation={groupOrientation}
    crossScrollingEnabled={crossScrollingEnabled}
    startDayHour={startDayHour}
    endDayHour={endDayHour}
    currentDate={currentDate}
    startDate={startDate}
    firstDayOfWeek={firstDayOfWeek}
    hoursInterval={hoursInterval}
    showAllDayPanel={showAllDayPanel}
    allDayPanelExpanded={allDayPanelExpanded}
    allowMultipleCellSelection={allowMultipleCellSelection}
    indicatorTime={indicatorTime}
    indicatorUpdateInterval={indicatorUpdateInterval}
    shadeUntilCurrentTime={shadeUntilCurrentTime}
    selectedCellData={selectedCellData}
    scrolling={scrolling}
    isWorkWeekView={false}
    type="week"
    isAllDayPanelSupported
    groupPanelClassName="dx-scheduler-work-space-vertical-group-table"
    className="dx-scheduler-work-space-week"
    headerPanelTemplate={HeaderPanelLayout}
    dateTableTemplate={DateTableLayoutBase}
    timePanelTemplate={TimePanelTableLayout}
    headerCellTextFormat={formatWeekdayAndDay}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpaceWeek extends JSXComponent<WorkSpaceBaseProps, 'currentDate'>() {}

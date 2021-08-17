import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { formatWeekdayAndDay } from '../../view_model/to_test/views/utils/base';
import { TimePanelTableLayout } from '../base/time_panel/layout';
import { WorkSpaceBase } from '../base/work_space';
import { WorkSpaceProps } from '../props';

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
    showCurrentTimeIndicator,
    selectedCellData,
    scrolling,
    cellDuration,
    onViewRendered,
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
    showCurrentTimeIndicator={showCurrentTimeIndicator}
    selectedCellData={selectedCellData}
    scrolling={scrolling}
    cellDuration={cellDuration}
    onViewRendered={onViewRendered}
    isWorkWeekView={false}
    type="week"
    isAllDayPanelSupported
    groupPanelClassName="dx-scheduler-work-space-vertical-group-table"
    className="dx-scheduler-work-space-week"
    timePanelTemplate={TimePanelTableLayout}
    headerCellTextFormat={formatWeekdayAndDay}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpaceWeek extends JSXComponent<WorkSpaceProps, 'currentDate' | 'onViewRendered'>() {}

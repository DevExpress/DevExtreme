import { ViewProps } from '../props';
import { WorkSpaceProps } from '../workspaces/props';

export type CurrentViewConfig = Pick<
WorkSpaceProps,
'firstDayOfWeek'
| 'startDayHour'
| 'endDayHour'
| 'cellDuration'
| 'groupByDate'
| 'scrolling'
| 'currentDate'
| 'intervalCount'
| 'groupOrientation'
| 'startDate'
| 'showAllDayPanel'
| 'showCurrentTimeIndicator'
| 'indicatorUpdateInterval'
| 'shadeUntilCurrentTime'
| 'crossScrollingEnabled'
| 'schedulerHeight'
| 'schedulerWidth'
| 'tabIndex'
| 'accessKey'
| 'focusStateEnabled'
| 'indicatorTime'
| 'allowMultipleCellSelection'
| 'allDayPanelExpanded'
| 'hoursInterval'
| 'groups'
| 'selectedCellData'
> & Pick<ViewProps, 'type'>;

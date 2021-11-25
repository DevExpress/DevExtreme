import {
  ComponentBindings,
  Event,
  ForwardRef,
  JSXTemplate,
  OneWay,
  RefObject,
  Slot,
  Template,
} from '@devextreme-generator/declarations';
import {
  DateHeaderData,
  DateTimeCellTemplateProps,
  Group,
  GroupPanelData,
  ResourceCellTemplateProps,
  TimePanelData,
} from '../types';
import { DateTableLayoutProps } from './date_table/layout';
import { HeaderPanelLayoutProps } from './header_panel/layout';
import { LayoutProps } from './layout_props';
import { ScrollableDirection, ScrollEventArgs } from '../../../scroll_view/common/types';

@ComponentBindings()
export class MainLayoutProps extends LayoutProps {
  @Template() headerPanelTemplate!: JSXTemplate<HeaderPanelLayoutProps, 'dateHeaderData'>;

  @Template() dateTableTemplate!: JSXTemplate<DateTableLayoutProps>;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @OneWay() timePanelData: TimePanelData = {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() groupPanelData: GroupPanelData = {
    groupPanelItems: [],
    baseColSpan: 1,
  };

  @OneWay() intervalCount = 1;

  @OneWay() className = '';

  @OneWay() isRenderDateHeader = true;

  @OneWay() groups: Group[] = [];

  @OneWay() groupByDate = false;

  @OneWay() groupPanelClassName:
  'dx-scheduler-work-space-vertical-group-table' | 'dx-scheduler-group-table'
  = 'dx-scheduler-work-space-vertical-group-table';

  @OneWay() isWorkSpaceWithOddCells?: boolean;

  @OneWay() isAllDayPanelCollapsed = true;

  @OneWay() isAllDayPanelVisible = false;

  @OneWay() isRenderHeaderEmptyCell = true;

  @OneWay() isRenderGroupPanel = false;

  @OneWay() isStandaloneAllDayPanel = false;

  @OneWay() isRenderTimePanel = false;

  @OneWay() isUseMonthDateTable = false;

  @OneWay() isUseTimelineHeader = false;

  @OneWay() groupPanelHeight?: number;

  @OneWay() tablesWidth?: number;

  @OneWay() headerEmptyCellWidth?: number;

  @OneWay() scrollingDirection?: ScrollableDirection;

  @Event() onScroll!: (event: ScrollEventArgs) => void;

  @ForwardRef() dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef() allDayPanelRef?: RefObject<HTMLTableElement>;

  @ForwardRef() timePanelRef?: RefObject<HTMLTableElement>;

  @ForwardRef() groupPanelRef?: RefObject<HTMLDivElement>;

  @ForwardRef() widgetElementRef?: RefObject<HTMLDivElement>;

  @Slot() appointments?: JSX.Element;

  @Slot() allDayAppointments?: JSX.Element;
}

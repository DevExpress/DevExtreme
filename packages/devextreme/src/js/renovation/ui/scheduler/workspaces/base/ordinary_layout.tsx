import {
  Component,
  JSXComponent,
  Method,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import { Widget } from '../../../common/widget';
import { Scrollable } from '../../../scroll_view/scrollable';
import { GroupPanel } from './group_panel/group_panel';
import { AllDayPanelLayout } from './date_table/all_day_panel/layout';
import { HeaderPanelEmptyCell } from './header_panel_empty_cell';
import { MainLayoutProps } from './main_layout_props';
import { TimePanelTableLayout } from './time_panel/layout';
import { MonthDateTableLayout } from '../month/date_table/layout';
import { DateTableLayoutBase } from './date_table/layout';
import { TimelineHeaderPanelLayout } from '../timeline/header_panel/layout';
import { HeaderPanelLayout } from './header_panel/layout';
import { AppointmentLayout } from '../../appointment/layout';

export const viewFunction = ({
  dateTableScrollableRef,
  props: {
    isUseTimelineHeader,
    isUseMonthDateTable,
    isRenderTimePanel,

    viewData,
    timePanelData,
    dateHeaderData,
    groupPanelData,
    groupOrientation,
    isRenderDateHeader,
    groups,
    groupByDate,
    groupPanelClassName,
    isRenderHeaderEmptyCell,
    isRenderGroupPanel,
    isStandaloneAllDayPanel,
    groupPanelHeight,
    headerEmptyCellWidth,
    scrollingDirection,
    className,

    dataCellTemplate,
    timeCellTemplate,
    dateCellTemplate,
    resourceCellTemplate,

    dateTableRef,
    allDayPanelRef,
    timePanelRef,
    groupPanelRef,
    widgetElementRef,
  },
}: OrdinaryLayout): JSX.Element => {
  const DateTable = isUseMonthDateTable ? MonthDateTableLayout : DateTableLayoutBase;
  const HeaderPanel = isUseTimelineHeader ? TimelineHeaderPanelLayout : HeaderPanelLayout;

  return (
    <Widget
      className={className}
      rootElementRef={widgetElementRef}
    >
      <div className="dx-scheduler-header-panel-container">
        {isRenderHeaderEmptyCell && (
          <HeaderPanelEmptyCell
            width={headerEmptyCellWidth}
            isRenderAllDayTitle={isStandaloneAllDayPanel}
          />
        )}
        <div className="dx-scheduler-header-tables-container">
          <table className="dx-scheduler-header-panel">
            <HeaderPanel
              dateHeaderData={dateHeaderData}
              groupPanelData={groupPanelData}
              timeCellTemplate={timeCellTemplate}
              dateCellTemplate={dateCellTemplate}
              isRenderDateHeader={isRenderDateHeader}

              groupOrientation={groupOrientation}
              groupByDate={groupByDate}
              groups={groups}
              resourceCellTemplate={resourceCellTemplate}
            />
          </table>
          {isStandaloneAllDayPanel && (
            <AllDayPanelLayout
              viewData={viewData}
              dataCellTemplate={dataCellTemplate}
              tableRef={allDayPanelRef}
            />
          )}
        </div>

      </div>
      <Scrollable
        ref={dateTableScrollableRef}
        useKeyboard={false}
        bounceEnabled={false}
        direction={scrollingDirection}
        className="dx-scheduler-date-table-scrollable"
      >
        <div className="dx-scheduler-date-table-scrollable-content">
          {isRenderGroupPanel && (
            <GroupPanel
              groupPanelData={groupPanelData}
              className={groupPanelClassName}
              groupOrientation={groupOrientation}
              groupByDate={groupByDate}
              groups={groups}
              resourceCellTemplate={resourceCellTemplate}
              height={groupPanelHeight}
              elementRef={groupPanelRef}
            />
          )}
          {isRenderTimePanel && (
            <TimePanelTableLayout
              timePanelData={timePanelData}
              timeCellTemplate={timeCellTemplate}
              groupOrientation={groupOrientation}
              tableRef={timePanelRef}
            />
          )}
          <div className="dx-scheduler-date-table-container">
            <DateTable
              tableRef={dateTableRef}
              viewData={viewData}
              groupOrientation={groupOrientation}
              dataCellTemplate={dataCellTemplate}
            />
            <AppointmentLayout />
          </div>
        </div>
      </Scrollable>
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class OrdinaryLayout extends JSXComponent<
MainLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef' | 'onScroll'
>() {
  @Ref() dateTableScrollableRef!: RefObject<Scrollable>;

  // Bug in generators: https://github.com/DevExpress/devextreme-renovation/issues/791
  @Method()
  getScrollableWidth(): number {
    return this.dateTableScrollableRef.current!.container().getBoundingClientRect().width;
  }
}

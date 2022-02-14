import {
  Component,
  CSSAttributes,
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
import { ScrollSemaphore } from '../../utils/semaphore/scrollSemaphore';
import { ScrollEventArgs } from '../../../scroll_view/common/types';
import { TimePanelTableLayout } from './time_panel/layout';
import { MonthDateTableLayout } from '../month/date_table/layout';
import { DateTableLayoutBase } from './date_table/layout';
import { TimelineHeaderPanelLayout } from '../timeline/header_panel/layout';
import { HeaderPanelLayout } from './header_panel/layout';
import { AppointmentLayout } from '../../appointment/layout';

export const viewFunction = ({
  dateTableScrollableRef,
  headerScrollableRef,
  sideBarScrollableRef,

  onDateTableScroll,
  onHeaderScroll,
  onSideBarScroll,

  headerStyles,

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
    className,
    isRenderGroupPanel,
    isStandaloneAllDayPanel,

    groupPanelHeight,
    headerEmptyCellWidth,
    tablesWidth,

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
}: CrossScrollingLayout): JSX.Element => {
  const DateTable = isUseMonthDateTable ? MonthDateTableLayout : DateTableLayoutBase;
  const HeaderPanel = isUseTimelineHeader ? TimelineHeaderPanelLayout : HeaderPanelLayout;

  return (
    <Widget
      className={className}
      rootElementRef={widgetElementRef}
    >
      <div className="dx-scheduler-fixed-appointments" />
      <div className="dx-scheduler-header-panel-container">
        {isRenderHeaderEmptyCell && (
          <HeaderPanelEmptyCell
            width={headerEmptyCellWidth}
            isRenderAllDayTitle={isStandaloneAllDayPanel}
          />
        )}
        <div className="dx-scheduler-header-tables-container">
          <Scrollable
            ref={headerScrollableRef}
            // https://trello.com/c/NeBr48AZ/3019-angular-props-are-not-spreaded-via-restattributes-classname-for-scrollable
            classes="dx-scheduler-header-scrollable"
            useKeyboard={false}
            showScrollbar="never"
            direction="horizontal"
            useNative={false}
            bounceEnabled={false}
            onScroll={onHeaderScroll}
          >
            <table
              className="dx-scheduler-header-panel"
              style={headerStyles}
            >
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
                width={tablesWidth}
              />
            )}
          </Scrollable>
        </div>
      </div>

      <div className="dx-scheduler-work-space-flex-container">
        <Scrollable
          ref={sideBarScrollableRef}
          // https://trello.com/c/NeBr48AZ/3019-angular-props-are-not-spreaded-via-restattributes-classname-for-scrollable
          classes="dx-scheduler-sidebar-scrollable"
          useKeyboard={false}
          showScrollbar="never"
          direction="vertical"
          useNative={false}
          bounceEnabled={false}
          onScroll={onSideBarScroll}
        >
          <div className="dx-scheduler-side-bar-scrollable-content">
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
          </div>
        </Scrollable>

        <Scrollable
          ref={dateTableScrollableRef}
          useKeyboard={false}
          bounceEnabled={false}
          direction="both"
          // https://trello.com/c/NeBr48AZ/3019-angular-props-are-not-spreaded-via-restattributes-classname-for-scrollable
          classes="dx-scheduler-date-table-scrollable"
          onScroll={onDateTableScroll}
        >
          <div className="dx-scheduler-date-table-scrollable-content">
            <div className="dx-scheduler-date-table-container">
              <DateTable
                tableRef={dateTableRef}
                viewData={viewData}
                groupOrientation={groupOrientation}
                dataCellTemplate={dataCellTemplate}
                width={tablesWidth}
              />
              <AppointmentLayout />
            </div>
          </div>
        </Scrollable>
      </div>
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CrossScrollingLayout extends JSXComponent<
MainLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef' | 'onScroll'
>() {
  @Ref() dateTableScrollableRef!: RefObject<Scrollable>;

  @Ref() headerScrollableRef!: RefObject<Scrollable>;

  @Ref() sideBarScrollableRef!: RefObject<Scrollable>;

  // eslint-disable-next-line class-methods-use-this
  get dateTableSemaphore(): ScrollSemaphore {
    return new ScrollSemaphore();
  }

  // eslint-disable-next-line class-methods-use-this
  get headerSemaphore(): ScrollSemaphore {
    return new ScrollSemaphore();
  }

  // eslint-disable-next-line class-methods-use-this
  get sideBarSemaphore(): ScrollSemaphore {
    return new ScrollSemaphore();
  }

  get headerStyles(): CSSAttributes {
    return { width: this.props.tablesWidth };
  }

  // Bug in generators: https://github.com/DevExpress/devextreme-renovation/issues/791
  @Method()
  getScrollableWidth(): number {
    return this.dateTableScrollableRef.current!.container().getBoundingClientRect().width;
  }

  onDateTableScroll(e: ScrollEventArgs): void {
    this.dateTableSemaphore.take(e.scrollOffset);

    this.sideBarSemaphore.isFree(e.scrollOffset) && this.sideBarScrollableRef.current!.scrollTo({
      top: e.scrollOffset.top,
    });

    this.headerSemaphore.isFree(e.scrollOffset) && this.headerScrollableRef.current!.scrollTo({
      left: e.scrollOffset.left,
    });

    this.props.onScroll(e);

    this.dateTableSemaphore.release();
  }

  onHeaderScroll(e: ScrollEventArgs): void {
    this.headerSemaphore.take(e.scrollOffset);

    this.dateTableSemaphore.isFree(e.scrollOffset)
      && this.dateTableScrollableRef.current!.scrollTo({
        left: e.scrollOffset.left,
      });

    this.headerSemaphore.release();
  }

  onSideBarScroll(e: ScrollEventArgs): void {
    this.sideBarSemaphore.take(e.scrollOffset);

    this.dateTableSemaphore.isFree(e.scrollOffset)
      && this.dateTableScrollableRef.current!.scrollTo({
        top: e.scrollOffset.top,
      });

    this.sideBarSemaphore.release();
  }
}

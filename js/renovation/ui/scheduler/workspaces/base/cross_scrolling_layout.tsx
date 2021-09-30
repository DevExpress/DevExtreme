import {
  Component,
  JSXComponent,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import { Widget } from '../../../common/widget';
import { Scrollable } from '../../../scroll_view/scrollable';
import { GroupPanel } from './group_panel/group_panel';
import { AllDayPanelLayout } from './date_table/all_day_panel/layout';
import { HeaderPanelEmptyCell } from './header_panel_empty_cell';
import { MainLayoutProps } from './main_layout_props';
import { Semaphore } from '../../semaphore';
import { ScrollEventArgs } from '../../../scroll_view/common/types';

export const viewFunction = ({
  dateTableScrollableRef,
  headerScrollableRef,
  sideBarScrollableRef,

  onDateTableScroll,
  onHeaderScroll,
  onSideBarScroll,

  props: {
    headerPanelTemplate: HeaderPanel,
    dateTableTemplate: DateTable,
    timePanelTemplate: TimePanel,

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

    dataCellTemplate,
    timeCellTemplate,
    dateCellTemplate,
    resourceCellTemplate,

    dateTableRef,
    allDayPanelRef,
    timePanelRef,
    groupPanelRef,

    appointments,
    allDayAppointments,
  },
}: CrossScrollingLayout): JSX.Element => (
  <Widget
    className={className}
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
          className="dx-scheduler-header-scrollable"
          useKeyboard={false}
          showScrollbar="never"
          direction="horizontal"
          useNative={false}
          bounceEnabled={false}
          onScroll={onHeaderScroll}
        >
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
              allDayAppointments={allDayAppointments}
            />
          )}
        </Scrollable>
      </div>
    </div>

    <div className="dx-scheduler-work-space-flex-container">
      <Scrollable
        ref={sideBarScrollableRef}
        className="dx-scheduler-sidebar-scrollable"
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
          {!!TimePanel && (
            <TimePanel
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
        className="dx-scheduler-date-table-scrollable"
        onScroll={onDateTableScroll}
      >
        <div className="dx-scheduler-date-table-scrollable-content">
          <div className="dx-scheduler-date-table-container">
            <DateTable
              tableRef={dateTableRef}
              viewData={viewData}
              groupOrientation={groupOrientation}
              dataCellTemplate={dataCellTemplate}
            />
            {appointments}
          </div>
        </div>
      </Scrollable>
    </div>
  </Widget>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class CrossScrollingLayout extends JSXComponent<
MainLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef'
>() {
  @Ref() dateTableScrollableRef!: RefObject<Scrollable>;

  @Ref() headerScrollableRef!: RefObject<Scrollable>;

  @Ref() sideBarScrollableRef!: RefObject<Scrollable>;

  // eslint-disable-next-line class-methods-use-this
  get dateTableSemaphore(): Semaphore {
    return new Semaphore();
  }

  // eslint-disable-next-line class-methods-use-this
  get headerSemaphore(): Semaphore {
    return new Semaphore();
  }

  // eslint-disable-next-line class-methods-use-this
  get sideBarSemaphore(): Semaphore {
    return new Semaphore();
  }

  onDateTableScroll(e: ScrollEventArgs): void {
    this.dateTableSemaphore.take();

    this.sideBarSemaphore.isFree() && this.sideBarScrollableRef.current!.scrollTo({
      top: e.scrollOffset.top,
    });

    this.headerSemaphore.isFree() && this.headerScrollableRef.current!.scrollTo({
      left: e.scrollOffset.left,
    });

    this.dateTableSemaphore.release();
  }

  onHeaderScroll(e: ScrollEventArgs): void {
    this.headerSemaphore.take();

    this.dateTableSemaphore.isFree() && this.dateTableScrollableRef.current!.scrollTo({
      left: e.scrollOffset.left,
    });

    this.headerSemaphore.release();
  }

  onSideBarScroll(e: ScrollEventArgs): void {
    this.sideBarSemaphore.take();

    this.dateTableSemaphore.isFree() && this.dateTableScrollableRef.current!.scrollTo({
      top: e.scrollOffset.top,
    });

    this.sideBarSemaphore.release();
  }
}

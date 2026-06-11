import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { TemplateBase } from '@js/core/templates/template_base';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { setHeight, setOuterHeight } from '@js/core/utils/size';
import type { OptionChanged } from '@ts/core/widget/types';
import { EMPTY_ACTIVE_STATE_UNIT } from '@ts/core/widget/widget';

import type { Rect } from '../appointments/resizing/types';
import {
  DATE_TABLE_CLASS,
  DATE_TABLE_ROW_CLASS,
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  TIME_PANEL_CLASS,
} from '../classes';
import { agendaUtils, formatWeekday, getVerticalGroupCountClass } from '../r1/utils/index';
import tableCreatorModule, { type GroupRows } from '../table_creator';
import type { ResourceId } from '../utils/loader/types';
import { VIEWS } from '../utils/options/constants_view';
import { reduceResourcesTree } from '../utils/resource_manager/agenda_group_utils';
import type { GroupNode } from '../utils/resource_manager/types';
import type { ListEntity } from '../view_model/types';
import WorkSpace, { type WorkspaceOptionsInternal } from './m_work_space';

const { tableCreator } = tableCreatorModule;

const AGENDA_CLASS = 'dx-scheduler-agenda';
const AGENDA_DATE_CLASS = 'dx-scheduler-agenda-date';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';

const TIME_PANEL_ROW_CLASS = 'dx-scheduler-time-panel-row';
const TIME_PANEL_CELL_CLASS = 'dx-scheduler-time-panel-cell';
const NODATA_CONTAINER_CLASS = 'dx-scheduler-agenda-nodata';

const LAST_ROW_CLASS = 'dx-scheduler-date-table-last-row';

const INNER_CELL_MARGIN = 5;
const OUTER_CELL_MARGIN = 20;

interface AgendaRenderOptions {
  container: Element;
  rowCount?: number;
  cellCount?: number;
  rowClass?: string;
  cellClass?: string;
  cellTemplate?: TemplateBase | null;
  getStartDate?: (rowIndex: number) => Date;
}

class SchedulerAgenda extends WorkSpace {
  private startViewDate!: Date;

  private rows: number[][] = [];

  private $rows: dxElementWrapper[] = [];

  private $noDataContainer?: dxElementWrapper;

  protected _activeStateUnit(): string {
    return EMPTY_ACTIVE_STATE_UNIT;
  }

  get type(): string { return VIEWS.AGENDA; }

  getStartViewDate(): Date {
    return this.startViewDate;
  }

  _init(): void {
    super._init();
  }

  _getDefaultOptions(): WorkspaceOptionsInternal {
    return extend(super._getDefaultOptions(), {
      agendaDuration: 7,
      rowHeight: 60,
      noDataText: '',
    }) as WorkspaceOptionsInternal;
  }

  _optionChanged(args: OptionChanged<WorkspaceOptionsInternal>): void {
    const { name } = args;
    const { value } = args;

    switch (name) {
      case 'agendaDuration':
        break;
      case 'noDataText':
      case 'rowHeight':
        this.recalculateAgenda(this.rows);
        break;
      case 'groups':
        if (!Array.isArray(value) || !value.length) {
          if (this.$groupTable) {
            this.$groupTable.remove();
            this.$groupTable = null;
            this.detachGroupCountClass();
          }
        } else if (!this.$groupTable) {
          this.initGroupTable();
          if (this.$groupTable) {
            this.$dateTableScrollable.$content().prepend(this.$groupTable);
          }
        }
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _renderFocusState(): void { return noop(); }

  _renderFocusTarget(): void { return noop(); }

  _cleanFocusState(): void { return noop(); }

  supportAllDayRow(): boolean {
    return false;
  }

  protected override isVerticalGroupedWorkSpace(): boolean {
    return false;
  }

  protected override getElementClass(): string {
    return AGENDA_CLASS;
  }

  protected override getRowCount(): number {
    return this.option('agendaDuration');
  }

  getCellCount(): number {
    return 1;
  }

  protected override getTimePanelRowCount(): number {
    return this.option('agendaDuration');
  }

  protected renderAllDayPanel(): void { return noop(); }

  protected override updateAllDayVisibility(): void { return noop(); }

  protected override initWorkSpaceUnits(): void {
    this.initGroupTable();
    this.$timePanel = $('<table>').attr('aria-hidden', true).addClass(TIME_PANEL_CLASS);
    this.$dateTable = $('<table>').attr('aria-hidden', true).addClass(DATE_TABLE_CLASS);
    this.$dateTableScrollableContent = $('<div>').addClass('dx-scheduler-date-table-scrollable-content');
    this.$dateTableContainer = $('<div>').addClass('dx-scheduler-date-table-container');
  }

  private initGroupTable(): void {
    const groups = this.option('groups');
    if (groups?.length) {
      this.$groupTable = $('<table>').attr('aria-hidden', true).addClass(GROUP_TABLE_CLASS);
    }
  }

  protected override renderView(): void {
    this.startViewDate = agendaUtils.calculateStartViewDate(
      this.option('currentDate'),
      this.option('startDayHour'),
    );
    this.rows = [];
  }

  private recalculateAgenda(rows: number[][]): void {
    let cellTemplates: (() => dxElementWrapper)[] = [];
    this.cleanView();

    if (this.rowsIsEmpty(rows)) {
      this.renderNoData();
      return;
    }
    this.rows = rows;

    if (this.$groupTable) {
      cellTemplates = this.renderGroupHeader();
      this.setGroupHeaderCellsHeight();
    }

    this.renderTimePanel();
    this.renderDateTable();
    this.applyCellTemplates(cellTemplates);
    this.$dateTableScrollable.update();
  }

  private renderNoData(): void {
    this.$noDataContainer = $('<div>').addClass(NODATA_CONTAINER_CLASS)
      .html(this.option('noDataText'));

    this.$dateTableScrollable.$content().append(this.$noDataContainer);
  }

  protected override setTableSizes(): void { return noop(); }

  protected override toggleHorizontalScrollClass(): void { return noop(); }

  protected override needCreateCrossScrolling(): boolean {
    return false;
  }

  private setGroupHeaderCellsHeight(): void {
    const $cells = this.getGroupHeaderCells().filter((_, element) => !element.getAttribute('rowSpan'));
    const rows = this.removeEmptyRows(this.rows);

    if (!rows.length) {
      return;
    }

    for (let i = 0; i < $cells.length; i += 1) {
      const $cellContent = $cells.eq(i).find('.dx-scheduler-group-header-content');
      setOuterHeight($cellContent, this.getGroupRowHeight(rows[i]));
    }
  }

  private rowsIsEmpty(rows: number[][]): boolean {
    return rows.every((groupRow) => groupRow.every((cell) => !cell));
  }

  protected override attachGroupCountClass(): void {
    const className = getVerticalGroupCountClass(this.option('groups'));
    if (className) {
      this.$element().addClass(className);
    }
  }

  private removeEmptyRows(rows: number[][]): number[][] {
    const isEmpty = (data: number[]): boolean => !data.some((value) => value > 0);
    return rows.filter((row) => row.length && !isEmpty(row));
  }

  protected override getGroupHeaderContainer(): dxElementWrapper | null | undefined {
    return this.$groupTable;
  }

  protected override makeGroupRows(): GroupRows {
    const resourceManager = this.option('getResourceManager')();
    const allAppointments = (this.option('getFilteredItems') as () => ListEntity[])();
    const tree = reduceResourcesTree(
      resourceManager.resourceById,
      resourceManager.groupsTree,
      allAppointments,
    );

    const cellTemplate = this.option('resourceCellTemplate');
    const getGroupHeaderContentClass = GROUP_HEADER_CONTENT_CLASS;
    const cellTemplates: (() => dxElementWrapper)[] = [];

    const table = tableCreator.makeGroupedTableFromJSON(tree, {
      cellTag: 'th',
      groupTableClass: GROUP_TABLE_CLASS,
      groupRowClass: GROUP_ROW_CLASS,
      groupCellClass: this.getGroupHeaderClass(),
      groupCellCustomContent(
        cell: HTMLElement,
        cellTextElement: Text,
        index: number,
        node: GroupNode,
      ) {
        const container = domAdapter.createElement('div');
        container.className = getGroupHeaderContentClass;
        const value = node.grouped[node.resourceIndex];
        const resource = resourceManager.resourceById[node.resourceIndex];
        const resourceData = resource?.data
          .find((rItem) => resource.dataAccessor.get('id', rItem) === value);
        const resourceItem = resource?.items
          .find((rItem) => rItem.id === value);

        if (cellTemplate?.render) {
          cellTemplates.push(cellTemplate.render.bind(cellTemplate, {
            model: {
              data: resourceData,
              id: value,
              color: resourceItem?.color,
              text: cellTextElement.textContent,
            },
            container: getPublicElement($(container)),
            index,
          }));
        } else {
          const contentWrapper = domAdapter.createElement('div');
          contentWrapper.appendChild(cellTextElement);
          container.appendChild(contentWrapper);
        }

        cell.appendChild(container);
      },
    });

    return {
      elements: $(table).find(`.${GROUP_ROW_CLASS}`),
      cellTemplates,
    };
  }

  protected override cleanView(): void {
    this.$dateTable.empty();
    this.$timePanel.empty();

    if (this.$groupTable) {
      this.$groupTable.empty();
    }

    if (this.$noDataContainer) {
      this.$noDataContainer.empty();
      this.$noDataContainer.remove();

      delete this.$noDataContainer;
    }
  }

  protected override createWorkSpaceElements(): void {
    this.createWorkSpaceStaticElements();
  }

  protected override createWorkSpaceStaticElements(): void {
    this.$dateTableContainer.append(this.$dateTable);
    this.$dateTableScrollable.$content().append(this.$dateTableScrollableContent);

    if (this.$groupTable) {
      this.$dateTableScrollableContent.prepend(this.$groupTable);
    }

    this.$dateTableScrollableContent.append(this.$timePanel, this.$dateTableContainer);
    this.$element().append(this.$dateTableScrollable.$element());
  }

  protected renderDateTable(): void {
    this.renderTableBody({
      container: getPublicElement(this.$dateTable),
      rowClass: DATE_TABLE_ROW_CLASS,
      cellClass: this.getDateTableCellClass(),
    });
  }

  protected override attachTablesEvents(): void { return noop(); }

  protected override attachEvents(): void { return noop(); }

  isIndicationAvailable(): boolean {
    return false;
  }

  private prepareCellTemplateOptions(
    text: string,
    date: Date | undefined,
    rowIndex: number,
    $cell: dxElementWrapper,
  ): {
    model: {
      text: string;
      date: Date | undefined;
      groups: Record<string, ResourceId>;
      groupIndex: number | undefined;
    };
    container: Element;
    index: number;
  } {
    const leaf = this.resourceManager.groupsLeafs[rowIndex];
    const groups = leaf?.grouped ?? {};
    const groupIndex = leaf?.groupIndex;

    return {
      model: {
        text,
        date,
        groups,
        groupIndex,
      },
      container: getPublicElement($cell),
      index: rowIndex,
    };
  }

  protected renderTableBody(
    options: AgendaRenderOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delayCellTemplateRendering?: boolean,
  ): void {
    const cellTemplates: (() => dxElementWrapper)[] = [];
    const cellTemplateOpt = options.cellTemplate;

    this.$rows = [];
    let i = 0;

    const fillTableBody = (rowIndex: number, rowSize: number): void => {
      if (rowSize) {
        const date = options.getStartDate?.(rowIndex);
        let cellDateNumber = '';
        let cellDayName = '';
        const $row = $('<tr>');
        const $td = $('<td>');
        setHeight($td, this.getRowHeight(rowSize));

        if (date) {
          cellDateNumber = String(dateLocalization.format(date, 'd'));
          cellDayName = String(dateLocalization.format(date, formatWeekday));
        }

        if (cellTemplateOpt?.render) {
          const templateOptions = this.prepareCellTemplateOptions(
            `${cellDateNumber} ${cellDayName}`,
            date,
            i,
            $td,
          );

          cellTemplates.push(cellTemplateOpt.render.bind(cellTemplateOpt, templateOptions));
        } else if (cellDateNumber && cellDayName) {
          $td.addClass(AGENDA_DATE_CLASS).text(`${cellDateNumber} ${cellDayName}`);
        }

        if (options.rowClass) {
          $row.addClass(options.rowClass);
        }

        if (options.cellClass) {
          $td.addClass(options.cellClass);
        }

        $row.append($td);
        this.$rows.push($row);
      }
    };

    for (i = 0; i < this.rows.length; i += 1) {
      each(this.rows[i], fillTableBody);
      this.setLastRowClass();
    }

    $(options.container).append($('<tbody>').append(this.$rows));
    this.applyCellTemplates(cellTemplates);
  }

  private setLastRowClass(): void {
    if (this.rows.length > 1 && this.$rows.length) {
      const $lastRow = this.$rows[this.$rows.length - 1];

      $lastRow.addClass(LAST_ROW_CLASS);
    }
  }

  protected renderTimePanel(): void {
    this.renderTableBody({
      container: getPublicElement(this.$timePanel),
      rowCount: this.getTimePanelRowCount(),
      cellCount: 1,
      rowClass: TIME_PANEL_ROW_CLASS,
      cellClass: TIME_PANEL_CELL_CLASS,
      cellTemplate: this.option('dateCellTemplate'),
      getStartDate: this.getTimePanelStartDate.bind(this),
    });
  }

  private getTimePanelStartDate(rowIndex: number): Date {
    return agendaUtils.getDateByIndex(
      this.getStartViewDate(),
      rowIndex,
    );
  }

  private getRowHeight(rowSize: number): number {
    const baseHeight = this.option('rowHeight');
    const innerOffset = (rowSize - 1) * INNER_CELL_MARGIN;

    return rowSize ? (baseHeight * rowSize) + innerOffset + OUTER_CELL_MARGIN : 0;
  }

  private getGroupRowHeight(groupRows: number[] | undefined): number {
    if (!groupRows) {
      return 0;
    }

    return groupRows.reduce((result, groupRow) => result + this.getRowHeight(groupRow), 0);
  }

  renderAgendaLayout(appointments: ListEntity[]): void {
    this.renderView();

    const rows = agendaUtils.calculateRows(
      appointments,
      this.option('agendaDuration'),
      this.getStartViewDate(),
      this.resourceManager.groupCount(),
    );
    this.recalculateAgenda(rows);
  }

  getAgendaVerticalStepHeight(): number {
    return this.option('rowHeight');
  }

  getEndViewDate(): Date {
    return agendaUtils.calculateEndViewDate(
      this.getStartViewDate(),
      this.option('endDayHour'),
      this.option('agendaDuration'),
    );
  }

  getEndViewDateByEndDayHour(): Date {
    return this.getEndViewDate();
  }

  updateScrollPosition(date: Date): void {
    const newDate = this.timeZoneCalculator.createDate(date, 'toGrid');

    if (this.needUpdateScrollPosition(newDate)) {
      this.scrollTo(newDate);
    }
  }

  override needUpdateScrollPosition(date: Date): boolean {
    const bounds = this.getVisibleBounds();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let isUpdateNeeded = false;

    if (hours < bounds.top.hours || hours > bounds.bottom.hours) {
      isUpdateNeeded = true;
    }

    if (hours === bounds.top.hours && minutes < bounds.top.minutes) {
      isUpdateNeeded = true;
    }

    if (hours === bounds.bottom.hours && minutes > bounds.bottom.minutes) {
      isUpdateNeeded = true;
    }

    return isUpdateNeeded;
  }

  renovatedRenderSupported(): boolean { return false; }

  override isVirtualScrolling(): boolean { return false; }

  protected override getTotalViewDuration(): number {
    return dateUtils.dateToMilliseconds('day') * this.option('intervalCount');
  }

  getDOMElementsMetaData(): {
    dateTableCellsMeta: Rect[][];
    allDayPanelCellsMeta: Rect[];
  } {
    return {
      dateTableCellsMeta: [[{
        top: 0, left: 0, width: 0, height: 0,
      }]],
      allDayPanelCellsMeta: [{
        top: 0, left: 0, width: 0, height: 0,
      }],
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerAgenda', SchedulerAgenda as any);

export default SchedulerAgenda;

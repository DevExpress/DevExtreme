import dateLocalization from '@js/common/core/localization/date';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { setHeight, setOuterHeight } from '@js/core/utils/size';
import { EMPTY_ACTIVE_STATE_UNIT } from '@ts/core/widget/widget';

import {
  DATE_TABLE_CLASS,
  DATE_TABLE_ROW_CLASS,
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  TIME_PANEL_CLASS,
} from '../m_classes';
import tableCreatorModule from '../m_table_creator';
import { agendaUtils, formatWeekday, getVerticalGroupCountClass } from '../r1/utils/index';
import { VIEWS } from '../utils/options/constants_view';
import { reduceResourcesTree } from '../utils/resource_manager/agenda_group_utils';
import type { GroupNode } from '../utils/resource_manager/types';
import type { ListEntity } from '../view_model/types';
import WorkSpace from './m_work_space';

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

class SchedulerAgenda extends WorkSpace {
  private startViewDate: any;

  private rows: number[][] = [];

  private $rows: any;

  private $noDataContainer: any;

  // eslint-disable-next-line class-methods-use-this
  protected _activeStateUnit(): string {
    return EMPTY_ACTIVE_STATE_UNIT;
  }

  get type() { return VIEWS.AGENDA; }

  getStartViewDate() {
    return this.startViewDate;
  }

  _init() {
    super._init();
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      // Number | "month"
      agendaDuration: 7,
      rowHeight: 60,
      noDataText: '',
    });
  }

  _optionChanged(args) {
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
        if (!value?.length) {
          if (this.$groupTable) {
            this.$groupTable.remove();
            this.$groupTable = null;
            this.detachGroupCountClass();
          }
        } else if (!this.$groupTable) {
          this.initGroupTable();
          this.$dateTableScrollable.$content().prepend(this.$groupTable);
        }
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _renderFocusState() { return noop(); }

  _renderFocusTarget() { return noop(); }

  _cleanFocusState() { return noop(); }

  supportAllDayRow() {
    return false;
  }

  protected override isVerticalGroupedWorkSpace() {
    return false;
  }

  protected override getElementClass() {
    return AGENDA_CLASS;
  }

  protected override getRowCount() {
    return this.option('agendaDuration') as number;
  }

  getCellCount() {
    return 1;
  }

  protected override getTimePanelRowCount() {
    return this.option('agendaDuration') as number;
  }

  protected renderAllDayPanel() { return noop(); }

  protected override updateAllDayVisibility() { return noop(); }

  protected override initWorkSpaceUnits() {
    this.initGroupTable();
    this.$timePanel = $('<table>').attr('aria-hidden', true).addClass(TIME_PANEL_CLASS);
    this.$dateTable = $('<table>').attr('aria-hidden', true).addClass(DATE_TABLE_CLASS);
    this.$dateTableScrollableContent = $('<div>').addClass('dx-scheduler-date-table-scrollable-content');
    this.$dateTableContainer = $('<div>').addClass('dx-scheduler-date-table-container');
  }

  private initGroupTable() {
    const groups = this.option('groups');
    if (groups?.length) {
      this.$groupTable = $('<table>').attr('aria-hidden', true).addClass(GROUP_TABLE_CLASS);
    }
  }

  protected override renderView() {
    this.startViewDate = agendaUtils.calculateStartViewDate(
      this.option('currentDate'),
      this.option('startDayHour'),
    );
    this.rows = [];
  }

  private recalculateAgenda(rows) {
    let cellTemplates = [];
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

  private renderNoData() {
    this.$noDataContainer = $('<div>').addClass(NODATA_CONTAINER_CLASS)
      .html(this.option('noDataText') as any);

    this.$dateTableScrollable.$content().append(this.$noDataContainer);
  }

  protected override setTableSizes() { return noop(); }

  protected override toggleHorizontalScrollClass() { return noop(); }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override createCrossScrollingConfig(argument?: any) { return noop(); }

  private setGroupHeaderCellsHeight() {
    const $cells = this.getGroupHeaderCells().filter((_, element) => !element.getAttribute('rowSpan'));
    const rows = this.removeEmptyRows(this.rows);

    if (!rows.length) {
      return;
    }

    for (let i = 0; i < $cells.length; i++) {
      const $cellContent = $cells.eq(i).find('.dx-scheduler-group-header-content');
      setOuterHeight($cellContent, this.getGroupRowHeight(rows[i]));
    }
  }

  private rowsIsEmpty(rows) {
    let result = true;

    for (let i = 0; i < rows.length; i++) {
      const groupRow = rows[i];

      for (let j = 0; j < groupRow.length; j++) {
        if (groupRow[j]) {
          result = false;
          break;
        }
      }
    }

    return result;
  }

  protected override attachGroupCountClass() {
    const className = getVerticalGroupCountClass(this.option('groups'));
    (this.$element() as any).addClass(className);
  }

  private removeEmptyRows(rows) {
    const result: any[] = [];
    const isEmpty = function (data) {
      return !data.some((value) => value > 0);
    };

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length && !isEmpty(rows[i])) {
        result.push(rows[i]);
      }
    }

    return result;
  }

  protected override getGroupHeaderContainer() {
    return this.$groupTable;
  }

  protected override makeGroupRows() {
    const resourceManager = this.option('getResourceManager')();
    const allAppointments = (this.option('getFilteredItems') as any)() as ListEntity[];
    const tree = reduceResourcesTree(
      resourceManager.resourceById,
      resourceManager.groupsTree,
      allAppointments,
    );

    const cellTemplate: any = this.option('resourceCellTemplate');
    const getGroupHeaderContentClass = GROUP_HEADER_CONTENT_CLASS;
    const cellTemplates: any[] = [];

    const table = tableCreator.makeGroupedTableFromJSON(tree, {
      cellTag: 'th',
      groupTableClass: GROUP_TABLE_CLASS,
      groupRowClass: GROUP_ROW_CLASS,
      groupCellClass: this.getGroupHeaderClass(),
      groupCellCustomContent(cell: HTMLDivElement, cellTextElement: HTMLElement, index: number, node: GroupNode) {
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
      cellTemplate,
    });

    return {
      elements: $(table).find(`.${GROUP_ROW_CLASS}`),
      cellTemplates,
    };
  }

  protected override cleanView() {
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

  protected override createWorkSpaceElements() {
    this.createWorkSpaceStaticElements();
  }

  protected override createWorkSpaceStaticElements() {
    this.$dateTableContainer.append(this.$dateTable);
    this.$dateTableScrollable.$content().append(this.$dateTableScrollableContent);

    if (this.$groupTable) {
      this.$dateTableScrollableContent.prepend(this.$groupTable);
    }

    this.$dateTableScrollableContent.append(this.$timePanel, this.$dateTableContainer);
    this.$element().append(this.$dateTableScrollable.$element());
  }

  protected renderDateTable() {
    this.renderTableBody({
      container: getPublicElement(this.$dateTable),
      rowClass: DATE_TABLE_ROW_CLASS,
      cellClass: this.getDateTableCellClass(),
    });
  }

  protected override attachTablesEvents() { return noop(); }

  protected override attachEvents() { return noop(); }

  isIndicationAvailable() {
    return false;
  }

  private prepareCellTemplateOptions(text, date, rowIndex, $cell) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected renderTableBody(options: any, delayCellTemplateRendering?: any) {
    const cellTemplates: any[] = [];
    const cellTemplateOpt = options.cellTemplate;

    this.$rows = [];
    let i;

    const fillTableBody = function (rowIndex, rowSize) {
      if (rowSize) {
        let date;
        let cellDateNumber;
        let cellDayName;
        const $row = $('<tr>');
        const $td = $('<td>');
        setHeight($td, this.getRowHeight(rowSize));

        if (options.getStartDate) {
          date = options.getStartDate?.(rowIndex);
          cellDateNumber = dateLocalization.format(date, 'd');
          cellDayName = dateLocalization.format(date, formatWeekday);
        }

        if (cellTemplateOpt?.render) {
          const templateOptions = this.prepareCellTemplateOptions(`${cellDateNumber} ${cellDayName}`, date, i, $td);

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
    }.bind(this);

    for (i = 0; i < this.rows.length; i++) {
      each(this.rows[i], fillTableBody);
      this.setLastRowClass();
    }

    $(options.container).append($('<tbody>').append(this.$rows));
    this.applyCellTemplates(cellTemplates);
  }

  private setLastRowClass() {
    if (this.rows.length > 1 && this.$rows.length) {
      const $lastRow = this.$rows[this.$rows.length - 1];

      $lastRow.addClass(LAST_ROW_CLASS);
    }
  }

  protected renderTimePanel() {
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

  private getTimePanelStartDate(rowIndex) {
    return agendaUtils.getDateByIndex(
      this.getStartViewDate(),
      rowIndex,
    );
  }

  private getRowHeight(rowSize) {
    const baseHeight = this.option('rowHeight') as any;
    const innerOffset = (rowSize - 1) * INNER_CELL_MARGIN;

    return rowSize ? (baseHeight * rowSize) + innerOffset + OUTER_CELL_MARGIN : 0;
  }

  private getGroupRowHeight(groupRows) {
    if (!groupRows) {
      return;
    }

    let result = 0;

    for (let i = 0; i < groupRows.length; i++) {
      result += this.getRowHeight(groupRows[i]);
    }

    return result;
  }

  renderAgendaLayout(appointments: ListEntity[]): void {
    this.renderView();

    const rows = agendaUtils.calculateRows(
      appointments,
      this.option('agendaDuration') as number,
      this.getStartViewDate(),
      this.resourceManager.groupCount(),
    );
    this.recalculateAgenda(rows);
  }

  getAgendaVerticalStepHeight() {
    return this.option('rowHeight');
  }

  getEndViewDate() {
    return agendaUtils.calculateEndViewDate(
      this.getStartViewDate(),
      this.option('endDayHour') as any,
      this.option('agendaDuration') as any,
    );
  }

  getEndViewDateByEndDayHour() {
    return this.getEndViewDate();
  }

  updateScrollPosition(date) {
    const newDate = this.timeZoneCalculator.createDate(date, 'toGrid');

    const bounds = this.getVisibleBounds();
    const startDateHour = newDate.getHours();
    const startDateMinutes = newDate.getMinutes();

    if (this.needUpdateScrollPosition(startDateHour, startDateMinutes, bounds, newDate)) {
      this.scrollTo(newDate);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  needUpdateScrollPosition(hours, minutes, bounds, newData?: any) {
    let isUpdateNeeded = false;

    if (hours < bounds.top.hours || hours > bounds.bottom.hours) {
      isUpdateNeeded = true;
    }

    if (hours === bounds.top.hours && minutes < bounds.top.minutes) {
      isUpdateNeeded = true;
    }

    if (hours === bounds.bottom.hours && minutes > bounds.top.minutes) {
      isUpdateNeeded = true;
    }

    return isUpdateNeeded;
  }

  renovatedRenderSupported() { return false; }

  override isVirtualScrolling() { return false; }

  protected override getTotalViewDuration() {
    return dateUtils.dateToMilliseconds('day') * (this.option('intervalCount') as any);
  }

  getDOMElementsMetaData() {
    return {
      dateTableCellsMeta: [[{}]],
      allDayPanelCellsMeta: [{}],
    };
  }
}

registerComponent('dxSchedulerAgenda', SchedulerAgenda as any);

export default SchedulerAgenda;

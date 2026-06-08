import type { Orientation } from '@js/common';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { TemplateBase } from '@js/core/templates/template_base';
import { isFunction } from '@js/core/utils/type';

import type { ResourceLoader } from './utils/loader/resource_loader';
import type { GroupNode } from './utils/resource_manager/types';

const ROW_SELECTOR = 'tr';

type TemplateCallback = () => dxElementWrapper;

interface CellData {
  startDate?: Date;
  endDate?: Date;
  groups?: Record<string, unknown>;
  allDay?: boolean;
}

export interface MakeTableOptions {
  container: HTMLElement | dxElementWrapper;
  rowCount: number;
  cellCount: number;
  groupCount?: number;
  groupIndex?: number;
  rowClass?: string;
  cellClass?: string | ((rowIndex: number, columnIndex: number) => string);
  getCellTextClass?: string;
  allDayElements?: dxElementWrapper[];
  getCellData?: (
    cell: HTMLElement,
    rowIndex: number,
    columnIndex: number,
    groupIndex: number | undefined,
  ) => { key: string; value: CellData | undefined };
  setAdditionalClasses?: (
    $cell: dxElementWrapper,
    dataValue: CellData | undefined,
  ) => void;
  cellTemplate?: TemplateBase | null;
  getCellText?: (rowIndex: number, columnIndex: number) => string;
  getCellDate?: (rowIndex: number) => Date | undefined;
  getTemplateData?: (rowIndex: number) => Record<string, unknown>;
}

export interface GroupCssClasses {
  groupHeaderRowClass?: string;
  groupRowClass?: string;
  groupHeaderClass: string | ((index: number) => string);
  groupHeaderContentClass?: string;
}

export interface GroupRows {
  elements: dxElementWrapper | dxElementWrapper[];
  cellTemplates: TemplateCallback[];
}

interface GroupedTableConfig {
  cellTag?: string;
  groupTableClass?: string;
  groupRowClass?: string;
  groupCellClass?: string;
  groupCellCustomContent?: (
    cell: HTMLElement,
    cellText: Text,
    index: number,
    node: GroupNode,
  ) => void;
}

interface TableCell {
  element: HTMLElement;
  childCount: number;
}

type TableRow = TableCell[];

interface GroupCell {
  element: dxElementWrapper;
  template?: TemplateCallback;
}

type GroupCellRow = GroupCell[];

class SchedulerTableCreator {
  readonly VERTICAL = 'vertical';

  readonly HORIZONTAL = 'horizontal';

  insertAllDayRow(
    allDayElements: dxElementWrapper[],
    tableBody: HTMLElement,
    index: number,
  ): void {
    if (allDayElements[index]) {
      let row = allDayElements[index].find(ROW_SELECTOR);

      if (!row.length) {
        row = $(domAdapter.createElement(ROW_SELECTOR));
        row.append(allDayElements[index].get(0));
      }

      tableBody.appendChild(row.get(0) as HTMLElement);
    }
  }

  makeTable(options: MakeTableOptions): TemplateCallback[] {
    const tableBody = domAdapter.createElement('tbody');
    const templateCallbacks: TemplateCallback[] = [];
    const rowCountInGroup = options.groupCount
      ? options.rowCount / options.groupCount
      : options.rowCount;
    let allDayElementIndex = 0;
    const { allDayElements } = options;
    const { groupIndex } = options;
    const { rowCount } = options;

    $(options.container).append(tableBody);

    if (allDayElements) {
      this.insertAllDayRow(allDayElements, tableBody, 0);
      allDayElementIndex += 1;
    }

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row = domAdapter.createElement(ROW_SELECTOR);
      tableBody.appendChild(row);

      const isLastRowInGroup = (rowIndex + 1) % rowCountInGroup === 0;

      if (options.rowClass) {
        row.className = options.rowClass;
      }

      for (let columnIndex = 0; columnIndex < options.cellCount; columnIndex += 1) {
        const td = domAdapter.createElement('td');
        row.appendChild(td);

        if (options.cellClass) {
          td.className = isFunction(options.cellClass)
            ? options.cellClass(rowIndex, columnIndex)
            : options.cellClass;
        }

        const cellDataObject = options.getCellData?.(td, rowIndex, columnIndex, groupIndex);
        const dataValue = cellDataObject?.value;

        if (cellDataObject?.key) {
          elementData(td, cellDataObject.key, dataValue);
        }

        options.setAdditionalClasses?.($(td), dataValue);

        if (options.cellTemplate?.render) {
          const additionalTemplateData = options.getTemplateData
            ? options.getTemplateData(rowIndex)
            : {};

          const model: Record<string, unknown> = {
            text: options.getCellText
              ? options.getCellText(rowIndex, columnIndex)
              : '',
            date: options.getCellDate
              ? options.getCellDate(rowIndex)
              : undefined,
            ...additionalTemplateData,
          };

          /* eslint-disable max-depth */
          if (dataValue) {
            if (dataValue.startDate) { model.startDate = dataValue.startDate; }
            if (dataValue.endDate) { model.endDate = dataValue.endDate; }
            if (dataValue.groups) { model.groups = dataValue.groups; }
            if (dataValue.allDay) { model.allDay = dataValue.allDay; }
          }
          /* eslint-enable max-depth */

          templateCallbacks.push(options.cellTemplate.render.bind(
            options.cellTemplate,
            {
              model,
              container: getPublicElement($(td)),
              index: rowIndex * options.cellCount + columnIndex,
            },
          ));
        } else if (options.getCellText) {
          $('<div>')
            .text(options.getCellText(rowIndex, columnIndex))
            .addClass(options.getCellTextClass ?? '')
            .appendTo($(td));
        }
      }

      if (allDayElements && isLastRowInGroup) {
        this.insertAllDayRow(allDayElements, tableBody, allDayElementIndex);
        allDayElementIndex += 1;
      }
    }

    return templateCallbacks;
  }

  makeGroupedTable(
    type: Orientation,
    groups: ResourceLoader[],
    cssClasses: GroupCssClasses,
    cellCount: number,
    cellTemplate: TemplateBase | null | undefined,
    rowCount: number,
    groupByDate: boolean,
  ): GroupRows {
    if (type === this.VERTICAL) {
      return this.makeVerticalGroupedRows(groups, cssClasses, cellTemplate, rowCount);
    }

    return this.makeHorizontalGroupedRows(groups, cssClasses, cellCount, cellTemplate, groupByDate);
  }

  makeGroupedTableFromJSON(
    tree: GroupNode[],
    tableConfig?: GroupedTableConfig,
  ): HTMLElement {
    const config = tableConfig || {};
    const cellTag = config.cellTag || 'td';
    const { groupTableClass } = config;
    const { groupRowClass } = config;
    const { groupCellClass } = config;
    const { groupCellCustomContent } = config;

    const cellStorage: TableRow[] = [];
    let rowIndex = 0;

    const table = domAdapter.createElement('table');
    if (groupTableClass) {
      table.className = groupTableClass;
    }

    const getChildCount = (item: GroupNode): number => {
      if (item.children) {
        return item.children.length;
      }
      return 0;
    };

    const createCell = (
      text: string,
      childCount: number,
      index: number,
      node: GroupNode,
    ): TableCell => {
      const cell: TableCell = {
        element: domAdapter.createElement(cellTag),
        childCount,
      };

      if (groupCellClass) {
        cell.element.className = groupCellClass;
      }

      const cellText = domAdapter.createTextNode(text) as Text;
      if (typeof groupCellCustomContent === 'function') {
        groupCellCustomContent(cell.element, cellText, index, node);
      } else {
        cell.element.appendChild(cellText);
      }

      return cell;
    };

    const generateCells = (groupNodes: GroupNode[]): void => {
      for (let i = 0; i < groupNodes.length; i += 1) {
        const childCount = getChildCount(groupNodes[i]);
        const cell = createCell(
          groupNodes[i].resourceText,
          childCount,
          i,
          groupNodes[i],
        );

        if (!cellStorage[rowIndex]) {
          cellStorage[rowIndex] = [];
        }
        cellStorage[rowIndex].push(cell);

        if (childCount) {
          generateCells(groupNodes[i].children);
        } else {
          rowIndex += 1;
        }
      }
    };

    const putCellsToRows = (): void => {
      cellStorage.forEach((cells) => {
        const row = domAdapter.createElement(ROW_SELECTOR);
        if (groupRowClass) {
          row.className = groupRowClass;
        }

        const rowspans: number[] = [];

        for (let i = cells.length - 1; i >= 0; i -= 1) {
          const prev = cells[i + 1];
          let rowspan = cells[i].childCount;
          if (prev && prev.childCount) {
            rowspan *= prev.childCount;
          }
          rowspans.push(rowspan);
        }
        rowspans.reverse();

        cells.forEach((cell, index) => {
          if (rowspans[index]) {
            cell.element.setAttribute('rowSpan', String(rowspans[index]));
          }
          row.appendChild(cell.element);
        });

        table.appendChild(row);
      });
    };

    generateCells(tree);
    putCellsToRows();

    return table;
  }

  private makeFlexGroupedRowCells(
    group: ResourceLoader,
    repeatCount: number,
    cssClasses: GroupCssClasses,
    cellTemplate: TemplateBase | null | undefined,
    repeatByDate = 1,
  ): GroupCell[] {
    const cells: GroupCell[] = [];
    const { items } = group;
    const itemCount = items.length;

    for (let i = 0; i < repeatCount * repeatByDate; i += 1) {
      for (let j = 0; j < itemCount; j += 1) {
        let $container = $('<div>');
        let boundTemplate: TemplateCallback | null = null;

        if (cellTemplate?.render) {
          const model = group.data
            ? Object.assign(items[j], { data: group.data[j] })
            : items[j];
          const templateOptions = {
            model,
            container: getPublicElement($container),
            index: i * itemCount + j,
          };

          boundTemplate = cellTemplate.render.bind(cellTemplate, templateOptions);
        } else {
          $container
            .text(items[j].text)
            .attr('title', items[j].text)
            .addClass('dx-scheduler-group-header-content');
          $container = $('<div>').append($container);
        }

        const cssClass = isFunction(cssClasses.groupHeaderClass)
          ? cssClasses.groupHeaderClass(j)
          : cssClasses.groupHeaderClass;

        const cell: GroupCell = { element: $container.addClass(cssClass) };
        if (boundTemplate) {
          cell.template = boundTemplate;
        }

        cells.push(cell);
      }
    }

    return cells;
  }

  private makeVerticalGroupedRows(
    groups: ResourceLoader[],
    cssClasses: GroupCssClasses,
    cellTemplate: TemplateBase | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rowCount?: number,
  ): GroupRows {
    const cellTemplates: TemplateCallback[] = [];
    let repeatCount = 1;
    const cellsArray: GroupCellRow[] = [];

    const cellIterator = (cell: GroupCell): void => {
      if (cell.template) {
        cellTemplates.push(cell.template);
      }
    };

    for (let i = 0; i < groups.length; i += 1) {
      if (i > 0) {
        repeatCount *= groups[i - 1].items.length;
      }

      const cells = this.makeFlexGroupedRowCells(groups[i], repeatCount, cssClasses, cellTemplate);
      cells.forEach(cellIterator);
      cellsArray.push(cells);
    }

    const rows: dxElementWrapper[] = [];
    const groupCount = cellsArray.length;

    for (let i = 0; i < groupCount; i += 1) {
      rows.push($('<div>').addClass(cssClasses.groupHeaderRowClass ?? ''));
    }

    for (let i = groupCount - 1; i >= 0; i -= 1) {
      const currentColumnLength = cellsArray[i].length;
      for (let j = 0; j < currentColumnLength; j += 1) {
        rows[i].append(cellsArray[i][j].element);
      }
    }

    return {
      elements: $('<div>')
        .addClass('dx-scheduler-group-flex-container')
        .append(rows),
      cellTemplates,
    };
  }

  private makeHorizontalGroupedRows(
    groups: ResourceLoader[],
    cssClasses: GroupCssClasses,
    cellCount: number,
    cellTemplate: TemplateBase | null | undefined,
    groupByDate: boolean,
  ): GroupRows {
    let repeatCount = 1;
    const groupCount = groups.length;
    const rows: dxElementWrapper[] = [];
    const cellTemplates: TemplateCallback[] = [];
    const repeatByDate = groupByDate ? cellCount : 1;

    const cellIterator = (cell: GroupCell): dxElementWrapper => {
      if (cell.template) {
        cellTemplates.push(cell.template);
      }

      return cell.element;
    };

    for (let i = 0; i < groupCount; i += 1) {
      if (i > 0) {
        repeatCount *= groups[i - 1].items.length;
      }

      const cells = this.makeGroupedRowCells(
        groups[i],
        repeatCount,
        cssClasses,
        cellTemplate,
        repeatByDate,
      );

      rows.push(
        $('<tr>')
          .addClass(cssClasses.groupRowClass ?? '')
          .append(cells.map(cellIterator)),
      );
    }

    const maxCellCount = rows[groupCount - 1].find('th').length;

    for (let j = 0; j < groupCount; j += 1) {
      const $cell = rows[j].find('th');
      let colspan = maxCellCount / $cell.length;

      if (!groupByDate) {
        colspan *= cellCount;
      }
      if (
        (colspan > 1 && repeatByDate === 1)
        || (groupByDate && groupCount > 1)
      ) {
        $cell.attr('colSpan', colspan);
      }
    }

    return {
      elements: rows,
      cellTemplates,
    };
  }

  private makeGroupedRowCells(
    group: ResourceLoader,
    baseRepeatCount: number,
    cssClasses: GroupCssClasses,
    cellTemplate: TemplateBase | null | undefined,
    baseRepeatByDate: number,
  ): GroupCell[] {
    const effectiveRepeatByDate = baseRepeatByDate || 1;
    const totalRepeatCount = baseRepeatCount * effectiveRepeatByDate;

    const cells: GroupCell[] = [];
    const { items } = group;
    const itemCount = items.length;

    for (let i = 0; i < totalRepeatCount; i += 1) {
      for (let j = 0; j < itemCount; j += 1) {
        let $container = $('<div>');
        let boundTemplate: TemplateCallback | null = null;

        if (cellTemplate?.render) {
          const model = group.data
            ? Object.assign(items[j], { data: group.data[j] })
            : items[j];
          const templateOptions = {
            model,
            container: getPublicElement($container),
            index: i * itemCount + j,
          };

          boundTemplate = cellTemplate.render.bind(cellTemplate, templateOptions);
        } else {
          $container.text(items[j].text);
          $container = $('<div>').append($container);
        }

        $container.addClass(cssClasses.groupHeaderContentClass ?? '');

        const cssClass = isFunction(cssClasses.groupHeaderClass)
          ? cssClasses.groupHeaderClass(j)
          : cssClasses.groupHeaderClass;

        const cell: GroupCell = { element: $('<th>').addClass(cssClass).append($container) };
        if (boundTemplate) {
          cell.template = boundTemplate;
        }

        cells.push(cell);
      }
    }

    return cells;
  }
}

export default {
  tableCreator: new SchedulerTableCreator(),
};

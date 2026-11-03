import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { ColumnTemplateSource, TemplateModel } from '@ts/grids/grid_core/columns_controller/types';
import { rowsModule, RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  ColumnViewTemplate, ColumnViewTemplateOptions, ViewCellOptions, ViewRowEvent,
} from '@ts/grids/grid_core/views/types';
import type { TreeListColumnsController } from '@ts/grids/tree_list/columns_controller';
import treeListCore from '@ts/grids/tree_list/core';
import type { TreeListDataController } from '@ts/grids/tree_list/data_controller/data_controller';

import { CLASSES } from './const';
import type { TreeListNodeCellOptions, TreeListViewRow } from './types';

const createCellContent = ($container: dxElementWrapper): dxElementWrapper => $('<div>')
  .addClass(CLASSES.textContent)
  .appendTo($container);

const createIcon = (
  isLast: boolean,
  hasIcon: boolean | undefined,
  isExpanded: boolean | undefined,
): dxElementWrapper => {
  const $iconElement = $('<div>').addClass(CLASSES.emptySpace);

  if (isLast) {
    $iconElement.addClass(CLASSES.emptySpaceLast);
  }

  if (hasIcon) {
    $iconElement.addClass(isExpanded ? CLASSES.expanded : CLASSES.collapsed);
  }

  return $iconElement;
};

const isNodeCellOptions = (
  options: ViewCellOptions,
): options is TreeListNodeCellOptions => !!options.row?.node;

export class TreeListRowsView extends RowsView {
  protected declare _columnsController: TreeListColumnsController;

  protected declare _dataController: TreeListDataController;

  private _renderIconContainer(
    $container: dxElementWrapper,
    options: TreeListNodeCellOptions,
  ): dxElementWrapper {
    const $iconContainer = $('<div>')
      .addClass(CLASSES.expandIconContainer)
      .appendTo($container);

    if (options.watch) {
      const dispose = options.watch(() => [
        options.row.level,
        options.row.isExpanded,
        options.row.node.hasChildren,
      ], () => {
        $iconContainer.empty();
        this._renderIcons($iconContainer, options);
      });

      eventsEngine.on($iconContainer, removeEvent, dispose);
    }
    $container.addClass(CLASSES.cellExpandable);

    return this._renderIcons($iconContainer, options);
  }

  protected _renderIcons(
    $container: dxElementWrapper,
    options: TreeListNodeCellOptions,
  ): dxElementWrapper {
    const $iconContainer = super._renderIcons($container, options);
    const { row } = options;
    const { level } = row;

    if (level === undefined) {
      return $iconContainer;
    }

    for (let idx = 0; idx <= level; idx += 1) {
      const isLast = idx === level;
      const hasIcon = isLast && row.node.hasChildren;
      const $icon = createIcon(isLast, hasIcon, row.isExpanded);
      $icon.appendTo($iconContainer);
    }

    return $iconContainer;
  }

  protected _renderCellCommandContent(
    container: dxElementWrapper,
    model: ViewCellOptions,
  ): boolean {
    if (isNodeCellOptions(model)) {
      this._renderIconContainer(container, model);
    }
    return true;
  }

  protected _processTemplate<TModel extends TemplateModel>(
    template: ColumnTemplateSource<TModel> | undefined,
    options: TModel,
  ): ColumnViewTemplate<TModel> {
    const renderingTemplate = super._processTemplate(template);
    const firstDataColumnIndex = this._columnsController.getFirstDataColumnIndex();

    if (!renderingTemplate || options.column?.index !== firstDataColumnIndex) {
      return renderingTemplate;
    }

    return {
      render: (templateOptions: ColumnViewTemplateOptions<TModel>): void => {
        const $container = templateOptions.container;

        // @ts-expect-error the rows view renders cell templates with the cell's options
        if (this._renderCellCommandContent($container, templateOptions.model)) {
          templateOptions.container = createCellContent($container);
        }

        renderingTemplate.render(templateOptions);
      },
    };
  }

  public _updateCell($cell: dxElementWrapper, options: ViewCellOptions): void {
    const $targetCell = $cell.hasClass(CLASSES.textContent) ? $cell.parent() : $cell;
    super._updateCell($targetCell, options);
  }

  protected _rowClick(e: ViewRowEvent): void {
    const dataController = this._dataController;
    const $targetElement = $(e.event.target);
    const isExpandIcon = this.isExpandIcon($targetElement);
    const item = dataController?.items()[e.rowIndex];

    if (isExpandIcon && item) {
      dataController.changeRowExpand(item.key);
    }

    super._rowClick(e);
  }

  protected _createRow(row?: TreeListViewRow, tag?: string): dxElementWrapper {
    const node = row?.node;
    const $rowElement = super._createRow(row, tag);
    if (node) {
      this.setAria('level', Number(row.level) + 1, $rowElement);
      if (node.hasChildren) {
        this.setAriaExpandedAttribute($rowElement, row.isExpanded);
      }
    }

    return $rowElement;
  }

  public _getGridRoleName(): string {
    return 'treegrid';
  }

  private isExpandIcon($targetElement: dxElementWrapper): boolean {
    return !!$targetElement.closest(`.${CLASSES.expanded}, .${CLASSES.collapsed}`).length;
  }

  public setAriaExpandedAttribute($row: dxElementWrapper, isExpanded: boolean | undefined): void {
    this.setAria('expanded', isDefined(isExpanded) && isExpanded.toString(), $row);
  }
}

treeListCore.registerModule('rows', {
  defaultOptions: rowsModule.defaultOptions,
  views: {
    rowsView: TreeListRowsView,
  },
});

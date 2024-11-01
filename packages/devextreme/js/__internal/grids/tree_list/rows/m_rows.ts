import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { rowsModule, RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import treeListCore from '../m_core';

const TREELIST_TEXT_CONTENT = 'dx-treelist-text-content';
const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const TREELIST_CELL_EXPANDABLE_CLASS = 'dx-treelist-cell-expandable';
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_EXPANDED_CLASS = 'dx-treelist-expanded';
const TREELIST_COLLAPSED_CLASS = 'dx-treelist-collapsed';

const createCellContent = function ($container) {
  return $('<div>')
    .addClass(TREELIST_TEXT_CONTENT)
    .appendTo($container);
};

const createIcon = function (hasIcon, isExpanded) {
  const $iconElement = $('<div>').addClass(TREELIST_EMPTY_SPACE);

  if (hasIcon) {
    $iconElement
      .toggleClass(TREELIST_EXPANDED_CLASS, isExpanded)
      .toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded)
      .append($('<span>'));
  }

  return $iconElement;
};

class TreeListRowsView extends RowsView {
  private _renderIconContainer($container, options) {
    const $iconContainer = $('<div>')
      .addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS)
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
    $container.addClass(TREELIST_CELL_EXPANDABLE_CLASS);

    return this._renderIcons($iconContainer, options);
  }

  private _renderIcons($iconContainer, options) {
    const { row } = options;
    const { level } = row;

    for (let i = 0; i <= level; i++) {
      $iconContainer.append(createIcon(i === level && row.node.hasChildren, row.isExpanded));
    }

    return $iconContainer;
  }

  private _renderCellCommandContent(container, model) {
    this._renderIconContainer(container, model);
    return true;
  }

  protected _processTemplate(template, options) {
    const that = this;
    let resultTemplate;
    const renderingTemplate = super._processTemplate(template);

    // @ts-expect-error
    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

    if (renderingTemplate && options.column?.index === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          const $container = options.container;

          if (that._renderCellCommandContent($container, options.model)) {
            options.container = createCellContent($container);
          }

          renderingTemplate.render(options);
        },
      };
    } else {
      resultTemplate = renderingTemplate;
    }

    return resultTemplate;
  }

  public _updateCell($cell, options) {
    $cell = $cell.hasClass(TREELIST_TEXT_CONTENT) ? $cell.parent() : $cell;
    super._updateCell($cell, options);
  }

  protected _rowClick(e) {
    const dataController = this._dataController;
    const $targetElement = $(e.event.target);
    const isExpandIcon = this.isExpandIcon($targetElement);
    const item = dataController?.items()[e.rowIndex];

    if (isExpandIcon && item) {
      // @ts-expect-error
      dataController.changeRowExpand(item.key);
    }

    super._rowClick(e);
  }

  protected _createRow(row) {
    const node = row && row.node;
    const $rowElement = super._createRow.apply(this, arguments as any);
    if (node) {
      this.setAria('level', row.level + 1, $rowElement);
      if (node.hasChildren) {
        this.setAriaExpandedAttribute($rowElement, row);
      }
    }

    return $rowElement;
  }

  public _getGridRoleName() {
    return 'treegrid';
  }

  private isExpandIcon($targetElement) {
    return !!$targetElement.closest(`.${TREELIST_EXPANDED_CLASS}, .${TREELIST_COLLAPSED_CLASS}`).length;
  }

  public setAriaExpandedAttribute($row, row) {
    const isRowExpanded = row.isExpanded;
    this.setAria('expanded', isDefined(isRowExpanded) && isRowExpanded.toString(), $row);
  }
}

treeListCore.registerModule('rows', {
  defaultOptions: rowsModule.defaultOptions,
  views: {
    rowsView: TreeListRowsView,
  },
});

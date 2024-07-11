"use strict";

var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _m_rows_view = require("../../../grids/grid_core/views/m_rows_view");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TREELIST_TEXT_CONTENT = 'dx-treelist-text-content';
const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const TREELIST_CELL_EXPANDABLE_CLASS = 'dx-treelist-cell-expandable';
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_EXPANDED_CLASS = 'dx-treelist-expanded';
const TREELIST_COLLAPSED_CLASS = 'dx-treelist-collapsed';
const createCellContent = function ($container) {
  return (0, _renderer.default)('<div>').addClass(TREELIST_TEXT_CONTENT).appendTo($container);
};
const createIcon = function (hasIcon, isExpanded) {
  const $iconElement = (0, _renderer.default)('<div>').addClass(TREELIST_EMPTY_SPACE);
  if (hasIcon) {
    $iconElement.toggleClass(TREELIST_EXPANDED_CLASS, isExpanded).toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded).append((0, _renderer.default)('<span>'));
  }
  return $iconElement;
};
class TreeListRowsView extends _m_rows_view.RowsView {
  _renderIconContainer($container, options) {
    const $iconContainer = (0, _renderer.default)('<div>').addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS).appendTo($container);
    if (options.watch) {
      const dispose = options.watch(() => [options.row.level, options.row.isExpanded, options.row.node.hasChildren], () => {
        $iconContainer.empty();
        this._renderIcons($iconContainer, options);
      });
      _events_engine.default.on($iconContainer, _remove.removeEvent, dispose);
    }
    $container.addClass(TREELIST_CELL_EXPANDABLE_CLASS);
    return this._renderIcons($iconContainer, options);
  }
  _renderIcons($iconContainer, options) {
    const {
      row
    } = options;
    const {
      level
    } = row;
    for (let i = 0; i <= level; i++) {
      $iconContainer.append(createIcon(i === level && row.node.hasChildren, row.isExpanded));
    }
    return $iconContainer;
  }
  _renderCellCommandContent(container, model) {
    this._renderIconContainer(container, model);
    return true;
  }
  _processTemplate(template, options) {
    var _options$column;
    const that = this;
    let resultTemplate;
    const renderingTemplate = super._processTemplate(template);
    // @ts-expect-error
    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();
    if (renderingTemplate && ((_options$column = options.column) === null || _options$column === void 0 ? void 0 : _options$column.index) === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          const $container = options.container;
          if (that._renderCellCommandContent($container, options.model)) {
            options.container = createCellContent($container);
          }
          renderingTemplate.render(options);
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  }
  _updateCell($cell, options) {
    $cell = $cell.hasClass(TREELIST_TEXT_CONTENT) ? $cell.parent() : $cell;
    super._updateCell($cell, options);
  }
  _rowClick(e) {
    const dataController = this._dataController;
    const $targetElement = (0, _renderer.default)(e.event.target);
    const isExpandIcon = this.isExpandIcon($targetElement);
    const item = dataController === null || dataController === void 0 ? void 0 : dataController.items()[e.rowIndex];
    if (isExpandIcon && item) {
      // @ts-expect-error
      dataController.changeRowExpand(item.key);
    }
    super._rowClick(e);
  }
  _createRow(row) {
    const node = row && row.node;
    const $rowElement = super._createRow.apply(this, arguments);
    if (node) {
      this.setAria('level', row.level + 1, $rowElement);
      if (node.hasChildren) {
        this.setAria('expanded', row.isExpanded, $rowElement);
      }
    }
    return $rowElement;
  }
  _getGridRoleName() {
    return 'treegrid';
  }
  isExpandIcon($targetElement) {
    return !!$targetElement.closest(`.${TREELIST_EXPANDED_CLASS}, .${TREELIST_COLLAPSED_CLASS}`).length;
  }
  setAriaExpandedAttribute($row, row) {
    const isRowExpanded = row.isExpanded;
    this.setAria('expanded', (0, _type.isDefined)(isRowExpanded) && isRowExpanded.toString(), $row);
  }
}
_m_core.default.registerModule('rows', {
  defaultOptions: _m_rows_view.rowsModule.defaultOptions,
  views: {
    rowsView: TreeListRowsView
  }
});
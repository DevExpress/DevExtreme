"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SORT_CLASS = 'dx-sort';
const SORT_NONE_CLASS = 'dx-sort-none';
const SORTUP_CLASS = 'dx-sort-up';
const SORTDOWN_CLASS = 'dx-sort-down';
const SORT_INDEX_CLASS = 'dx-sort-index';
const SORT_INDEX_ICON_CLASS = 'dx-sort-index-icon';
const HEADERS_ACTION_CLASS = 'action';
// TODO improve types of this mixin
//  Now all members - protected by default (it may be wrong)
// TODO getController
const sortingMixin = Base => class SortingMixin extends Base {
  _applyColumnState(options) {
    const that = this;
    let ariaSortState;
    let $sortIndicator;
    const sortingMode = that.option('sorting.mode');
    const {
      rootElement
    } = options;
    const {
      column
    } = options;
    const $indicatorsContainer = that._getIndicatorContainer(rootElement);
    if (options.name === 'sort') {
      rootElement.find(`.${SORT_CLASS}`).remove();
      !$indicatorsContainer.children().length && $indicatorsContainer.remove();
      const isSortingAllowed = sortingMode !== 'none' && column.allowSorting;
      const hasSeveralSortIndexes = that.getController && !!that.getController('columns').columnOption('sortIndex:1');
      if (!(0, _type.isDefined)(column.groupIndex) && (isSortingAllowed || (0, _type.isDefined)(column.sortOrder))) {
        ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
        $sortIndicator = super._applyColumnState(options).toggleClass(SORTUP_CLASS, column.sortOrder === 'asc').toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');
        if (hasSeveralSortIndexes && that.option('sorting.showSortIndexes') && column.sortIndex >= 0) {
          (0, _renderer.default)('<span>').addClass(SORT_INDEX_ICON_CLASS).text(column.sortIndex + 1).appendTo($sortIndicator);
          $sortIndicator.addClass(SORT_INDEX_CLASS);
        }
        if (isSortingAllowed) {
          options.rootElement.addClass(that.addWidgetPrefix(HEADERS_ACTION_CLASS));
        }
      }
      this._setAriaSortAttribute(column, ariaSortState, rootElement, hasSeveralSortIndexes);
      return $sortIndicator;
    }
    return super._applyColumnState(options);
  }
  _setAriaSortAttribute(column, ariaSortState, $rootElement, hasSeveralSortIndexes) {
    $rootElement.removeAttr('aria-roledescription');
    if (column.isGrouped) {
      let description = this.localize('dxDataGrid-ariaNotSortedColumn');
      if ((0, _type.isDefined)(column.sortOrder)) {
        description = column.sortOrder === 'asc' ? this.localize('dxDataGrid-ariaSortedAscendingColumn') : this.localize('dxDataGrid-ariaSortedDescendingColumn');
      }
      this.setAria('roledescription', description, $rootElement);
    } else if (!(0, _type.isDefined)(column.sortOrder)) {
      this.setAria('sort', 'none', $rootElement);
    } else {
      this.setAria('sort', ariaSortState, $rootElement);
      if (hasSeveralSortIndexes && column.sortIndex >= 0) {
        const ariaColumnHeader = _message.default.format('dxDataGrid-ariaColumnHeader');
        const ariaSortIndex = _message.default.format('dxDataGrid-ariaSortIndex',
        // @ts-expect-error
        column.sortIndex + 1);
        const description = `${ariaColumnHeader}, ${ariaSortIndex}`;
        this.setAria('roledescription', description, $rootElement);
      }
    }
  }
  _getIndicatorClassName(name) {
    if (name === 'sort') {
      return SORT_CLASS;
    }
    if (name === 'sortIndex') {
      return SORT_INDEX_ICON_CLASS;
    }
    return super._getIndicatorClassName(name);
  }
  _renderIndicator(options) {
    const {
      column
    } = options;
    const $container = options.container;
    const $indicator = options.indicator;
    if (options.name === 'sort') {
      const rtlEnabled = this.option('rtlEnabled');
      if (!(0, _type.isDefined)(column.sortOrder)) {
        $indicator && $indicator.addClass(SORT_NONE_CLASS);
      }
      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'left' || rtlEnabled && options.columnAlignment === 'right')) {
        $container.prepend($indicator);
        return;
      }
    }
    super._renderIndicator(options);
  }
  _updateIndicator($cell, column, indicatorName) {
    if (indicatorName === 'sort' && (0, _type.isDefined)(column.groupIndex)) {
      return;
    }
    return super._updateIndicator.apply(this, arguments);
  }
  _getIndicatorElements($cell, returnAll) {
    const $indicatorElements = super._getIndicatorElements($cell);
    return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not(`.${SORT_NONE_CLASS}`);
  }
};
var _default = exports.default = sortingMixin;
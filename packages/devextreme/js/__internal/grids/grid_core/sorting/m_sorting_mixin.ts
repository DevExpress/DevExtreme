import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

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
const sortingMixin = (Base: ModuleType<any>) => class SortingMixin extends Base {
  protected _applyColumnState(options) {
    const that = this;
    let ariaSortState;
    let $sortIndicator;
    const sortingMode = that.option('sorting.mode');
    const { rootElement } = options;
    const { column } = options;
    const $indicatorsContainer = that._getIndicatorContainer(rootElement);

    if (options.name === 'sort') {
      rootElement.find(`.${SORT_CLASS}`).remove();
      !$indicatorsContainer.children().length && $indicatorsContainer.remove();

      const isSortingAllowed = sortingMode !== 'none' && column.allowSorting;
      const hasSeveralSortIndexes = that.getController && !!that.getController('columns').columnOption('sortIndex:1');

      if (!isDefined(column.groupIndex) && (isSortingAllowed || isDefined(column.sortOrder))) {
        ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
        $sortIndicator = super._applyColumnState(options)
          .toggleClass(SORTUP_CLASS, column.sortOrder === 'asc')
          .toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');

        if (hasSeveralSortIndexes && that.option('sorting.showSortIndexes') && column.sortIndex >= 0) {
          $('<span>')
            .addClass(SORT_INDEX_ICON_CLASS)
            .text(column.sortIndex + 1)
            .appendTo($sortIndicator);
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

  protected _setAriaSortAttribute(column, ariaSortState, $rootElement, hasSeveralSortIndexes) {
    $rootElement.removeAttr('aria-roledescription');

    if (column.isGrouped) {
      let description = this.localize('dxDataGrid-ariaNotSortedColumn');
      if (isDefined(column.sortOrder)) {
        description = column.sortOrder === 'asc'
          ? this.localize('dxDataGrid-ariaSortedAscendingColumn')
          : this.localize('dxDataGrid-ariaSortedDescendingColumn');
      }
      this.setAria('roledescription', description, $rootElement);
    } else if (!isDefined(column.sortOrder)) {
      this.setAria('sort', 'none', $rootElement);
    } else {
      this.setAria('sort', ariaSortState, $rootElement);

      if (hasSeveralSortIndexes && column.sortIndex >= 0) {
        const ariaColumnHeader = messageLocalization.format('dxDataGrid-ariaColumnHeader');
        const ariaSortIndex = messageLocalization.format(
          'dxDataGrid-ariaSortIndex',
          // @ts-expect-error
          column.sortIndex + 1,
        );
        const description = `${ariaColumnHeader}, ${ariaSortIndex}`;
        this.setAria('roledescription', description, $rootElement);
      }
    }
  }

  protected _getIndicatorClassName(name) {
    if (name === 'sort') {
      return SORT_CLASS;
    } if (name === 'sortIndex') {
      return SORT_INDEX_ICON_CLASS;
    }
    return super._getIndicatorClassName(name);
  }

  protected _renderIndicator(options) {
    const { column } = options;
    const $container = options.container;
    const $indicator = options.indicator;

    if (options.name === 'sort') {
      const rtlEnabled = this.option('rtlEnabled');

      if (!isDefined(column.sortOrder)) {
        $indicator && $indicator.addClass(SORT_NONE_CLASS);
      }

      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'left' || rtlEnabled && options.columnAlignment === 'right')) {
        $container.prepend($indicator);
        return;
      }
    }

    super._renderIndicator(options);
  }

  protected _updateIndicator($cell, column, indicatorName) {
    if (indicatorName === 'sort' && isDefined(column.groupIndex)) {
      return;
    }

    return super._updateIndicator.apply(this, arguments as any);
  }

  protected _getIndicatorElements($cell, returnAll) {
    const $indicatorElements = super._getIndicatorElements($cell);

    return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not(`.${SORT_NONE_CLASS}`);
  }
};

export default sortingMixin;

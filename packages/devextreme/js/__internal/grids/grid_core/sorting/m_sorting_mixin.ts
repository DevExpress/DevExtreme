import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import messageLocalization from '@js/localization/message';

const SORT_CLASS = 'dx-sort';
const SORT_NONE_CLASS = 'dx-sort-none';
const SORTUP_CLASS = 'dx-sort-up';
const SORTDOWN_CLASS = 'dx-sort-down';
const SORT_INDEX_CLASS = 'dx-sort-index';
const SORT_INDEX_ICON_CLASS = 'dx-sort-index-icon';
const HEADERS_ACTION_CLASS = 'action';

export default {
  _applyColumnState(options) {
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

      if (!isDefined(column.groupIndex) && (isSortingAllowed || isDefined(column.sortOrder))) {
        ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
        $sortIndicator = that.callBase(options)
          .toggleClass(SORTUP_CLASS, column.sortOrder === 'asc')
          .toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');

        const hasSeveralSortIndexes = that.getController && !!that.getController('columns').columnOption('sortIndex:1');
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

      this._setAriaSortAttribute(column, ariaSortState, rootElement);

      return $sortIndicator;
    }
    return that.callBase(options);
  },

  _setAriaSortAttribute(column, ariaSortState, rootElement) {
    const descriptionList: string[] = [];

    if (rootElement.attr('role') === 'columnheader') {
      descriptionList.push(messageLocalization.format('dxDataGrid-ariaColumnHeader'));
    }

    if (column.isGrouped) {
      let sortOrderDescription = messageLocalization.format('dxDataGrid-ariaNotSortedColumn');
      if (isDefined(column.sortOrder)) {
        sortOrderDescription = column.sortOrder === 'asc'
          ? messageLocalization.format('dxDataGrid-ariaSortedAscendingColumn')
          : messageLocalization.format('dxDataGrid-ariaSortedDescendingColumn');
      }
      descriptionList.push(sortOrderDescription);
    } else if (!isDefined(column.sortOrder)) {
      this.setAria('sort', 'none', rootElement);
    } else {
      // @ts-expect-error
      const sortIndexDescription = messageLocalization.format('dxDataGrid-ariaSortIndex', column.sortIndex);
      descriptionList.push(sortIndexDescription);
      this.setAria('sort', ariaSortState, rootElement);
    }

    this.setAria('roledescription', descriptionList.join(', '), rootElement);
  },

  _getIndicatorClassName(name) {
    if (name === 'sort') {
      return SORT_CLASS;
    } if (name === 'sortIndex') {
      return SORT_INDEX_ICON_CLASS;
    }
    return this.callBase(name);
  },

  _renderIndicator(options) {
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

    this.callBase(options);
  },

  _updateIndicator($cell, column, indicatorName) {
    if (indicatorName === 'sort' && isDefined(column.groupIndex)) {
      return;
    }

    return this.callBase.apply(this, arguments);
  },

  _getIndicatorElements($cell, returnAll) {
    const $indicatorElements = this.callBase($cell);

    return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not(`.${SORT_NONE_CLASS}`);
  },
};

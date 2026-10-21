import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { Column } from '../columns_controller/types';
import { CLASSES } from './const';
import type {
  AriaSortState,
  MixinBase,
  RenderedIndicatorOptions,
  SortingColumn,
  SortingColumnStateOptions,
} from './types';

// TODO getController
const sortingMixin = <T extends MixinBase>(
  Base: T,
): T => class SortingMixin extends Base {
  protected _applyColumnState(
    options: SortingColumnStateOptions,
  ): dxElementWrapper | undefined {
    if (options.name !== 'sort') {
      return super._applyColumnState(options);
    }

    const sortingMode = this.option('sorting.mode');
    const { rootElement, column } = options;
    const $indicatorsContainer = this._getIndicatorContainer(rootElement);

    rootElement.find(`.${CLASSES.sort}`).remove();
    if (!$indicatorsContainer.children().length) {
      $indicatorsContainer.remove();
    }

    const isSortingAllowed = sortingMode !== 'none' && Boolean(column.allowSorting);
    const hasSeveralSortIndexes = this.getController
      && Boolean(this.getController('columns').columnOption('sortIndex:1'));
    const isSortIndicatorVisible = !isDefined(column.groupIndex)
      && (isSortingAllowed || isDefined(column.sortOrder));

    if (!isSortIndicatorVisible) {
      this._setAriaSortAttribute(column, undefined, rootElement, hasSeveralSortIndexes);

      return undefined;
    }

    const ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
    const $sortIndicator = super._applyColumnState(options);

    if (!$sortIndicator) {
      return undefined;
    }

    $sortIndicator
      .toggleClass(CLASSES.sortUp, column.sortOrder === 'asc')
      .toggleClass(CLASSES.sortDown, column.sortOrder === 'desc');

    if (
      hasSeveralSortIndexes
      && this.option('sorting.showSortIndexes')
      && column.sortIndex !== undefined
      && column.sortIndex >= 0
    ) {
      $('<span>')
        .addClass(CLASSES.sortIndexIcon)
        .text(column.sortIndex + 1)
        .appendTo($sortIndicator);
      $sortIndicator.addClass(CLASSES.sortIndex);
    }

    if (isSortingAllowed) {
      rootElement.addClass(this.addWidgetPrefix(CLASSES.action));
    }

    this._setAriaSortAttribute(column, ariaSortState, rootElement, hasSeveralSortIndexes);

    return $sortIndicator;
  }

  protected _setAriaSortAttribute(
    column: SortingColumn,
    ariaSortState: AriaSortState | undefined,
    $rootElement: dxElementWrapper,
    hasSeveralSortIndexes: boolean,
  ): void {
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

      if (hasSeveralSortIndexes && column.sortIndex !== undefined && column.sortIndex >= 0) {
        const ariaColumnHeader = messageLocalization.format('dxDataGrid-ariaColumnHeader');
        const ariaSortIndex = messageLocalization.format(
          'dxDataGrid-ariaSortIndex',
          // @ts-expect-error format() is typed without placeholder values
          column.sortIndex + 1,
        );
        const description = `${ariaColumnHeader}, ${ariaSortIndex}`;
        this.setAria('roledescription', description, $rootElement);
      }
    }
  }

  protected _getIndicatorClassName(name: string): string | undefined {
    if (name === 'sort') {
      return CLASSES.sort;
    }

    if (name === 'sortIndex') {
      return CLASSES.sortIndexIcon;
    }

    return super._getIndicatorClassName(name);
  }

  protected _renderIndicator(options: RenderedIndicatorOptions): void {
    const { column, container: $container, indicator: $indicator } = options;

    if (options.name === 'sort') {
      const rtlEnabled = this.option('rtlEnabled');

      if (!isDefined(column.sortOrder)) {
        $indicator.addClass(CLASSES.sortNone);
      }

      const isIndicatorFirst = (!rtlEnabled && options.columnAlignment === 'left')
        || (rtlEnabled && options.columnAlignment === 'right');

      if ($container.children().length && isIndicatorFirst) {
        $container.prepend($indicator);
        return;
      }
    }

    super._renderIndicator(options);
  }

  protected _updateIndicator(
    $cell: dxElementWrapper,
    column: Column,
    indicatorName: string,
  ): dxElementWrapper | undefined {
    if (indicatorName === 'sort' && isDefined(column.groupIndex)) {
      return undefined;
    }

    return super._updateIndicator($cell, column, indicatorName);
  }

  protected _getIndicatorElements($cell: dxElementWrapper, returnAll?: boolean): dxElementWrapper {
    const $indicatorElements = super._getIndicatorElements($cell);

    return returnAll ? $indicatorElements : $indicatorElements.not(`.${CLASSES.sortNone}`);
  }
};

export default sortingMixin;

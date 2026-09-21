/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { CustomOperation } from '@js/ui/filter_builder';
import FilterBuilder from '@js/ui/filter_builder';
import Popup from '@js/ui/popup/ui.popup';
import ScrollView from '@js/ui/scroll_view';
import { restoreFocus } from '@js/ui/shared/accessibility';
import { getFilterExpression, removeFieldConditionsFromFilter } from '@ts/filter_builder/m_utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import modules from '@ts/grids/grid_core/m_modules';

import type { DataFilter, FilterSourceContext } from '../filter/types';
import { anyOf, noneOf } from '../filter_sync/m_filter_custom_operations';
import { getColumnIdentifier } from '../filter_sync/utils';

export class FilterBuilderView extends modules.View {
  private _filterBuilderPopup: any;

  private _filterBuilder: any;

  private _columnsController!: ColumnsController;

  private filterBuilderController?: FilterBuilderController;

  public init() {
    super.init();
    this._columnsController = this.getController('columns');
    this.filterBuilderController = this.getController('filterBuilder');
  }

  public optionChanged(args) {
    switch (args.name) {
      case 'filterBuilder':
      case 'filterBuilderPopup':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  protected _renderCore() {
    this._updatePopupOptions();
  }

  private _updatePopupOptions() {
    if (this.option('filterBuilderPopup.visible')) {
      this._initPopup();
    } else if (this._filterBuilderPopup) {
      this._filterBuilderPopup.hide();
    }
  }

  private _disposePopup() {
    if (this._filterBuilderPopup) {
      this._filterBuilderPopup.dispose();
      this._filterBuilderPopup = undefined;
    }
    if (this._filterBuilder) {
      this._filterBuilder.dispose();
      this._filterBuilder = undefined;
    }
  }

  private _initPopup() {
    const that = this;

    that._disposePopup();
    that._filterBuilderPopup = that._createComponent(that.element(), Popup, extend({
      title: messageLocalization.format('dxDataGrid-filterBuilderPopupTitle'),
      contentTemplate($contentElement) {
        return that._getPopupContentTemplate($contentElement);
      },
      onOptionChanged(args) {
        if (args.name === 'visible') {
          that.option('filterBuilderPopup.visible', args.value);
        }
      },
      toolbarItems: that._getPopupToolbarItems(),
    }, that.option('filterBuilderPopup'), {
      onHidden() {
        restoreFocus(that);
        that._disposePopup();
      },
    }));
  }

  private _getPopupContentTemplate(contentElement) {
    const $contentElement = $(contentElement);
    const $filterBuilderContainer = $('<div>').appendTo($(contentElement));

    this._filterBuilder = this._createComponent($filterBuilderContainer, FilterBuilder, extend({
      value: this.option('filterValue'),
      fields: this._columnsController.getFilteringColumns(),
    }, this.option('filterBuilder'), {
      customOperations: this.filterBuilderController?.getCustomFilterOperations(),
    }));

    this._createComponent($contentElement, ScrollView, { direction: 'both' });
  }

  private _getPopupToolbarItems() {
    const that = this;
    return [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('OK'),
          onClick() {
            const filter = that._filterBuilder.option('value');
            that.option('filterValue', filter);
            that._filterBuilderPopup.hide();
          },
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('Cancel'),
          onClick() {
            that._filterBuilderPopup.hide();
          },
        },
      },
    ];
  }
}

export class FilterBuilderController extends modules.Controller {
  public publicMethods(): string[] {
    return ['getCustomFilterOperations'];
  }

  public isFilterSourceActive({ columnsController }: FilterSourceContext): boolean {
    return !!columnsController.getFilteringColumns()?.length
      && this.option('filterPanel.filterEnabled') !== false;
  }

  public getFilterExpressions(
    {
      excludedColumn,
      columnsController,
      filterSyncActive,
    }: FilterSourceContext,
  ): DataFilter[] {
    const currentFilterValue = this.option('filterValue');
    const shouldExcludeColumn = filterSyncActive && isDefined(excludedColumn);
    const filterValue = shouldExcludeColumn
      ? removeFieldConditionsFromFilter(currentFilterValue, getColumnIdentifier(excludedColumn))
      : currentFilterValue;
    const columns = columnsController.getFilteringColumns();
    const customOperations = this.getCustomFilterOperations();
    const filterExpression: DataFilter = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');

    return filterExpression ? [filterExpression] : [];
  }

  // Override in the private API WA [T1232532]
  public getCustomFilterOperations(): CustomOperation[] {
    const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') ?? [];

    return [
      anyOf(this.component),
      noneOf(this.component),
      ...filterBuilderCustomOperations,
    ];
  }
}

export const filterBuilderModule = {
  defaultOptions() {
    return {
      filterBuilder: {
        groupOperationDescriptions: {
          and: messageLocalization.format('dxFilterBuilder-and'),
          or: messageLocalization.format('dxFilterBuilder-or'),
          notAnd: messageLocalization.format('dxFilterBuilder-notAnd'),
          notOr: messageLocalization.format('dxFilterBuilder-notOr'),
        },
        filterOperationDescriptions: {
          between: messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
          equal: messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
          notEqual: messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
          lessThan: messageLocalization.format('dxFilterBuilder-filterOperationLess'),
          lessThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
          greaterThan: messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
          greaterThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
          startsWith: messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
          contains: messageLocalization.format('dxFilterBuilder-filterOperationContains'),
          notContains: messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
          endsWith: messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
          isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
        },
      },

      filterBuilderPopup: {},
    };
  },
  controllers: {
    filterBuilder: FilterBuilderController,
  },
  views: {
    filterBuilderView: FilterBuilderView,
  },
};

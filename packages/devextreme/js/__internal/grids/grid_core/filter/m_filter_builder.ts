import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import FilterBuilder from '@js/ui/filter_builder';
import Popup from '@js/ui/popup/ui.popup';
import ScrollView from '@js/ui/scroll_view';
import { restoreFocus } from '@js/ui/shared/accessibility';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { FilterSyncController } from '@ts/grids/grid_core/filter/m_filter_sync';

import modules from '../m_modules';

export class FilterBuilderView extends modules.View {
  private _filterBuilderPopup: any;

  private _filterBuilder: any;

  private _columnsController!: ColumnsController;

  private _filterSyncController!: FilterSyncController;

  public init() {
    super.init();
    this._columnsController = this.getController('columns');
    this._filterSyncController = this.getController('filterSync');
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
      customOperations: this._filterSyncController.getCustomFilterOperations(),
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
  views: {
    filterBuilderView: FilterBuilderView,
  },
};

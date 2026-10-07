/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { CustomOperation } from '@js/ui/filter_builder';
import FilterBuilder from '@js/ui/filter_builder';
import type { OptionChangedEvent as PopupOptionChangedEvent, ToolbarItem } from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import ScrollView from '@js/ui/scroll_view';
import { restoreFocus } from '@js/ui/shared/accessibility';
import { getFilterExpression, removeFieldConditionsFromFilter } from '@ts/filter_builder/utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import modules from '@ts/grids/grid_core/modules/modules';
import type { InternalGridOptions, OptionChanged } from '@ts/grids/grid_core/types';

import type { DataFilter, FilterSourceContext } from '../filter/types';
import { anyOf, noneOf } from '../filter_sync/m_filter_custom_operations';
import { getColumnIdentifier } from '../filter_sync/utils';

export class FilterBuilderView extends modules.View {
  private _filterBuilderPopup?: Popup;

  private _filterBuilder?: FilterBuilder;

  private _columnsController!: ColumnsController;

  private filterBuilderController?: FilterBuilderController;

  public init(): void {
    super.init();
    this._columnsController = this.getController('columns');
    this.filterBuilderController = this.getController('filterBuilder');
  }

  public optionChanged(args: OptionChanged): void {
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

  protected _renderCore(): void {
    this._updatePopupOptions();
  }

  private _updatePopupOptions(): void {
    if (this.option('filterBuilderPopup.visible')) {
      this._initPopup();
    } else if (this._filterBuilderPopup) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._filterBuilderPopup.hide();
    }
  }

  private _disposePopup(): void {
    if (this._filterBuilderPopup) {
      this._filterBuilderPopup.dispose();
      this._filterBuilderPopup = undefined;
    }
    if (this._filterBuilder) {
      this._filterBuilder.dispose();
      this._filterBuilder = undefined;
    }
  }

  private _initPopup(): void {
    this._disposePopup();
    // @ts-expect-error the view is rendered here
    this._filterBuilderPopup = this._createComponent(this.element(), Popup, extend({
      title: messageLocalization.format('dxDataGrid-filterBuilderPopupTitle'),
      contentTemplate: ($contentElement: Element): void => {
        this._getPopupContentTemplate($contentElement);
      },
      onOptionChanged: (args: PopupOptionChangedEvent): void => {
        if (args.name === 'visible') {
          this.option('filterBuilderPopup.visible', args.value);
        }
      },
      toolbarItems: this._getPopupToolbarItems(),
    }, this.option('filterBuilderPopup'), {
      onHidden: (): void => {
        restoreFocus(this);
        this._disposePopup();
      },
    }));
  }

  private _getPopupContentTemplate(contentElement: Element | dxElementWrapper): void {
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

  private _getPopupToolbarItems(): ToolbarItem[] {
    return [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('OK'),
          onClick: (): void => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const filter = this._filterBuilder!.option('value');
            // @ts-expect-error FilterBuilder value does not match the grid filterValue type
            this.option('filterValue', filter);
            // eslint-disable-next-line @stylistic/max-len
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-floating-promises
            this._filterBuilderPopup!.hide();
          },
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: messageLocalization.format('Cancel'),
          onClick: (): void => {
            // eslint-disable-next-line @stylistic/max-len
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-floating-promises
            this._filterBuilderPopup!.hide();
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
    // @ts-expect-error FilterExpression and grid fields don't match DataFilter/FilterBuilderField
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
  defaultOptions(): Pick<InternalGridOptions, 'filterBuilder' | 'filterBuilderPopup'> {
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

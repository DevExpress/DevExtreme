/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { ValueChangedEvent as CheckBoxValueChangedEvent } from '@js/ui/check_box';
import CheckBox from '@js/ui/check_box';
import type { CustomOperation } from '@js/ui/filter_builder';
import inflector from '@ts/core/utils/m_inflector';
import type { Condition, Criteria, FilterBuilderField } from '@ts/filter_builder/utils';
import {
  getCaptionByOperation, getCurrentLookupValueText, getCurrentValueText,
  getCustomOperation, getField, getGroupValue, isCondition, isGroup,
} from '@ts/filter_builder/utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import { registerKeyboardAction } from '@ts/grids/grid_core/m_accessibility';
import gridUtils from '@ts/grids/grid_core/m_utils';
import modules from '@ts/grids/grid_core/modules/modules';
import type { InternalGridOptions, ModuleType, OptionChanged } from '@ts/grids/grid_core/types';

import type { FilterValueExpression } from '../filter/types';
import type { FilterBuilderController } from '../filter_builder/m_filter_builder';
import type { FilterOperationDescriptions, FilterTextOptions } from './types';

const FILTER_PANEL_CLASS = 'filter-panel';
const FILTER_PANEL_TEXT_CLASS = `${FILTER_PANEL_CLASS}-text`;
const FILTER_PANEL_CHECKBOX_CLASS = `${FILTER_PANEL_CLASS}-checkbox`;
const FILTER_PANEL_CLEAR_FILTER_CLASS = `${FILTER_PANEL_CLASS}-clear-filter`;
const FILTER_PANEL_LEFT_CONTAINER = `${FILTER_PANEL_CLASS}-left`;

const FILTER_PANEL_TARGET = 'filterPanel';

export class FilterPanelView extends modules.View {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private dataSourceController!: DataSourceController;

  private filterBuilderController!: FilterBuilderController;

  public init(): void {
    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this._columnsController = this.getController('columns');
    this.filterBuilderController = this.getController('filterBuilder');

    this._dataController.dataSourceChanged.add(() => this.render());
  }

  public isVisible(): boolean {
    return !!this.option('filterPanel.visible') && this.dataSourceController.hasAdapter();
  }

  protected _renderCore(): void {
    // @ts-expect-error the view is rendered here
    const $element: dxElementWrapper = this.element();

    $element.empty();

    const isColumnsDefined = !!this._columnsController.getColumns().length;

    if (!isColumnsDefined) {
      return;
    }

    $element
      .addClass(this.addWidgetPrefix(FILTER_PANEL_CLASS));

    const $leftContainer = $('<div>')
      .addClass(this.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER))
      .appendTo($element);

    this._renderFilterBuilderText($element, $leftContainer);
  }

  private _renderFilterBuilderText(
    $element: dxElementWrapper,
    $leftContainer: dxElementWrapper,
  ): void {
    const $filterElement = this._getFilterElement();
    const $textElement = this._getTextElement();

    if (this.option('filterValue')) {
      const $checkElement = this._getCheckElement();
      const $removeButtonElement = this._getRemoveButtonElement();

      $leftContainer
        .append($checkElement)
        .append($filterElement)
        .append($textElement);

      $element.append($removeButtonElement);

      return;
    }

    $leftContainer
      .append($filterElement)
      .append($textElement);
  }

  private _getCheckElement(): dxElementWrapper {
    const $element = $('<div>')
      .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

    this._createComponent($element, CheckBox, {
      value: this.option('filterPanel.filterEnabled'),
      onValueChanged: (e: CheckBoxValueChangedEvent): void => {
        this.option('filterPanel.filterEnabled', e.value);
      },
    });
    const filterEnabledHint = this.option('filterPanel.texts.filterEnabledHint')
      ?? messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint');
    $element.attr('title', filterEnabledHint);
    return $element;
  }

  private _getFilterElement(): dxElementWrapper {
    const $element = $('<div>').addClass('dx-icon-filter');

    eventsEngine.on($element, 'click', () => this._showFilterBuilder());

    registerKeyboardAction('filterPanel', this, $element, undefined, () => this._showFilterBuilder());

    this._addTabIndexToElement($element);

    return $element;
  }

  private _getTextElement(): dxElementWrapper {
    const $textElement = $('<div>').addClass(this.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
    const filterValue = this.option('filterValue');
    if (filterValue) {
      when(this.getFilterText(
        filterValue,
        this.filterBuilderController.getCustomFilterOperations(),
      )).done((text) => {
        let filterText = text;
        const customizeText = this.option('filterPanel.customizeText');
        if (customizeText) {
          const customText = customizeText({
            component: this.component,
            filterValue,
            text: filterText,
          });
          if (typeof customText === 'string') {
            filterText = customText;
          }
        }
        $textElement.text(filterText);
      });
    } else {
      const filterText = this.option('filterPanel.texts.createFilter')
        ?? messageLocalization.format('dxDataGrid-filterPanelCreateFilter');
      $textElement.text(filterText);
    }

    eventsEngine.on($textElement, 'click', () => this._showFilterBuilder());

    registerKeyboardAction('filterPanel', this, $textElement, undefined, () => this._showFilterBuilder());

    this._addTabIndexToElement($textElement);

    return $textElement;
  }

  private _showFilterBuilder(): void {
    this.option('filterBuilderPopup.visible', true);
  }

  private _getRemoveButtonElement(): dxElementWrapper {
    const clearFilterValue = (): void => this.option('filterValue', null);
    const clearFilterText = this.option('filterPanel.texts.clearFilter')
      ?? messageLocalization.format('dxDataGrid-filterPanelClearFilter');
    const $element = $('<div>')
      .addClass(this.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
      .text(clearFilterText);

    eventsEngine.on($element, 'click', clearFilterValue);

    registerKeyboardAction('filterPanel', this, $element, undefined, clearFilterValue);

    this._addTabIndexToElement($element);

    return $element;
  }

  private _addTabIndexToElement($element: dxElementWrapper): void {
    if (!this.option('useLegacyKeyboardNavigation')) {
      const tabindex = this.option('tabindex') || 0;
      $element.attr('tabindex', tabindex);
    }
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'filterValue':
        this._invalidate();
        this.option('filterPanel.filterEnabled', true);
        args.handled = true;
        break;
      case 'filterPanel':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  private _getConditionText(fieldText: string, operationText: string, valueText: string): string {
    let result = `[${fieldText}] ${operationText}`;
    if (isDefined(valueText)) {
      result += valueText;
    }
    return result;
  }

  private _getValueMaskedText(value: string | string[]): string {
    return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
  }

  private _getValueText(
    field: FilterBuilderField,
    customOperation: CustomOperation | null,
    value: unknown,
  ): DeferredObj<string> {
    const deferred = Deferred<string>();
    const hasCustomOperation = customOperation?.customizeText;
    if (isDefined(value) || hasCustomOperation) {
      if (!hasCustomOperation && field.lookup) {
        // @ts-expect-error field.lookup is checked above, TS doesn't narrow field to LookupField
        getCurrentLookupValueText(field, value, (data) => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      } else {
        const displayValue = Array.isArray(value)
          ? value
          : gridUtils.getDisplayValue(field, value, null);
        when(getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET))
          .done((data) => {
            deferred.resolve(this._getValueMaskedText(data));
          });
      }
    } else {
      deferred.resolve('');
    }
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private getFilterOperationDescriptions(): FilterOperationDescriptions {
    return {
      between: this.option('filterBuilder.filterOperationDescriptions.between') ?? messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
      equal: this.option('filterBuilder.filterOperationDescriptions.equal') ?? messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
      notEqual: this.option('filterBuilder.filterOperationDescriptions.notEqual') ?? messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
      lessThan: this.option('filterBuilder.filterOperationDescriptions.lessThan') ?? messageLocalization.format('dxFilterBuilder-filterOperationLess'),
      lessThanOrEqual: this.option('filterBuilder.filterOperationDescriptions.lessThanOrEqual') ?? messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
      greaterThan: this.option('filterBuilder.filterOperationDescriptions.greaterThan') ?? messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
      greaterThanOrEqual: this.option('filterBuilder.filterOperationDescriptions.greaterThanOrEqual') ?? messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
      startsWith: this.option('filterBuilder.filterOperationDescriptions.startsWith') ?? messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
      contains: this.option('filterBuilder.filterOperationDescriptions.contains') ?? messageLocalization.format('dxFilterBuilder-filterOperationContains'),
      notContains: this.option('filterBuilder.filterOperationDescriptions.notContains') ?? messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
      endsWith: this.option('filterBuilder.filterOperationDescriptions.endsWith') ?? messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
      isBlank: this.option('filterBuilder.filterOperationDescriptions.isBlank') ?? messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
      isNotBlank: this.option('filterBuilder.filterOperationDescriptions.isNotBlank') ?? messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
    };
  }

  private getConditionText(
    filterValue: Condition,
    options: FilterTextOptions,
  ): DeferredObj<string> {
    const operation = filterValue[1];
    const deferred = Deferred<string>();
    // @ts-expect-error the grid CustomOperation[] does not match FilterCustomOperation[]
    const customOperation = getCustomOperation(options.customOperations, operation);
    // @ts-expect-error the grid FilterField does not match FilterBuilderField
    const field = getField(filterValue[0], options.columns);
    const fieldText = field.caption ?? '';
    const value = filterValue[2];
    const filterOperationDescriptions = this.getFilterOperationDescriptions();

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let operationText: string;

    if (customOperation) {
      operationText = customOperation.caption || inflector.captionize(customOperation.name);
    } else if (value === null) {
      operationText = getCaptionByOperation(operation === '=' ? 'isblank' : 'isnotblank', filterOperationDescriptions);
    } else {
      operationText = getCaptionByOperation(operation, filterOperationDescriptions);
    }
    this._getValueText(field, customOperation, value).done((valueText) => {
      deferred.resolve(this._getConditionText(fieldText, operationText, valueText));
    });
    return deferred;
  }

  private getGroupText(
    filterValue: Criteria,
    options: FilterTextOptions,
    isInnerGroup?: boolean,
  ): DeferredObj<string> {
    const result = Deferred<string>();
    const textParts: DeferredObj<string>[] = [];
    const groupValue = getGroupValue(filterValue);

    filterValue.forEach((item) => {
      if (isCondition(item)) {
        textParts.push(this.getConditionText(item, options));
      } else if (isGroup(item)) {
        textParts.push(this.getGroupText(item, options, true));
      }
    });

    when.apply(this, textParts).done((...args) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
      let text: string;
      if (groupValue.startsWith('!')) {
        const groupText = options.groupOperationDescriptions[`not${groupValue.substring(1, 2).toUpperCase()}${groupValue.substring(2)}`].split(' ');
        text = `${groupText[0]} ${args[0]}`;
      } else {
        text = args.join(` ${options.groupOperationDescriptions[groupValue]} `);
      }
      if (isInnerGroup) {
        text = `(${text})`;
      }
      result.resolve(text);
    });
    return result;
  }

  public getFilterText(
    filterValue: FilterValueExpression,
    customOperations: CustomOperation[],
  ): DeferredObj<string> {
    const options: FilterTextOptions = {
      customOperations,
      columns: this._columnsController.getFilteringColumns(),
      filterOperationDescriptions: this.getFilterOperationDescriptions(),
      groupOperationDescriptions: {
        and: this.option('filterBuilder.groupOperationDescriptions.and') ?? messageLocalization.format('dxFilterBuilder-and'),
        or: this.option('filterBuilder.groupOperationDescriptions.or') ?? messageLocalization.format('dxFilterBuilder-or'),
        notAnd: this.option('filterBuilder.groupOperationDescriptions.notAnd') ?? messageLocalization.format('dxFilterBuilder-notAnd'),
        notOr: this.option('filterBuilder.groupOperationDescriptions.notOr') ?? messageLocalization.format('dxFilterBuilder-notOr'),
      },
    };
    return isCondition(filterValue)
      ? this.getConditionText(filterValue, options)
      : this.getGroupText(filterValue, options);
  }
}

const data = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class FilterPanelDataControllerExtender extends Base {
  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'filterPanel':
        this.applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
};

export const filterPanelModule = {
  defaultOptions(): Pick<InternalGridOptions, 'filterPanel'> {
    return {
      filterPanel: {
        visible: false,
        filterEnabled: true,
      },
    };
  },
  views: {
    filterPanelView: FilterPanelView,
  },
  extenders: {
    controllers: {
      data,
    },
  },
};

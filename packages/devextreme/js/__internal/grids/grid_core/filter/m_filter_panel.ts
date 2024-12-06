/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import CheckBox from '@js/ui/check_box';
import inflector from '@ts/core/utils/m_inflector';
import {
  getCaptionByOperation, getCurrentLookupValueText, getCurrentValueText,
  getCustomOperation, getField, getGroupValue, isCondition, isGroup,
} from '@ts/filter_builder/m_utils';
import type { FilterSyncController } from '@ts/grids/grid_core/filter/m_filter_sync';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { registerKeyboardAction } from '../m_accessibility';
import modules from '../m_modules';
import type { ModuleType } from '../m_types';
import gridUtils from '../m_utils';

const FILTER_PANEL_CLASS = 'filter-panel';
const FILTER_PANEL_TEXT_CLASS = `${FILTER_PANEL_CLASS}-text`;
const FILTER_PANEL_CHECKBOX_CLASS = `${FILTER_PANEL_CLASS}-checkbox`;
const FILTER_PANEL_CLEAR_FILTER_CLASS = `${FILTER_PANEL_CLASS}-clear-filter`;
const FILTER_PANEL_LEFT_CONTAINER = `${FILTER_PANEL_CLASS}-left`;

const FILTER_PANEL_TARGET = 'filterPanel';

export class FilterPanelView extends modules.View {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _filterSyncController!: FilterSyncController;

  private readonly _filterValueBuffer: any;

  public init() {
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._filterSyncController = this.getController('filterSync');

    this._dataController.dataSourceChanged.add(() => this.render());
  }

  public isVisible() {
    return this.option('filterPanel.visible') && this._dataController.dataSource();
  }

  protected _renderCore() {
    const $element = this.element();

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

  private _renderFilterBuilderText($element: dxElementWrapper, $leftContainer: dxElementWrapper): void {
    const $filterElement = this._getFilterElement();
    const $textElement = this._getTextElement();

    if (this.option('filterValue') || this._filterValueBuffer) {
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

  private _getCheckElement() {
    const that = this;
    const $element = $('<div>')
      .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

    that._createComponent($element, CheckBox, {
      value: that.option('filterPanel.filterEnabled'),
      onValueChanged(e) {
        that.option('filterPanel.filterEnabled', e.value);
      },
    });
    $element.attr('title', this.option('filterPanel.texts.filterEnabledHint')!);
    return $element;
  }

  private _getFilterElement() {
    const that = this;
    const $element = $('<div>').addClass('dx-icon-filter');

    eventsEngine.on($element, 'click', () => that._showFilterBuilder());

    registerKeyboardAction('filterPanel', that, $element, undefined, () => that._showFilterBuilder());

    that._addTabIndexToElement($element);

    return $element;
  }

  private _getTextElement() {
    const that = this;
    const $textElement = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
    let filterText;
    const filterValue = that.option('filterValue');
    if (filterValue) {
      when(that.getFilterText(filterValue, this._filterSyncController.getCustomFilterOperations())).done((filterText) => {
        const customizeText = that.option('filterPanel.customizeText');
        if (customizeText) {
          const customText = customizeText({
            component: that.component,
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
      filterText = that.option('filterPanel.texts.createFilter');
      $textElement.text(filterText);
    }

    eventsEngine.on($textElement, 'click', () => that._showFilterBuilder());

    registerKeyboardAction('filterPanel', that, $textElement, undefined, () => that._showFilterBuilder());

    that._addTabIndexToElement($textElement);

    return $textElement;
  }

  private _showFilterBuilder() {
    this.option('filterBuilderPopup.visible', true);
  }

  private _getRemoveButtonElement() {
    const that = this;
    // @ts-expect-error
    const clearFilterValue = () => that.option('filterValue', null);
    const $element = $('<div>')
      .addClass(that.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
      .text(that.option('filterPanel.texts.clearFilter')!);

    eventsEngine.on($element, 'click', clearFilterValue);

    registerKeyboardAction('filterPanel', this, $element, undefined, clearFilterValue);

    that._addTabIndexToElement($element);

    return $element;
  }

  private _addTabIndexToElement($element) {
    if (!this.option('useLegacyKeyboardNavigation')) {
      const tabindex = this.option('tabindex') || 0;
      $element.attr('tabindex', tabindex);
    }
  }

  public optionChanged(args) {
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

  private _getConditionText(fieldText, operationText, valueText) {
    let result = `[${fieldText}] ${operationText}`;
    if (isDefined(valueText)) {
      result += valueText;
    }
    return result;
  }

  private _getValueMaskedText(value) {
    return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
  }

  private _getValueText(field, customOperation, value) {
    // @ts-expect-error
    const deferred = new Deferred();
    const hasCustomOperation = customOperation && customOperation.customizeText;
    if (isDefined(value) || hasCustomOperation) {
      if (!hasCustomOperation && field.lookup) {
        getCurrentLookupValueText(field, value, (data) => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      } else {
        const displayValue = Array.isArray(value) ? value : gridUtils.getDisplayValue(field, value, null);
        when(getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done((data) => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      }
    } else {
      deferred.resolve('');
    }
    return deferred.promise();
  }

  private getConditionText(filterValue, options) {
    const that = this;
    const operation = filterValue[1];
    // @ts-expect-error
    const deferred = new Deferred();
    const customOperation = getCustomOperation(options.customOperations, operation);
    let operationText;
    const field = getField(filterValue[0], options.columns);
    const fieldText = field.caption || '';
    const value = filterValue[2];

    if (customOperation) {
      operationText = customOperation.caption || inflector.captionize(customOperation.name);
    } else if (value === null) {
      operationText = getCaptionByOperation(operation === '=' ? 'isblank' : 'isnotblank', options.filterOperationDescriptions);
    } else {
      operationText = getCaptionByOperation(operation, options.filterOperationDescriptions);
    }
    this._getValueText(field, customOperation, value).done((valueText) => {
      deferred.resolve(that._getConditionText(fieldText, operationText, valueText));
    });
    return deferred;
  }

  private getGroupText(filterValue, options, isInnerGroup?) {
    const that = this;
    // @ts-expect-error
    const result = new Deferred();
    const textParts: string[] = [];
    const groupValue = getGroupValue(filterValue);

    filterValue.forEach((item) => {
      if (isCondition(item)) {
        textParts.push(that.getConditionText(item, options));
      } else if (isGroup(item)) {
        textParts.push(that.getGroupText(item, options, true));
      }
    });

    when.apply(this, textParts).done((...args) => {
      let text;
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

  private getFilterText(filterValue, customOperations) {
    const options = {
      customOperations,
      columns: this._columnsController.getFilteringColumns(),
      filterOperationDescriptions: this.option('filterBuilder.filterOperationDescriptions'),
      groupOperationDescriptions: this.option('filterBuilder.groupOperationDescriptions'),
    };
    return isCondition(filterValue) ? this.getConditionText(filterValue, options) : this.getGroupText(filterValue, options);
  }
}

const data = (Base: ModuleType<DataController>) => class FilterPanelDataControllerExtender extends Base {
  public optionChanged(args) {
    switch (args.name) {
      case 'filterPanel':
        this._applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
};

export const filterPanelModule = {
  defaultOptions() {
    return {
      filterPanel: {
        visible: false,
        filterEnabled: true,
        texts: {
          createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),
          clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),
          filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint'),
        },
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

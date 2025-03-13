/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import { isDefined } from '@js/core/utils/type';
import inflector from '@ts/core/utils/m_inflector';
import {
  getCaptionByOperation, getCurrentLookupValueText, getCurrentValueText,
  getCustomOperation, getField, getGroupValue, isCondition, isGroup,
} from '@ts/filter_builder/m_utils';
import type { FilterSyncController } from '@ts/grids/grid_core/filter/m_filter_sync';
import { render } from 'inferno';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import type { ModuleType } from '../m_types';
import gridUtils from '../m_utils';
import { FilterPanel } from './filter_panel';

const FILTER_PANEL_CLASS = 'filter-panel';

const FILTER_PANEL_TARGET = 'filterPanel';

export class FilterPanelView extends modules.View {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _filterSyncController!: FilterSyncController;

  public init(): void {
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._filterSyncController = this.getController('filterSync');

    this._dataController.dataSourceChanged.add(() => this.render());
  }

  public isVisible(): boolean {
    return !!this.option('filterPanel.visible') && !!this._dataController.dataSource();
  }

  protected async _renderCore(): Promise<void> {
    const $element = this.element();

    $element.addClass(this.addWidgetPrefix(FILTER_PANEL_CLASS));

    const isColumnsDefined = !!this._columnsController.getColumns().length;

    if (!isColumnsDefined) {
      return;
    }

    const hasFilterValue = !!this.option('filterValue');
    const tabIndex = this.option('tabindex') || 0;

    const text = await this._getTextElement();

    render(
      <FilterPanel
        component={this}
        hasFilterValue={hasFilterValue}
        addWidgetPrefix={this.addWidgetPrefix.bind(this)}
        tabIndex={tabIndex}
        text={text}
        showFilterBuilder={() => { this.option('filterBuilderPopup.visible', true); }}
        filterEnabledHint={this.option('filterPanel.texts.filterEnabledHint')!}
        filterEnabled={this.option('filterPanel.filterEnabled')!}
        onFilterEnabledChange={(value: boolean) => this.option('filterPanel.filterEnabled', value)}
        clearFilter={(): void => this.option('filterValue', null as any)}
        clearFilterText={this.option('filterPanel.texts.clearFilter')!}
        createFilterText={this.option('filterPanel.texts.createFilter')!}
      />,
      $element.get(0),
    );
  }

  private async _getTextElement(): Promise<string> {
    const that = this;
    const filterValue = that.option('filterValue');
    if (filterValue) {
      let filterText = await that.getFilterText(
        filterValue,
        this._filterSyncController.getCustomFilterOperations(),
      );
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
      return filterText;
    }
    const filterText = that.option('filterPanel.texts.createFilter');
    return filterText ?? '';
  }

  public optionChanged(args): void {
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

  private _getConditionText(fieldText, operationText, valueText): string {
    let result = `[${fieldText}] ${operationText}`;
    if (isDefined(valueText)) {
      result += valueText;
    }
    return result;
  }

  private _getValueMaskedText(value): string {
    return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
  }

  private async _getValueText(field, customOperation, value): Promise<string> {
    const hasCustomOperation = customOperation && customOperation.customizeText;
    if (isDefined(value) || hasCustomOperation) {
      if (!hasCustomOperation && field.lookup) {
        const data = await new Promise((resolve) => {
          getCurrentLookupValueText(field, value, resolve);
        });

        return this._getValueMaskedText(data);
      }
      const displayValue = Array.isArray(value) ? value : gridUtils.getDisplayValue(field, value, null);
      const data = await getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET);

      return this._getValueMaskedText(data);
    }
    return '';
  }

  private async getConditionText(filterValue, options) {
    const that = this;
    const operation = filterValue[1];
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
    const valueText = await this._getValueText(field, customOperation, value);
    return that._getConditionText(fieldText, operationText, valueText);
  }

  private async getGroupText(filterValue, options, isInnerGroup?) {
    const that = this;
    const textParts: (string | Promise<string>)[] = [];
    const groupValue = getGroupValue(filterValue);

    filterValue.forEach((item) => {
      if (isCondition(item)) {
        textParts.push(that.getConditionText(item, options));
      } else if (isGroup(item)) {
        textParts.push(that.getGroupText(item, options, true));
      }
    });

    const args = await Promise.all(textParts);
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

    return text;
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

  // registerKeyboardAction contract

  public element(): any {
    return this._$element;
  }

  public _createActionByOption(): any {
    return null;
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

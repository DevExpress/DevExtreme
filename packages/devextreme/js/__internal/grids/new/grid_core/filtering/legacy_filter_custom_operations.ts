// NOTE: This code moved from old grid_core/filter/m_filter_custom_operations
import type { DataType } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data/data_source/data_source';
import type { DxElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import errors from '@js/ui/widget/ui.errors';
import type {
  ConditionValue,
  FieldValue,
  FilterBuilderField,
  FilterExpression,
  ValueEditorOptions,
  ValueOperand,
} from '@ts/filter_builder/types';
import {
  getFilterExpression, isCondition, isGroup, renderValueText,
} from '@ts/filter_builder/utils';
import type {
  HeaderFilterCustomizeTextOptions,
  HeaderFilterTextItem,
} from '@ts/grids/grid_core/filter_sync/types';

import type { Column } from '../columns_controller/types';
import type { CompatibilityHeaderFilterController } from './header_filter/compatibility';
import { getHeaderItemText } from './header_filter/legacy_header_filter';
import type { HeaderFilterRootOptions } from './header_filter/types';

export interface LegacyCustomOperationConfig {
  columnOption: (columnName: string) => Column | undefined;
  getHeaderFilterOptions: () => HeaderFilterRootOptions;
  getHeaderFilterController: () => CompatibilityHeaderFilterController;
}

interface CustomizeTextFieldInfo {
  value?: FieldValue;
  field: Partial<Pick<Column, 'dataField' | 'calculateDisplayValue'>>;
}

interface HeaderFilterOperation {
  dataTypes: DataType[];
  calculateFilterExpression: (
    filterValue: ValueOperand[],
    field: FilterBuilderField,
    fields?: FilterBuilderField[],
  ) => string | string[];
  editorTemplate: (
    conditionInfo: ValueEditorOptions & { field: FilterBuilderField },
    container: DxElement,
  ) => DxElement;
  customizeText: (
    fieldInfo: CustomizeTextFieldInfo,
    options?: HeaderFilterCustomizeTextOptions,
  ) => DeferredObj<string> | string;
}

interface LegacyCustomOperation extends Omit<HeaderFilterOperation, 'calculateFilterExpression'> {
  name: string;
  icon: string;
  caption: string;
  calculateFilterExpression: (
    filterValue: ValueOperand[],
    field: FilterBuilderField,
    fields?: FilterBuilderField[],
  ) => FilterExpression | null;
}

const baseOperation = (config: LegacyCustomOperationConfig): HeaderFilterOperation => {
  const { getHeaderFilterController } = config;

  const calculateFilterExpression = function calculateFilterExpression(
    filterValue: ValueOperand[],
    field: FilterBuilderField,
    fields?: FilterBuilderField[],
  ): string | string[] {
    const result: string[] = [];
    const lastIndex = filterValue.length - 1;
    if (filterValue) {
      filterValue.forEach((value, index) => {
        if (isCondition(value) || isGroup(value)) {
          // @ts-expect-error fields is optional in the public CustomOperation
          const filterExpression = getFilterExpression(value, fields, [], 'headerFilter');
          // @ts-expect-error getFilterExpression returns an expression, not a string
          result.push(filterExpression);
        } else {
          const filterExpression = getFilterExpression(
            [field.dataField ?? field.name, '=', value],
            // @ts-expect-error fields is optional in the public CustomOperation
            fields,
            [],
            'headerFilter',
          );
          // @ts-expect-error getFilterExpression returns an expression, not a string
          result.push(filterExpression);
        }
        if (index !== lastIndex) {
          result.push('or');
        }
      });
    }
    if (result.length === 1) {
      return result[0];
    }
    return result;
  };

  const getFullText = (itemText: string, parentText: string | null): string => {
    const result = parentText ? `${parentText}/${itemText}` : itemText;
    return result;
  };

  const getSelectedItemsTexts = (
    items: HeaderFilterTextItem[],
    parentText: string | null,
  ): string[] => {
    let result: string[] = [];
    items.forEach((item) => {
      if (item.items) {
        const selectedItemsTexts = getSelectedItemsTexts(
          item.items,
          getFullText(item.text, parentText),
        );
        result = result.concat(selectedItemsTexts);
      }
      if (item.selected) {
        result.push(getFullText(item.text, parentText));
      }
    });
    return result;
  };

  // Override in the private API WA [T1232532]
  const customizeText = (
    fieldInfo: CustomizeTextFieldInfo,
    options?: HeaderFilterCustomizeTextOptions,
  ): DeferredObj<string> | string => {
    const textOptions = options ?? {};
    const headerFilterController = getHeaderFilterController();
    const { value } = fieldInfo;
    // @ts-expect-error TODO: the filter builder passes a field with a dataField
    const column = config.columnOption(fieldInfo.field.dataField);
    const headerFilter = column?.headerFilter;
    // TODO: lookup is not supported in CardView yet
    // @ts-expect-error lookup is not declared in the CardView column type
    const lookup = column?.lookup;
    const values = textOptions.values ?? [value];

    if (!(headerFilter?.dataSource || lookup?.dataSource)) {
      const headerFilterOptions = config.getHeaderFilterOptions();
      return getHeaderItemText(value, column, 0, headerFilterOptions);
    }

    const result = Deferred<string>();
    const itemsDeferred = textOptions.items ?? Deferred();

    if (!textOptions.items) {
      const filterColumn = extend({}, column, { filterType: 'include', filterValues: values });
      const dataSourceOptions = headerFilterController.getDataSource(filterColumn as Column);
      dataSourceOptions.paginate = false;
      const dataSource = new DataSource(dataSourceOptions);
      const key = dataSource.store().key();

      if (key) {
        const { values: optionValues } = textOptions;
        if (optionValues && optionValues.length > 1) {
          const filter = optionValues.reduce<unknown[]>((keyFilter, keyValue) => {
            if (keyFilter.length) {
              keyFilter.push('or');
            }
            keyFilter.push([key, '=', keyValue]);
            return keyFilter;
          }, []);
          dataSource.filter(filter);
        } else {
          dataSource.filter([key, '=', fieldInfo.value]);
        }
      } else if (fieldInfo.field.calculateDisplayValue) {
        errors.log('W1017');
      }

      textOptions.items = itemsDeferred;

      dataSource.load().done((items) => {
        itemsDeferred.resolve(items as HeaderFilterTextItem[]);
      });
    }
    itemsDeferred.done((items) => {
      const index = values.indexOf(fieldInfo.value);
      result.resolve(getSelectedItemsTexts(items, null)[index]);
    });
    return result;
  };

  return {
    dataTypes: ['string', 'date', 'datetime', 'number', 'boolean', 'object'] satisfies DataType[],
    calculateFilterExpression,
    editorTemplate(conditionInfo, container): DxElement {
      const headerFilterController = getHeaderFilterController();
      const div = $('<div>')
        .addClass('dx-filterbuilder-item-value-text')
        .appendTo(container);

      const originalColumn = config.columnOption(conditionInfo.field.dataField);
      const column = extend(true, {}, originalColumn) as Column;

      renderValueText(div, conditionInfo.text?.split('|'));

      const setValue = function setValue(value: ConditionValue): void {
        conditionInfo.setValue(value);
      };

      column.filterType = 'include';
      // @ts-expect-error the anyof value is always an array
      column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];

      headerFilterController.showHeaderFilterMenuBase({
        // @ts-expect-error the header filter popup takes the renderer wrapper, not an Element
        columnElement: div,
        column,
        customApply(filterValues) {
          setValue(filterValues);
          headerFilterController.hideHeaderFilterMenu();
          conditionInfo.closeEditor();
        },
        onHidden() {
          conditionInfo.closeEditor();
        },
        isFilterBuilder: true,
      });
      return container;
    },
    customizeText,
  };
};

export function anyOf(config: LegacyCustomOperationConfig): LegacyCustomOperation {
  return extend(baseOperation(config), {
    name: 'anyof',
    icon: 'selectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationAnyOf'),
  });
}

export function noneOf(config: LegacyCustomOperationConfig): LegacyCustomOperation {
  const baseOp = baseOperation(config);
  return extend({}, baseOp, {
    calculateFilterExpression(
      filterValue: ValueOperand[],
      field: FilterBuilderField,
      fields?: FilterBuilderField[],
    ): FilterExpression | null {
      const baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;

      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationNoneOf'),
  });
}

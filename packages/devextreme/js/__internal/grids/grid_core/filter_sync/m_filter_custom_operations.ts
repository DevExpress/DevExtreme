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
  ConditionValue, FilterBuilderField, FilterCustomOperation, ValueOperand,
} from '@ts/filter_builder/types';
import {
  getFilterExpression, isCondition, isGroup, renderValueText,
} from '@ts/filter_builder/utils';
import type { InternalGrid } from '@ts/grids/grid_core/types';

import type {
  HeaderFilterCustomizeTextOptions,
  HeaderFilterFieldInfo,
  HeaderFilterOperation,
  HeaderFilterTextItem,
} from './types';

function baseOperation(grid: InternalGrid): HeaderFilterOperation {
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
            [field.dataField, '=', value],
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

  const getFullText = function getFullText(itemText: string, parentText: string | null): string {
    return parentText ? `${parentText}/${itemText}` : itemText;
  };

  const getSelectedItemsTexts = function getSelectedItemsTexts(
    items: HeaderFilterTextItem[],
    parentText: string | null,
  ): string[] {
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

  const headerFilterController = grid?.getController('headerFilter');
  // Override in the private API WA [T1232532]
  const customizeText = function customizeText(
    fieldInfo: HeaderFilterFieldInfo,
    options?: HeaderFilterCustomizeTextOptions,
  ): DeferredObj<string> | string {
    const textOptions = options ?? {};
    const { value } = fieldInfo;
    let column = grid.columnOption(fieldInfo.field.dataField);
    const headerFilter = column?.headerFilter;
    const lookup = column?.lookup;
    const values = textOptions.values ?? [value];

    if (!(headerFilter?.dataSource || lookup?.dataSource)) {
      const text = headerFilterController.getHeaderItemText(
        value,
        column,
        0,
        grid.option('headerFilter'),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped getHeaderItemText
      return text;
    }

    const result = Deferred<string>();
    const itemsDeferred = textOptions.items ?? Deferred();

    if (!textOptions.items) {
      column = extend({}, column, { filterType: 'include', filterValues: values });
      const dataSourceOptions = headerFilterController.getDataSource(column);
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
      const div = $('<div>')
        .addClass('dx-filterbuilder-item-value-text')
        .appendTo(container);
      const column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));

      renderValueText(div, conditionInfo.text && conditionInfo.text.split('|'));

      const setValue = function setValue(value: ConditionValue): void {
        conditionInfo.setValue(value);
      };

      column.filterType = 'include';
      // @ts-expect-error the anyof value is always an array
      column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];

      headerFilterController.showHeaderFilterMenuBase({
        columnElement: div,
        column,
        apply() {
          setValue(this.filterValues);
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
}

export function anyOf(grid: InternalGrid): FilterCustomOperation {
  // @ts-expect-error customizeText takes a grid column field, not FieldInfo.field
  return extend(baseOperation(grid), {
    name: 'anyof',
    icon: 'selectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationAnyOf'),
  });
}

export function noneOf(grid: InternalGrid): FilterCustomOperation {
  const baseOp = baseOperation(grid);
  // @ts-expect-error customizeText takes a grid column field, not FieldInfo.field
  return extend({}, baseOp, {
    calculateFilterExpression(filterValue, field, fields?) {
      const baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;

      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationNoneOf'),
  });
}

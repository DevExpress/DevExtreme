import Color from '@js/color';
import type { SmartPasteCommandResult } from '@js/common/ai-integration';
import { isObject } from '@js/core/utils/type';
import type { FormItemComponent, SimpleItem } from '@js/ui/form';
import errors from '@js/ui/widget/ui.errors';
import { dateUtilsTs } from '@ts/core/utils/date';

const getEditorTypeInfo = (editorType: FormItemComponent | undefined): string => {
  switch (editorType) {
    case 'dxDateBox':
    case 'dxCalendar':
      return 'date in ISO format';
    case 'dxDateRangeBox':
      return 'date range in ISO format, use pattern {start}:::{end}';
    case 'dxColorBox':
      return 'color in hex format';
    case 'dxCheckBox':
    case 'dxSwitch':
      return 'boolean value, true or false';
    case 'dxNumberBox':
    case 'dxSlider':
      return 'numeric value';
    case 'dxRangeSlider':
      return 'numeric range, use pattern {start}:::{end}';
    default:
      return 'text';
  }
};

export const parseResultForEditorType = (
  dataField: string,
  editorType: FormItemComponent | undefined,
  value: SmartPasteCommandResult[number]['value'],
): string | string[] | boolean => {
  const errorValue = Array.isArray(value) ? `[${value}]` : `'${value}'`;
  switch (editorType) {
    case 'dxDateBox':
    case 'dxCalendar':
      if (!dateUtilsTs.isValidDate(value)) {
        throw errors.Error('E1064', dataField, errorValue, 'date');
      }

      return value;
    case 'dxDateRangeBox':
      if (
        !Array.isArray(value)
        || value.length !== 2
        || !dateUtilsTs.isValidDate(value[0])
        || !dateUtilsTs.isValidDate(value[1])
      ) {
        throw errors.Error('E1064', dataField, errorValue, 'date range');
      }

      return value;
    case 'dxColorBox':
      if (new Color(value).colorIsInvalid) {
        throw errors.Error('E1064', dataField, errorValue, 'color');
      }
      return value;
    case 'dxCheckBox':
    case 'dxSwitch':
      if (value === 'false') {
        return false;
      }
      if (value === 'true') {
        return true;
      }
      throw errors.Error('E1064', dataField, errorValue, 'boolean');
    case 'dxNumberBox':
    case 'dxSlider':
      if (Array.isArray(value) || isNaN(parseFloat(value))) {
        throw errors.Error('E1064', dataField, errorValue, 'number');
      }
      return value;
    case 'dxRangeSlider':
      if (
        !Array.isArray(value)
        || value.length !== 2
        || isNaN(parseFloat(value[0]))
        || isNaN(parseFloat(value[1]))
      ) {
        throw errors.Error('E1064', dataField, errorValue, 'number range');
      }
      return value;
    case 'dxHtmlEditor':
      if (Array.isArray(value)) {
        throw errors.Error('E1064', dataField, errorValue, 'string');
      }
      return value;
    default:
      return value;
  }
};

const getItemsAcceptedValuesInfo = (editorOptions: SimpleItem['editorOptions']): string => {
  if (!editorOptions?.items) {
    return '';
  }

  const items = editorOptions.items.map((item: { text?: string } | string) => {
    if (isObject(item)) {
      return item.text;
    }

    return item;
  });

  const acceptedValues = `, accepted values: ${items.join(', ')}, split values with :::`;
  const customItemsAllowed = editorOptions?.acceptCustomValue ? ' (custom values are allowed)' : '';

  return `${acceptedValues}${customItemsAllowed}`;
};

export const getItemFormatInfo = ({ editorType, editorOptions }: SimpleItem): string => {
  const dataType = getEditorTypeInfo(editorType);
  const acceptedValues = getItemsAcceptedValuesInfo(editorOptions);

  return `${dataType}${acceptedValues}`;
};

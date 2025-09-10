import Color from '@js/color';
import type { SmartPasteCommandResult } from '@js/common/ai-integration';
import { isObject } from '@js/core/utils/type';
import type { FormItemComponent, SimpleItem } from '@js/ui/form';
import errors from '@js/ui/widget/ui.errors';
import { dateUtilsTs } from '@ts/core/utils/date';

export type ParsedAIValue = string | string[] | boolean;

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
): ParsedAIValue => {
  let normalizedValue = value;
  if (Array.isArray(value)) {
    normalizedValue = value.map((v) => v.trim());
  } else {
    normalizedValue = value.trim();
  }

  const errorValue = JSON.stringify(normalizedValue);
  switch (editorType) {
    case 'dxDateBox':
    case 'dxCalendar':
      if (!dateUtilsTs.isValidDate(normalizedValue)) {
        throw errors.Error('E1064', dataField, errorValue, 'date');
      }

      return normalizedValue;
    case 'dxDateRangeBox':
      if (
        !Array.isArray(normalizedValue)
        || normalizedValue.length > 2
        || normalizedValue.some((item) => !dateUtilsTs.isValidDate(item))
      ) {
        throw errors.Error('E1064', dataField, errorValue, 'date range');
      }

      return normalizedValue;
    case 'dxColorBox':
      if (new Color(normalizedValue).colorIsInvalid) {
        throw errors.Error('E1064', dataField, errorValue, 'color');
      }
      return normalizedValue;
    case 'dxCheckBox':
    case 'dxSwitch':
      if (normalizedValue === 'false') {
        return false;
      }
      if (normalizedValue === 'true') {
        return true;
      }
      throw errors.Error('E1064', dataField, errorValue, 'boolean');
    case 'dxNumberBox':
    case 'dxSlider':
      if (Array.isArray(normalizedValue) || isNaN(parseFloat(normalizedValue))) {
        throw errors.Error('E1064', dataField, errorValue, 'number');
      }
      return normalizedValue;
    case 'dxRangeSlider':
      if (
        !Array.isArray(normalizedValue)
        || normalizedValue.length > 2
        || normalizedValue.some((item) => isNaN(parseFloat(item)))
      ) {
        throw errors.Error('E1064', dataField, errorValue, 'number range');
      }
      return normalizedValue;
    case 'dxHtmlEditor':
      if (Array.isArray(normalizedValue)) {
        throw errors.Error('E1064', dataField, errorValue, 'string');
      }
      return normalizedValue;
    default:
      return normalizedValue;
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

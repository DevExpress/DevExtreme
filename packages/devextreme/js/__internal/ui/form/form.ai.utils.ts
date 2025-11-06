import type {
  SmartPasteFieldType,
} from '@js/common/ai-integration';
import { isObject } from '@js/core/utils/type';
import type { FormItemComponent, SimpleItem } from '@js/ui/form';

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

export const getFieldType = (
  editorType: FormItemComponent | undefined,
): SmartPasteFieldType => {
  switch (editorType) {
    case 'dxDateBox':
    case 'dxCalendar':
      return 'date';
    case 'dxDateRangeBox':
      return 'dateRange';
    case 'dxCheckBox':
    case 'dxSwitch':
      return 'boolean';
    case 'dxNumberBox':
    case 'dxSlider':
      return 'number';
    case 'dxRangeSlider':
      return 'numberRange';
    case 'dxColorBox':
      return 'color';
    default:
      return 'string';
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

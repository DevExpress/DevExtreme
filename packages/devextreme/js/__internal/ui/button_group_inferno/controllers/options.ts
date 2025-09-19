import type { Properties } from '@js/ui/button_group';

export type Options = Properties;

export const defaultOptions: Options = {
  hoverStateEnabled: true,
  focusStateEnabled: true,
  selectionMode: 'single',
  selectedItems: [],
  selectedItemKeys: [],
  stylingMode: 'contained',
  keyExpr: 'text',
  items: [],
  buttonTemplate: 'content',
  // @ts-expect-error
  onSelectionChanged: null,
  // @ts-expect-error
  onItemClick: null,
};

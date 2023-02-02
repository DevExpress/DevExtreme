import { DomOptions } from './types';

export const DOM_CSS_CLASSES = {
  focus: '-dx-focus',
  hover: '-dx-hover',
  active: '-dx-active',
} as const;

export const DOM_ATTRIBUTES = {
  tabIndex: 'tabIndex',
  disabled: 'disabled',
  accessKey: 'accessKey',
  title: 'title',
} as const;

export const DEFAULT_DOM_OPTIONS: DomOptions = {
  accessKey: {
    shortcutKey: undefined,
  },
  active: {
    activeStateEnabled: true,
  },
  attributes: {
    attributes: {},
  },
  disabled: {
    disabled: false,
  },
  focus: {
    focusStateEnabled: true,
    tabIndex: 0,
  },
  hint: {
    hint: undefined,
  },
  hover: {
    hoverStateEnabled: true,
  },
};

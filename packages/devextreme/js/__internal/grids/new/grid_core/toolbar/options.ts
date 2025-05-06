import type { ToolbarProps } from './types';

export interface Options {
  toolbar?: ToolbarProps;
}

export const defaultOptions = {
  toolbar: {
    multiline: false,
    disabled: false,
  },
} satisfies Options;

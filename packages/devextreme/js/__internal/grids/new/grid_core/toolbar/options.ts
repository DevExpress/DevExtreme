import type { ToolbarProps } from './types';

export interface Options {
  toolbar?: ToolbarProps;
}

export const defaultOptions = {
  toolbar: {},
} satisfies Options;

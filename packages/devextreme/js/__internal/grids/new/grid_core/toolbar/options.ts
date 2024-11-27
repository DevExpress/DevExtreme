import type { ToolbarItem } from './types';

export interface Options {
  toolbar?: {
    items?: ToolbarItem[];

    visible?: boolean;

    disabled?: boolean;
  };

  onToolbarPreparing?: unknown;
}

export const defaultOptions = {
  toolbar: {
    // TODO: set to undefined
    visible: true,
  },
} satisfies Options;

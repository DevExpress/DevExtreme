import type { SelectedCardKeys, SelectionOptions } from './types';

export interface Options {
  selectedCardKeys?: SelectedCardKeys;
  selection?: SelectionOptions;
}

export const defaultOptions: Options = {
  selectedCardKeys: [],
  selection: {
    mode: 'none',
  },
};

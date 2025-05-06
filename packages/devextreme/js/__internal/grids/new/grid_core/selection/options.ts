import type {
  SelectedCardKeys,
  SelectionChangedEvent,
  SelectionChangingEvent,
  SelectionOptions,
} from './types';

export interface Options {
  selectedCardKeys?: SelectedCardKeys;
  selection?: SelectionOptions;
  onSelectionChanging?: ((e: SelectionChangingEvent) => void);
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);
}

export const defaultOptions: Options = {
  selectedCardKeys: [],
  selection: {
    mode: 'none',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'allPages',
  },
};

import type { Options as FilterPanelOptions } from './filter_panel/options';

export { defaultOptions } from './filter_panel/options';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Options {
  filterValue?: any;
}

export type FilterOptions = Options & FilterPanelOptions;

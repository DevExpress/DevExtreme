import type { HeaderFilterRootOptions } from './types';

export interface Options {
  // general header filter options.
  headerFilter?: HeaderFilterRootOptions;
}

export const defaultOptions: Options = {
  headerFilter: {
    visible: false,
    width: 252,
    height: 325,
    allowSelectAll: true,
    search: {
      enabled: false,
      timeout: 500,
      mode: 'contains',
      editorOptions: {},
    },
    texts: {
      emptyValue: undefined,
      ok: undefined,
      cancel: undefined,
    },
  },
};

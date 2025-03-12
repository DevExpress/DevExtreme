import type { DataControllerOptions } from '@js/ui/card_view';

export type {
  DataControllerOptions as Options,
};

export const defaultOptions = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0,
  },
  remoteOperations: 'auto',
} satisfies DataControllerOptions;

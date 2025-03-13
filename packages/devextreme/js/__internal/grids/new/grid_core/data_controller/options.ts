import type { DataControllerOptions as Options } from '@js/ui/card_view';

export type {
  Options,
};

export const defaultOptions = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0,
  },
  remoteOperations: 'auto',
} satisfies Options;

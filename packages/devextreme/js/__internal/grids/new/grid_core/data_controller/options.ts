import type { DataControllerConfiguration as PublicOptions, dxCardViewOptions } from '@js/ui/card_view';

export type Options = PublicOptions & Pick<dxCardViewOptions, 'onDataErrorOccurred'>;

export const defaultOptions = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0,
  },
  remoteOperations: 'auto',
} satisfies Options;

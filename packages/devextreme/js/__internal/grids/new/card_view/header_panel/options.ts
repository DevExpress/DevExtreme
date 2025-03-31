import type { HeaderPanelConfiguration as Options } from '@js/ui/card_view';

export type { Options };

export type DraggingOptions = Required<Required<Options>['headerPanel']['dragging']>;

export const defaultOptions = {
  headerPanel: {
    visible: true,
  },
} satisfies Options;

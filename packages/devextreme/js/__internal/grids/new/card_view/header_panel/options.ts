import type { HeaderPanelDraggingOptions as DraggingOptions, HeaderPanelOptions as Options } from '@js/ui/card_view';

export type { DraggingOptions, Options };

export const defaultOptions = {
  headerPanel: {
    visible: true,
  },
} satisfies Options;

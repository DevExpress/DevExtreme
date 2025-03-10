import type * as Sortable from '@js/ui/sortable';

import type { Column } from '../../grid_core/columns_controller/types';
import type { Template } from '../../grid_core/types';

type SortableProperties = 'dropFeedbackMode' | 'scrollSpeed' | 'scrollSensitivity' | 'onDragChange' | 'onDragEnd' | 'onDragMove' | 'onDragStart' | 'onRemove' | 'onReorder';

export type DraggingOptions = Pick<Sortable.Properties, SortableProperties>;
export interface Options {
  headerPanel?: {
    dragging?: DraggingOptions;
    visible?: boolean;
    itemTemplate?: Template<{ column: Column }>;
    itemCssClass?: string;
  };
}

export const defaultOptions = {
  headerPanel: {
    visible: true,
  },
} satisfies Options;

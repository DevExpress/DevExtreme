/* eslint-disable @typescript-eslint/ban-types */
import type * as Sortable from '@js/ui/sortable';

import type { Template } from '../../grid_core/types';

type SortableProperties = 'dropFeedbackMode' | 'scrollSpeed' | 'scrollSensitivity' | 'onDragChange' | 'onDragEnd' | 'onDragMove' | 'onDragStart' | 'onRemove' | 'onReorder';

export interface Options {
  headerPanel?: Pick<Sortable.Properties, SortableProperties>;
}

export const defaultOptions = {
} satisfies Options;

export interface ColumnOptions {
  headerItemTemplate?: Template<{}>;
}

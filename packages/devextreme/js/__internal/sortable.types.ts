import type { AnimationConfig } from '@js/common/core/animation';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type dxSortable from '@js/ui/sortable';
import type { Properties } from '@js/ui/sortable';

import type { DragEventArgs, DraggableBaseProperties, DragStartArgs } from './draggable.types';

export interface ItemPoint {
  dropInsideItem: boolean;
  index: number;
  isValid: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  $item: dxElementWrapper;
}

export interface AnimateConfig {
  to?: { left?: number; top?: number };
  duration?: number;
  easing?: string;
}

export interface SourceScrollableInfo {
  element: dxElementWrapper;
  scrollLeft: number;
  scrollTop: number;
}

export type SortableEventArgs = DragEventArgs & {
  fromIndex: number | null;
  toIndex: number | null;
  dropInsideItem: boolean;
  promise?: DeferredObj<unknown> | PromiseLike<void>;
};

export type PlaceholderPreparedArgs = SortableEventArgs & {
  placeholderElement: DxElement;
  dragElement: DxElement;
};

export type SortableDragStartArgs = DragStartArgs & {
  fromIndex: number;
};

export interface OptionChangedToIndexArgs {
  value: number | null;
  previousValue?: number | null;
  fullUpdate?: boolean;
}

export interface SortableProperties extends DraggableBaseProperties<dxSortable> {
  dragTemplate?: Properties['dragTemplate'];

  dropFeedbackMode?: Properties['dropFeedbackMode'];

  onAdd?: Properties['onAdd'];

  onDragChange?: Properties['onDragChange'];

  onDragEnd?: Properties['onDragEnd'];

  onDragMove?: Properties['onDragMove'];

  onDragStart?: Properties['onDragStart'];

  onRemove?: Properties['onRemove'];

  onReorder?: Properties['onReorder'];

  placeholderClassName?: string;

  animation: AnimationConfig;

  fromIndex: number | null;

  toIndex: number | null;

  dropInsideItem: boolean;

  itemPoints: ItemPoint[] | null;

  fromIndexOffset: number;

  offset: number;

  autoUpdate: boolean;

  draggableElementSize: number;

  itemOrientation: NonNullable<Properties['itemOrientation']>;

  allowDropInsideItem: boolean;

  allowReordering: boolean;

  moveItemOnDrop: boolean;

  onPlaceholderPrepared?: (e: PlaceholderPreparedArgs) => void;
}

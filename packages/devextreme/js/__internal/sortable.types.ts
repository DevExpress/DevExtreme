import type { AnimationConfig } from '@js/common/core/animation';
import type { DxElement } from '@js/core/element';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Properties } from '@js/ui/sortable';

import type {
  DragActionHandler, DragElementShownArgs, DragEventArgs, DraggableActionArgs,
  DraggableBaseProperties, DragStartArgs,
} from './draggable.types';

interface ItemPointBase {
  dropInsideItem: boolean;
  index: number;
  isValid: boolean;
}

export interface ItemPoint extends ItemPointBase {
  left: number;
  top: number;
  width: number;
  height: number;
  $item: dxElementWrapper;
}

// The only point of a list without visible items: there is no item to take the geometry from
export interface EmptyListPoint extends ItemPointBase {
  left?: undefined;
  top?: undefined;
}

export type AnyItemPoint = ItemPoint | EmptyListPoint;

export interface AnimateConfig {
  to?: Partial<Coordinates>;
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

export interface SortableActionArgs extends DraggableActionArgs {
  onAdd: SortableEventArgs;
  onDragCancel: SortableEventArgs;
  onDragChange: SortableEventArgs;
  onDragEnd: SortableEventArgs;
  onDragEnter: SortableEventArgs;
  onDragLeave: SortableEventArgs;
  onDragMove: SortableEventArgs;
  onDragStart: SortableDragStartArgs;
  onDraggableElementShown: SortableDragStartArgs & DragElementShownArgs;
  onPlaceholderPrepared: PlaceholderPreparedArgs;
  onRemove: SortableEventArgs;
  onReorder: SortableEventArgs;
}

export interface OptionChangedToIndexArgs {
  value: number | null;
  previousValue?: number | null;
  fullUpdate?: boolean;
}

export interface SortableProperties extends DraggableBaseProperties<SortableActionArgs> {
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

  itemPoints: AnyItemPoint[] | null;

  fromIndexOffset: number;

  offset: number;

  autoUpdate: boolean;

  draggableElementSize: number;

  itemOrientation: NonNullable<Properties['itemOrientation']>;

  allowDropInsideItem: boolean;

  allowReordering: boolean;

  moveItemOnDrop: boolean;

  onPlaceholderPrepared?: DragActionHandler<SortableActionArgs['onPlaceholderPrepared']>;
}

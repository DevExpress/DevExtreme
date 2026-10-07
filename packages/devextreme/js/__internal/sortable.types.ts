import type { AnimationConfig } from '@js/common/core/animation';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Properties } from '@js/ui/sortable';

import type { DragEventArgs, DraggableProperties, DragStartArgs } from './draggable.types';

export interface Position {
  left: number;
  top: number;
}

export interface Boundary {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

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
  placeholderElement?: unknown;
  dragElement?: unknown;
};

export type SortableDragStartArgs = DragStartArgs & {
  fromIndex: number;
};

export interface OptionChangedToIndexArgs {
  value: number | null;
  previousValue?: number | null;
  fullUpdate?: boolean;
}

export interface SortableProperties extends Omit<Properties, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  boundary?: DraggableProperties['boundary'];

  component?: unknown;

  contentTemplate?: string | null;

  clone?: boolean;

  itemData?: unknown;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPlaceholderPrepared?: ((e: any) => void) | null;
}

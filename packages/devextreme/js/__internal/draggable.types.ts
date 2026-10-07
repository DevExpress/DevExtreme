import type { Cancelable } from '@js/common/core/events';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DraggableBaseOptions, DragTemplateData, Properties } from '@js/ui/draggable';
import type { EngineEvent } from '@ts/events/core/events_engine';

export type BoundOffset = number | string | { h?: number; v?: number };

export type DragHandler = ((e: never) => void) | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DraggableBaseProperties<TComponent = any> extends Omit<DraggableBaseOptions<TComponent>, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  allowMoveByClick?: boolean;

  boundOffset?: BoundOffset | (() => BoundOffset);

  boundary?: DraggableBaseOptions<TComponent>['boundary'] | dxElementWrapper;

  component?: unknown;

  contentTemplate?: string | null;

  clone?: boolean;

  dragTemplate?: Properties['dragTemplate'];

  filter?: string;

  immediate?: boolean;

  itemData?: unknown;

  onCancelByEsc?: boolean;

  onDragCancel?: DragHandler;

  onDragEnd?: DragHandler;

  onDragEnter?: DragHandler;

  onDragLeave?: DragHandler;

  onDragMove?: DragHandler;

  onDragStart?: DragHandler;

  onDraggableElementShown?: DragHandler;

  onDrop?: DragHandler;
}

export interface DraggableProperties extends Omit<Properties, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  allowMoveByClick?: boolean;

  boundOffset?: BoundOffset | (() => BoundOffset);

  boundary?: Properties['boundary'] | dxElementWrapper;

  component?: unknown;

  contentTemplate?: string | null;

  filter?: string;

  immediate?: boolean;

  itemData?: unknown;

  onCancelByEsc?: boolean;

  onDragCancel?: (e: DragEventArgs) => void;

  onDragEnter?: (e: DragEventArgs) => void;

  onDragLeave?: (e: DragEventArgs) => void;

  onDraggableElementShown?: (e: DragElementShownArgs) => void;

  onDrop?: (e: DragEventArgs) => void;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface Offset {
  left: number;
  top: number;
}

export interface DragEventOffset {
  x: number;
  y: number;
}

export type DragEvent = EngineEvent & Cancelable & {
  target: Element;
  pageX: number;
  pageY: number;
  key?: string;
  originalEvent?: { target?: Element };
  offset?: DragEventOffset;
  maxLeftOffset?: number;
  maxRightOffset?: number;
  maxTopOffset?: number;
  maxBottomOffset?: number;
  _cancelPreventDefault?: boolean;
};

export type DragEventArgs = Cancelable & {
  event: DragEvent;
  itemData: unknown;
  itemElement: DxElement;
  fromComponent: unknown;
  toComponent: unknown;
  fromData: unknown;
  toData: unknown;
};

export type DragStartArgs = Cancelable & {
  event: DragEvent;
  itemData: unknown;
  itemElement: dxElementWrapper;
  fromData: unknown;
};

export type DragElementShownArgs = DragStartArgs & { dragElement: dxElementWrapper };

export type CursorOffset = DraggableBaseOptions<unknown>['cursorOffset'];

export type ElementOffsetOptions = DragStartArgs & {
  dragElement: Element | undefined;
  initialOffset?: Offset | false;
};

export type CursorOffsetCallback = (options: ElementOffsetOptions) => CursorOffset;

export interface BoundOffsetQuad {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface DragTemplateArgs {
  container: DxElement;
  model: DragTemplateData & { fromIndex?: number };
}

export type ActionFn = (args?: object) => void;

export type ScrollOrientation = 'vertical' | 'horizontal';

export interface ScrollableInstance {
  scrollOffset: () => Record<string, number>;
  scrollTo: (position: Record<string, number>) => void;
}

export interface ScrollHelperOwner {
  option: () => { scrollSensitivity: number; scrollSpeed: number };
  _dragMoveEvent?: DragEvent;
  dragMoveHandler: (e: DragEvent) => void;
}

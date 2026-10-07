import type { Cancelable } from '@js/common/core/events';
import type { DxElement } from '@js/core/element';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import type dxDraggable from '@js/ui/draggable';
import type { DraggableBaseOptions, DragTemplateData, Properties } from '@js/ui/draggable';
import type { EngineEvent } from '@ts/events/core/events_engine';
import type { DragMoveData, DragStartData } from '@ts/events/drag';

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

export interface DraggableProperties extends DraggableBaseProperties<dxDraggable> {
  onDragCancel?: (e: DragEventArgs) => void;

  onDragEnd?: Properties['onDragEnd'];

  onDragEnter?: (e: DragEventArgs) => void;

  onDragLeave?: (e: DragEventArgs) => void;

  onDragMove?: Properties['onDragMove'];

  onDragStart?: Properties['onDragStart'];

  onDraggableElementShown?: (e: DragElementShownArgs) => void;

  onDrop?: (e: DragEventArgs) => void;
}

export interface MousePosition {
  x: number;
  y: number;
}

export type DragEvent = EngineEvent & Cancelable & DragStartData & DragMoveData & {
  target: Element;
  pageX: number;
  pageY: number;
  key?: string;
  originalEvent?: { target?: Element };
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
  initialOffset?: Coordinates | false;
};

export type CursorOffsetCallback = (options: ElementOffsetOptions) => CursorOffset;

export interface DragTemplateArgs {
  container: DxElement;
  model: DragTemplateData & { fromIndex?: number };
}

export type ActionFn = (args?: object) => void;

export interface ScrollHelperOwner {
  option: () => { scrollSensitivity: number; scrollSpeed: number };
  _dragMoveEvent?: DragEvent;
  dragMoveHandler: (e: DragEvent) => void;
}

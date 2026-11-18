import type { Cancelable } from '@js/common/core/events';
import type DOMComponent from '@js/core/dom_component';
import type { DxElement } from '@js/core/element';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import type { DraggableBaseOptions, DragTemplateData, Properties } from '@js/ui/draggable';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type { EngineEvent } from '@ts/events/core/events_engine';
import type { DragMoveData, DragStartData } from '@ts/events/drag';

type BoundOffsetValue = number | string;

interface BoundOffsetAxes {
  h?: BoundOffsetValue;
  v?: BoundOffsetValue;
  x?: BoundOffsetValue;
  y?: BoundOffsetValue;
}

interface BoundOffsetSides {
  left?: BoundOffsetValue;
  top?: BoundOffsetValue;
  right?: BoundOffsetValue;
  bottom?: BoundOffsetValue;
}

export type BoundOffset = number | string | BoundOffsetAxes | BoundOffsetSides;

export interface DraggableBaseProperties<
  TActionArgs extends DraggableActionArgs = DraggableActionArgs,
> extends Omit<DraggableBaseOptions<unknown>, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  allowMoveByClick?: boolean;

  boundOffset?: BoundOffset | (() => BoundOffset);

  boundary?: DraggableBaseOptions<unknown>['boundary'] | dxElementWrapper;

  component?: Pick<DOMComponent, 'element'>;

  contentTemplate?: string | null;

  clone?: boolean;

  dragTemplate?: Properties['dragTemplate'];

  filter?: string;

  immediate?: boolean;

  itemData?: unknown;

  onCancelByEsc?: boolean;

  onDragCancel?: DragActionHandler<TActionArgs['onDragCancel']>;

  onDragEnter?: DragActionHandler<TActionArgs['onDragEnter']>;

  onDragLeave?: DragActionHandler<TActionArgs['onDragLeave']>;

  onDraggableElementShown?: DragActionHandler<TActionArgs['onDraggableElementShown']>;

  onDrop?: DragActionHandler<TActionArgs['onDrop']>;
}

export interface DraggableProperties extends DraggableBaseProperties {
  onDragEnd?: Properties['onDragEnd'];

  onDragMove?: Properties['onDragMove'];

  onDragStart?: Properties['onDragStart'];
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

export interface DraggableActionArgs {
  onDragCancel: DragEventArgs;
  onDragEnd: DragEventArgs;
  onDragEnter: DragEventArgs;
  onDragLeave: DragEventArgs;
  onDragMove: DragEventArgs;
  onDragStart: DragStartArgs;
  onDraggableElementShown: DragElementShownArgs;
  onDrop: DragEventArgs;
}

export type DragAction<TArgs> = (args: TArgs) => void;

// The action adds the component and its element to the arguments it passes to the handler
export type DragActionHandler<TArgs> = (
  e: TArgs & Pick<DefaultActionArgs<unknown>, 'component' | 'element'>,
) => void;

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

export interface ScrollHelperOwner {
  option: () => Pick<DraggableBaseProperties, 'scrollSensitivity' | 'scrollSpeed'>;
  _dragMoveEvent?: DragEvent;
  dragMoveHandler: (e: DragEvent) => void;
}

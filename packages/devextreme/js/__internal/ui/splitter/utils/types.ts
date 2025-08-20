import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type {
  ItemCollapsedEvent, ItemExpandedEvent, Properties, ResizeEndEvent, ResizeEvent, ResizeStartEvent,
} from '@js/ui/splitter';

export interface PaneRestrictions {
  collapsed?: boolean | undefined;
  collapsedSize?: number;
  resizable?: boolean | undefined;
  visible?: boolean | undefined;
  size?: number;
  maxSize?: number;
  minSize?: number;
}

export interface ResizeOffset {
  x?: number;
  y?: number;
}

export interface RenderQueueItem {
  itemContent: dxElementWrapper | Element;
  splitterConfig: Properties;
}

export interface EventMap {
  onResizeStart: ResizeStartEvent;
  onResize: ResizeEvent;
  onResizeEnd: ResizeEndEvent;
}

export interface ResizeHandleEventMap extends EventMap {
  onCollapsePrev: ItemExpandedEvent;
  onCollapseNext: ItemCollapsedEvent;
}

export interface SplitterEventMap extends EventMap {
  onItemExpanded: ItemExpandedEvent;
  onItemCollapsed: ItemCollapsedEvent;
}

export type HandlerMap<T = SplitterEventMap> = {
  [K in keyof T]: (e: Partial<T[K]>) => void;
};

export type InteractionEvent = DxEvent<KeyboardEvent | PointerEvent | MouseEvent | TouchEvent>;
export type ResizeEvents = 'onResize' | 'onResizeStart' | 'onResizeEnd';
export type CollapseEvents = 'onCollapsePrev' | 'onCollapseNext';
export enum CollapseExpandDirection {
  Previous = 'prev',
  Next = 'next',
}

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

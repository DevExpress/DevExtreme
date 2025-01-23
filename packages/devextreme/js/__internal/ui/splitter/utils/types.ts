import type { dxElementWrapper } from '@js/core/renderer';
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
  itemContent: dxElementWrapper;
  splitterConfig: Properties;
}

export interface EventMap {
  onResizeStart: ResizeStartEvent;
  onResize: ResizeEvent;
  onResizeEnd: ResizeEndEvent;
  onItemExpanded: ItemExpandedEvent;
  onItemCollapsed: ItemCollapsedEvent;
  onCollapsePrev: ItemExpandedEvent;
  onCollapseNext: ItemCollapsedEvent;
}

export type HandlerMap = {
  [K in keyof EventMap]: (e: Partial<EventMap[K]>) => void;
};

export type InteractionEvent = KeyboardEvent | PointerEvent | MouseEvent | TouchEvent;
export type ResizeEvents = 'onResize' | 'onResizeStart' | 'onResizeEnd';
export type CollapseEvents = 'onCollapsePrev' | 'onCollapseNext';
export enum CollapseExpandDirection {
  Previous = 'prev',
  Next = 'next',
}

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

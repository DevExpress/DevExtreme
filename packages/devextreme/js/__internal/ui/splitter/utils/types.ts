import type { DragDirection } from '@js/common';
import type {
  ItemCollapsedEvent, ItemExpandedEvent, Properties, ResizeEndEvent, ResizeEvent, ResizeStartEvent,
} from '@js/ui/splitter';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import Widget from '@js/ui/widget/ui.widget';

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
  itemContent: Element;
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

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

export interface ResizeHandleOptions extends WidgetOptions<ResizeHandle> {
  direction?: DragDirection;
  onResize?: ((e: ResizeEvent) => void);
  onResizeEnd?: ((e: ResizeEndEvent) => void);
  onResizeStart?: ((e: ResizeStartEvent) => void);
  resizable?: boolean;
  showCollapsePrev?: boolean;
  showCollapseNext?: boolean;
  onCollapsePrev?: ((e: ItemCollapsedEvent) => void);
  onCollapseNext?: ((e: ItemExpandedEvent) => void);
  separatorSize?: number;
}

export default class ResizeHandle extends Widget<ResizeHandleOptions> { }

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

export type ResizeEvents = 'onResize' | 'onResizeStart' | 'onResizeEnd';
export type CollapseEvents = 'onCollapsePrev' | 'onCollapseNext';

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

export interface PaneRestrictions {
  collapsed?: boolean | undefined;
  resizable?: boolean | undefined;
  visible?: boolean | undefined;
  size?: number | undefined;
  maxSize?: number | undefined;
  minSize?: number | undefined;
}

export interface ResizeOffset {
  x?: number;
  y?: number;
}

export type ResizeEvents = 'onResize' | 'onResizeStart' | 'onResizeEnd';
export type CollapseEvents = 'onCollapsePrev' | 'onCollapseNext';

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

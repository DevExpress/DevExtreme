export interface PaneRestrictions {
  collapsed?: boolean | undefined;
  visible?: boolean | undefined;
  size?: number | undefined;
  maxSize?: number | undefined;
  minSize?: number | undefined;
}

export type ResizeEvents = 'onResize' | 'onResizeStart' | 'onResizeEnd';

export type FlexProperty = 'flexGrow' | 'flexDirection' | 'flexBasis' | 'flexShrink';

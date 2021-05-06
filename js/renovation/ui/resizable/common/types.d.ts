export interface ResizeActionArgs {
  event: Event;
  width: number;
  height: number;
  handles: {
    top: boolean;
    right: boolean;
    left: boolean;
    bottom: boolean;
  };
}

export interface DragOffset { offset: { x: number; y: number } }
export interface DragTarget { targetElements?: [] }
export type DragEvent = Event & DragOffset;
export type DragStartEvent = Event & DragTarget;

export type AreaProp = (() => Area | HTMLElement) | AreaObject | HTMLElement | Window;
export interface MovingSides {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
}

export type Handle = 'top' | 'right' | 'left' | 'bottom';
export type Corner = 'corner-bottom-right' | 'corner-bottom-left' | 'corner-top-right' | 'corner-top-left';
export interface Area {
  width: number;
  height: number;
  offset: {
    left: number;
    top: number;
  };
}

export interface AreaObject {
  top: number;
  right: number;
  left: number;
  bottom: number;
}

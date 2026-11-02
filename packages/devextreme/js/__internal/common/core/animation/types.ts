import type { PositionConfig } from '@js/common/core/animation';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';

export type PositionTarget = string | EventTarget | dxElementWrapper | null | undefined;

export type CollisionSide = 'left' | 'right' | 'top' | 'bottom' | 'none';

export interface AxisPositionResult {
  location: number;
  flip: boolean;
  fit: boolean;
  oversize: number;
  collisionSide?: CollisionSide;
}

export interface PositionResult {
  h: AxisPositionResult;
  v: AxisPositionResult;
  precise?: boolean;
}

interface AxisPair {
  h?: number;
  v?: number;
}

export interface PositionOptions extends Omit<PositionConfig, 'my' | 'at' | 'of' | 'offset' | 'boundary' | 'boundaryOffset'> {
  my?: PositionConfig['my'] | string;
  at?: PositionConfig['at'] | string;
  of?: PositionTarget | DxEvent | Window;
  offset?: PositionConfig['offset'] | AxisPair;
  boundary?: PositionTarget | Window | 0;
  boundaryOffset?: PositionConfig['boundaryOffset'] | AxisPair;
  precise?: boolean;
  h?: undefined;
  v?: undefined;
}

export interface AxisPositionData {
  mySize: number;
  myAlign: string;
  atAlign: string;
  offset: number;
  collision: string;
  boundaryOffset: number;
  atLocation: number;
  atSize: number;
  myLocation: number;
  oversize: number;
  collisionSide?: CollisionSide;
  fit?: boolean;
  flip?: boolean;
}

export interface AxisBounds {
  min: number;
  max: number;
}

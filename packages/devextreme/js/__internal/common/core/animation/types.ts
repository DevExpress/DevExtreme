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

export interface PositionOptions {
  my?: unknown;
  at?: unknown;
  of?: PositionTarget | DxEvent;
  offset?: unknown;
  collision?: unknown;
  boundary?: PositionTarget | 0;
  boundaryOffset?: unknown;
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

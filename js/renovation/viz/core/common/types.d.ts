export interface Canvas { left?: number; top?: number; right?: number; bottom?: number; width?: number; height?: number }
export interface Size { width?: number; height?: number }
export interface RecalculateCoordinates {
  canvas: Canvas; anchorX: number; anchorY: number;
  size: Size; offset: number; arrowLength: number;
}
export interface Coordinates { x: number; y: number; anchorX: number; anchorY: number }
export interface Margin { top?: number; left?: number; bottom?: number; right?: number }

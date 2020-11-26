export type Canvas = { left: number; top: number; right: number; bottom: number; width: number; height: number };
export type RecalculateCoordinatesFn = { canvas: Canvas; anchorX: number; anchorY: number; x?: number; y?: number;
    size: { width: number; height: number };
    offsetX?: number; offsetY?: number; offset: number; arrowLength: number; };
export type Coordinates = { x: number; y: number; anchorX: number; anchorY: number };
export type Size = {width: number; height: number}
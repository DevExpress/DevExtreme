export type Canvas = { left: number; top: number; right: number; bottom: number; width: number; height: number };
export type RecalculateCoordinates = { 
    canvas: Canvas; anchorX: number; anchorY: number;
    size: { width: number; height: number };
    offset: number; arrowLength: number; 
};
export type Coordinates = { x: number; y: number; anchorX: number; anchorY: number };
export type Size = {width: number; height: number}
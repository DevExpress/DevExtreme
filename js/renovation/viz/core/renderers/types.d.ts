export type PathType = 'line'|'area'|'bezier'|'bezierarea';
export type LineCap = 'square'|'butt'|'round'|'inherit';
export interface Point { x: number; y: number }
export type Segment = [string, number?, number?, number?, number?, number?, number?];
export type LabelAlignment = 'center'|'left'|'right';
export type SharpDirection = 'forward'|'backward';

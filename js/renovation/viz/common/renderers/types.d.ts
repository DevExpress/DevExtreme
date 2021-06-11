export type PathType = 'line' | 'area' | 'bezier' | 'bezierarea';
export type LineCap = 'square' | 'butt' | 'round' | 'inherit';
export interface Point { x: number; y: number }
export type LabelAlignment = 'center' | 'left' | 'right';
export type SharpDirection = 'forward' | 'backward';
export interface ExtraProps { transform?: string; 'stroke-dasharray'?: string }
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Segment = ['M' | 'L' | 'Z' | 'C', number?, number?, number?, number?, number?, number?];

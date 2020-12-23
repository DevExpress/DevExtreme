export type Canvas = { left?: number; top?: number; right?: number; bottom?: number; width?: number; height?: number };
export type Size = { width?: number; height?: number };
export type RecalculateCoordinates = {
  canvas: Canvas; anchorX: number; anchorY: number;
  size: Size; offset: number; arrowLength: number;
};
export type TooltipCoordinates = { x: number; y: number; anchorX: number; anchorY: number };
export type Margin = { top?: number; left?: number; bottom?: number; right?: number };
export type InitialBorder = { color: string; width: number; dashStyle: string; opacity?: number; visible: boolean };
export type Border = { stroke?: string, strokeWidth?: number, strokeOpacity?: number, dashStyle?: string };
export type CustomizedOptions = { text?: string, html?: string, color?: string, borderColor?: string, fontColor?: string };
export type CustomizeTooltipFn = (info: any) => {
    text?: string; html?: string; color?: string; borderColor?: string; fontColor?: string;
};
export type Location = 'center' | 'edge';
export interface TooltipData {
  value?: number | Date | string,
  argument?: number | Date | string,
  valueText?: string,
  argumentText?: string,
  originalValue?: number | Date | string,
  originalArgument?: number | Date | string,
  seriesName?: string,
  description?: string
}

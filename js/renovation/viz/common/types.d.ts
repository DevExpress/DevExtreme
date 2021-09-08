type FormatType = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';
export interface FormatObject {
  type?: FormatType;
  precision?: number;
  currency?: string;
  percentPrecision?: number;
}
export type Format = FormatObject | FormatType | string | ((value: number | Date) => string);
export interface Point {
  size: number;
  tag: any;
  originalArgument: Date | string | number;
  originalValue: Date | string | number;
}

export interface Translator {
  translate: (value: number | string | Date) => number;
}

export interface BaseEventData {
  readonly component: any; // TODO: after improve refs use ref of the widget
}

export interface EventData<T> extends BaseEventData {
  readonly target?: T;
}

export type OnTooltipShownFn<T> = (e: T) => void;
export type OnTooltipHiddenFn<T> = (e: T) => void;

export interface Size { width?: number; height?: number }
export interface RecalculateCoordinates {
  canvas: ClientRect; anchorX: number; anchorY: number;
  size: Required<Size>; offset: number; arrowLength: number;
}
export interface TooltipCoordinates { x: number; y: number; anchorX: number; anchorY: number }
export interface Margin { top?: number; left?: number; bottom?: number; right?: number }
export interface InitialBorder {
  color: string; width: number; dashStyle: string; opacity?: number; visible: boolean;
}
export interface Border {
  stroke?: string; strokeWidth?: number; strokeOpacity?: number; dashStyle?: string;
}
export interface CustomizedOptions {
  text?: string | null;
  html?: string | null;
  color?: string;
  borderColor?: string;
  fontColor?: string;
}
export type CustomizeTooltipFn = (info: any) => CustomizedOptions;
export type Location = 'center' | 'edge';
export type Container = string | HTMLElement;
export interface TooltipData {
  value?: number | Date | string;
  argument?: number | Date | string;
  valueText?: string;
  argumentText?: string;
  originalValue?: number | Date | string;
  originalArgument?: number | Date | string;
  seriesName?: string;
  description?: string;
}
export interface Font {
  color?: string;
  family?: string;
  opacity?: number;
  size?: number;
  weight?: number;
  lineSpacing?: number;
}

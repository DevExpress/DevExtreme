type FormatType = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';
export type FormatObject = {
    type?: FormatType;
    precision?: number;
    currency?: string;
    percentPrecision?: number
}
export type Format = FormatObject | FormatType | string | ((value: number|Date) => string);
export interface Point {
    size: number,
    tag: any,
    originalArgument: Date | string | number,
    originalValue: Date | string | number
}

export interface Translator {
    translate: (value: number|string|Date) => number 
}
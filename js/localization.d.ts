/**
 * @docid localization.formatDate
 * @publicName formatDate(value, format)
 * @param1 value:date
 * @param2 format:format
 * @return string
 * @static
 * @module localization
 * @export formatDate
 * @namespace DevExpress.localization
 * @public
 */
export function formatDate(value: Date, format: Format): string;

/**
 * @docid localization.formatMessage
 * @publicName formatMessage(key, value)
 * @param1 key:string
 * @param2 value:string|Array<string>
 * @return string
 * @static
 * @module localization
 * @export formatMessage
 * @namespace DevExpress.localization
 * @public
 */
export function formatMessage(key: string, ...values: Array<string>): string;

/**
 * @docid localization.formatNumber
 * @publicName formatNumber(value, format)
 * @param1 value:number
 * @param2 format:format
 * @return string
 * @static
 * @module localization
 * @export formatNumber
 * @namespace DevExpress.localization
 * @public
 */
export function formatNumber(value: number, format: Format): string;

/**
 * @docid localization.loadMessages
 * @publicName loadMessages(messages)
 * @param1 messages:object
 * @static
 * @module localization
 * @export loadMessages
 * @namespace DevExpress.localization
 * @public
 */
export function loadMessages(messages: any): void;

/**
 * @docid localization.locale
 * @publicName locale()
 * @return string
 * @static
 * @module localization
 * @export locale
 * @namespace DevExpress.localization
 * @public
 */
export function locale(): string;

/**
 * @docid localization.locale
 * @publicName locale(locale)
 * @param1 locale:string
 * @static
 * @module localization
 * @export locale
 * @namespace DevExpress.localization
 * @public
 */
export function locale(locale: string): void;

/**
 * @docid localization.parseDate
 * @publicName parseDate(text, format)
 * @param1 text:string
 * @param2 format:format
 * @return date
 * @static
 * @module localization
 * @export parseDate
 * @namespace DevExpress.localization
 * @public
 */
export function parseDate(text: string, format: Format): Date;

/**
 * @docid localization.parseNumber
 * @publicName parseNumber(text, format)
 * @param1 text:string
 * @param2 format:format
 * @return number
 * @static
 * @module localization
 * @export parseNumber
 * @namespace DevExpress.localization
 * @public
 */
export function parseNumber(text: string, format: Format): number;

declare namespace Globalize {
    interface NumberFormatterOptions { }
    interface DateFormatterOptions { }
    interface CurrencyFormatterOptions { }
}

type FormatType = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';
export interface FormatObject {
    /**
     * @docid
     */
   currency?: string,
   /**
    * @docid
    * @type_function_param1 value:number|date
    * @type_function_return string
    */
   formatter?: ((value: number | Date) => string),
   /**
    * @docid
    * @type_function_param1 value:string
    * @type_function_return number|date
    */
   parser?: ((value: string) => number | Date),
   /**
    * @docid
    */
   precision?: number,
   /**
    * @docid
    * @type Enums.Format
    */
   type?: FormatType
}
type ExternalFormat = {} extends Globalize.NumberFormatterOptions ? (Intl.NumberFormatOptions | Intl.DateTimeFormatOptions) : (Globalize.NumberFormatterOptions | Globalize.DateFormatterOptions | Globalize.CurrencyFormatterOptions);
export type Format = FormatObject | FormatType | string | ((value: number | Date) => string) | ExternalFormat;

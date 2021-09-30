import { Format as PredefinedFormat } from './docEnums';

/**
 * @docid localization.formatDate
 * @publicName formatDate(value, format)
 * @param1 value:date
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function formatDate(value: Date, format: Format): string;

/**
 * @docid localization.formatMessage
 * @publicName formatMessage(key, value)
 * @param2 value:string|Array<string>
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function formatMessage(key: string, ...values: Array<string>): string;

/**
 * @docid localization.formatNumber
 * @publicName formatNumber(value, format)
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function formatNumber(value: number, format: Format): string;

/**
 * @docid localization.loadMessages
 * @publicName loadMessages(messages)
 * @param1 messages:object
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function loadMessages(messages: any): void;

/**
 * @docid localization.locale
 * @publicName locale()
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function locale(): string;

/**
 * @docid localization.locale
 * @publicName locale(locale)
 * @static
 * @namespace DevExpress.localization
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function locale(locale: string): void;

/**
 * @docid localization.parseDate
 * @publicName parseDate(text, format)
 * @return date
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function parseDate(text: string, format: Format): Date;

/**
 * @docid localization.parseNumber
 * @publicName parseNumber(text, format)
 * @static
 * @namespace DevExpress.localization
 * @public
 */
export function parseNumber(text: string, format: Format): number;

export interface FormatObject {
    /**
     * @docid Format.currency
     * @public
     */
   currency?: string;
   /**
    * @docid Format.formatter
    * @public
    * @type_function_param1 value:number|date
    */
   formatter?: ((value: number | Date) => string);
   /**
    * @docid Format.parser
    * @public
    * @type_function_return number|date
    */
   parser?: ((value: string) => number | Date);
   /**
    * @docid Format.precision
    * @public
    */
   precision?: number;
   /**
    * @docid Format.type
    * @public
    */
   type?: PredefinedFormat | string;
}
type ExternalFormat = any;

/**
 * @docid
 * @type Object|Enums.Format|string|function
 * @type_function_param1 value:number|date
 * @default undefined
 * @section Common
 * @namespace DevExpress.ui
 * @public
 */
export type Format = FormatObject | PredefinedFormat | string | ((value: number | Date) => string) | ExternalFormat;

import { Format as PredefinedFormat } from './common';

/**
 * @docid localization.formatDate
 * @publicName formatDate(value, format)
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
     * @docid Format.useCurrencyAccountingStyle
     * @type boolean
     * @default true
     * @public
     */
    useCurrencyAccountingStyle?: boolean;
   /**
    * @docid Format.formatter
    * @public
    */
   formatter?: ((value: number | Date) => string);
   /**
    * @docid Format.parser
    * @public
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
type ExternalFormat = never;

/**
 * @docid
 * @type Object|Enums.Format|string|function
 * @default undefined
 * @section Common
 * @namespace DevExpress.ui
 * @public
 */
export type Format =
  FormatObject |
  PredefinedFormat |
  string |
  ((value: number | Date) => string) |
  ((value: Date) => string) |
  ((value: number) => string) |
  ExternalFormat;

import {
    format
} from './ui/widget/ui.widget';

/**
 * @docid localization.formatDate
 * @publicName formatDate(value, format)
 * @param1 value:date
 * @param2 format:format
 * @return string
 * @static
 * @module localization
 * @export formatDate
 * @prevFileNamespace DevExpress
 * @public
 */
export function formatDate(value: Date, format: format): string;

/**
 * @docid localization.formatMessage
 * @publicName formatMessage(key, value)
 * @param1 key:string
 * @param2 value:string|Array<string>
 * @return string
 * @static
 * @module localization
 * @export formatMessage
 * @prevFileNamespace DevExpress
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
 * @prevFileNamespace DevExpress
 * @public
 */
export function formatNumber(value: number, format: format): string;

/**
 * @docid localization.loadMessages
 * @publicName loadMessages(messages)
 * @param1 messages:object
 * @static
 * @module localization
 * @export loadMessages
 * @prevFileNamespace DevExpress
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
 * @prevFileNamespace DevExpress
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
 * @prevFileNamespace DevExpress
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
 * @prevFileNamespace DevExpress
 * @public
 */
export function parseDate(text: string, format: format): Date;

/**
 * @docid localization.parseNumber
 * @publicName parseNumber(text, format)
 * @param1 text:string
 * @param2 format:format
 * @return number
 * @static
 * @module localization
 * @export parseNumber
 * @prevFileNamespace DevExpress
 * @public
 */
export function parseNumber(text: string, format: format): number;



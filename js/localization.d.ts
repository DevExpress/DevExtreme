import {
    format,
} from './ui/widget/ui.widget';

/**
 * @docid localization.formatDate
 * @publicName formatDate(value, format)
 * @static
 * @namespace DevExpress.localization
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function formatDate(value: Date, format: format): string;

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
// eslint-disable-next-line @typescript-eslint/no-shadow
export function formatNumber(value: number, format: format): string;

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
// eslint-disable-next-line @typescript-eslint/no-shadow
export function parseDate(text: string, format: format): Date;

/**
 * @docid localization.parseNumber
 * @publicName parseNumber(text, format)
 * @static
 * @namespace DevExpress.localization
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function parseNumber(text: string, format: format): number;

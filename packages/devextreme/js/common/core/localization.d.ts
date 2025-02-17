import { Format as FormatType } from '../../common';

/**
 * Converts a Date object to a string using the specified format.
 */
export function formatDate(value: Date, format: Format): string;

/**
 * Substitutes the provided value(s) for placeholders in a message that the key specifies.
 */
export function formatMessage(key: string, ...values: Array<string>): string;

/**
 * Converts a numeric value to a string using the specified format.
 */
export function formatNumber(value: number, format: Format): string;

/**
 * Loads localized messages.
 */
export function loadMessages(messages: any): void;

/**
 * Gets the current locale identifier.
 */
export function locale(): string;

/**
                                                          * Sets the current locale identifier.
                                                          */
                                                         export function locale(locale: string): void;

/**
 * Parses a string into a Date object.
 */
export function parseDate(text: string, format: Format): Date;

/**
 * Parses a string into a numeric value.
 */
export function parseNumber(text: string, format: Format): number;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type ExternalFormat =
  Intl.DateTimeFormatOptions |
  Intl.NumberFormatOptions;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type PredefinedFormat = FormatType;

/**
 * Formats values.
 */
export type Format =
  FormatObject |
  PredefinedFormat |
  string |
  ((value: number | Date) => string) |
  ((value: Date) => string) |
  ((value: number) => string) |
  ExternalFormat | undefined;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FormatObject {
    /**
    * Specifies a 3-letter ISO 4217 code for currency. Applies only if the type is &apos;currency&apos;.
    */
   currency?: string;
   /**
     * Specifies whether to apply the accounting style to formatted numbers of the `currency` type.
     */
    useCurrencyAccountingStyle?: boolean;
   /**
    * A function that converts numeric or date-time values to a string.
    */
   formatter?: ((value: number | Date) => string);
   /**
    * Parses string values into numeric or date-time values. Should be used with formatter or one of the predefined formats.
    */
   parser?: ((value: string) => number | Date);
   /**
    * Specifies a precision for values of numeric or currency format types.
    */
   precision?: number;
   /**
    * Specifies a predefined format. Does not apply if you have specified the formatter function.
    */
   type?: PredefinedFormat | string;
}

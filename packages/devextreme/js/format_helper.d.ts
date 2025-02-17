import {
  Format,
} from './common/core/localization';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FormatHelper {
  format(
    value: number | Date | null | undefined | string,
    format?: Format | Record<string, unknown>): string;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare const formatHelper: FormatHelper;
export default formatHelper;

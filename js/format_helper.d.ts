import {
  Format,
} from './localization';

export interface FormatHelper {
  format(
    value: unknown,
    format?: Format | Record<string, unknown>): string;
}

declare const formatHelper: FormatHelper;
export default formatHelper;

import {
  Format,
} from './localization';

export interface FormatHelper {
  format(
    value: number | Date | null | undefined | string,
    format?: Format): string;
}

declare const formatHelper: FormatHelper;
export default formatHelper;

import {
  Format,
} from './common/core/localization';

export interface FormatHelper {
  format(
    value: number | Date | string | null | undefined,
    format?: Format | Record<string, unknown>): string;
}

declare const formatHelper: FormatHelper;
export default formatHelper;

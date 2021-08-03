export interface FormatHelper {
  format: (
    value: number | Date | null | undefined | string,
    format: string | ((value: unknown) => string) | Record<string, unknown>) => string;
}

declare const formatHelper: FormatHelper;
export default formatHelper;

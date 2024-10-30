/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FullPageSize { text: string; value: number }

export declare type RefObject<T = any> = {
  // eslint-disable-next-line spellcheck/spell-checker
  bivarianceHack: (instance: (T & Element) | null) => void;
}['bivarianceHack'] & {
  current: T | null;
};

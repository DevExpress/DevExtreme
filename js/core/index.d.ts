export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// Omit does not exist in TS < 3.5.1
export type Skip<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

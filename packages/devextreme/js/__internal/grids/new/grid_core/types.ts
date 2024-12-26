import type { template } from '@js/core/templates/template';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, TDeps extends readonly any[] = any[]> = new(...deps: TDeps) => T;

// TODO
export type Template<T> = (props: T) => HTMLDivElement | template;

export type WithRequired<T, TProp extends keyof T> = Omit<T, TProp> & Required<Pick<T, TProp>>;

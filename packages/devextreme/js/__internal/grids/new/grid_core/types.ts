import type { template } from '@js/core/templates/template';
import type { EventInfo } from '@js/events';

import type { GridCoreNew } from './widget';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, TDeps extends readonly any[] = any[]> = new(...deps: TDeps) => T;

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Template<TProps> = (props: TProps) => HTMLDivElement | template;

// TODO: add TComponent
export type Action<TArgs> = (args: TArgs & EventInfo<GridCoreNew>) => void;

export type WithRequired<T, TProp extends keyof T> = Omit<T, TProp> & Required<Pick<T, TProp>>;

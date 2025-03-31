/* eslint-disable spellcheck/spell-checker */
import type { template } from '@js/common';
import type { UserDefinedElement } from '@js/core/element';
import type { EventInfo } from '@js/events';
import type dxCardView from '@js/ui/card_view';
import type { DIContext } from '@ts/core/di';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, TDeps extends readonly any[] = any[]> = new(...deps: TDeps) => T;

export interface WithDIContext {
  diContext: DIContext;
}

export type Template<TProps> = template | ((props: TProps) => string | UserDefinedElement);
export type Action<TArgs> = (args: TArgs & EventInfo<dxCardView>) => void;

export type WithOptional<T, TProp extends keyof T> = Omit<T, TProp> & Partial<Pick<T, TProp>>;
export type WithRequired<T, TProp extends keyof T> = Omit<T, TProp> & Required<Pick<T, TProp>>;

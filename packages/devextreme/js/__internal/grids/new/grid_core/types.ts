import type { template } from '@js/core/templates/template';

// TODO
export type Template<T> = (props: T) => HTMLDivElement | template;

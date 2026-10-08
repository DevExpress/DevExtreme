import type { EventInfo } from '@js/events';
import type { Module, ModuleType, Views } from '@ts/grids/grid_core/types';

import type { ModuleItem } from './modules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each extender has its own Base
export type ModuleTypeExtender = (Base: ModuleType<any>) => ModuleType<ModuleItem>;

export type ComponentInstanceType = Record<string, unknown>;

export type ModuleItemTypeCore = new(
  componentInstance: ComponentInstanceType,
) => ModuleItem & { name: string };

export type RegisteredModule = Module & { name: string };

export type ViewsWithBorder = Pick<Views, 'columnHeadersView' | 'rowsView' | 'filterPanelView' | 'footerView'>;

export type ExecuteActionArgs<TEvent> = Omit<TEvent, keyof EventInfo<unknown>>;

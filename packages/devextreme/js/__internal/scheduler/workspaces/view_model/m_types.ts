import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';

export interface ViewDataProviderOptions extends Record<string, any> {
  getResourceManager: () => ResourceManager;
}

export interface ViewDataProviderExtendedOptions extends ViewDataProviderOptions {
  startViewDate: Date;
  isVerticalGrouping: boolean;
  isHorizontalGrouping: boolean;
  isGroupedByDate: boolean;
  isGroupedAllDayPanel: boolean;
}

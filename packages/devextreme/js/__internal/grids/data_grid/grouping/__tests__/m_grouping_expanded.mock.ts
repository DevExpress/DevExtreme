import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';

import { GroupingHelper } from '../m_grouping_expanded';

export const createDataSourceAdapterStub = (): DataSourceAdapter => ({
  option: (): undefined => undefined,
} as unknown as DataSourceAdapter);

/** Subclass that exposes the protected handleDataLoading method for testing. */
export class GroupingHelperMock extends GroupingHelper {
  public testHandleDataLoading(options: unknown): void {
    this.handleDataLoading(options);
  }
}

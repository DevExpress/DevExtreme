import type { GroupingDataSourceAdapter } from '../m_grouping';
import { GroupingHelper } from '../m_grouping_expanded';

export const createDataSourceAdapterStub = (): GroupingDataSourceAdapter => ({
  option: (): undefined => undefined,
} as unknown as GroupingDataSourceAdapter);

/** Subclass that exposes the protected handleDataLoading method for testing. */
export class GroupingHelperMock extends GroupingHelper {
  public testHandleDataLoading(options: unknown): void {
    this.handleDataLoading(options);
  }
}

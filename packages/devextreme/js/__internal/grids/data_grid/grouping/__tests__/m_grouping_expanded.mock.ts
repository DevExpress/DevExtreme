import { GroupingHelper } from '../m_grouping_expanded';

/** Subclass that exposes the protected handleDataLoading method for testing. */
export class GroupingHelperMock extends GroupingHelper {
  public testHandleDataLoading(options: unknown): void {
    this.handleDataLoading(options);
  }
}

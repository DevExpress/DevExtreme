import type { GroupingDataSourceAdapter } from '../m_grouping';

export const createDataSourceAdapterStub = (): GroupingDataSourceAdapter => ({
  option: (): undefined => undefined,
} as unknown as GroupingDataSourceAdapter);

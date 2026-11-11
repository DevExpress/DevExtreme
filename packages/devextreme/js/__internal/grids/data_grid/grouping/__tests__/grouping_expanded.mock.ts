import type { GroupingDataSourceAdapter } from '../types';

export const createDataSourceAdapterStub = (): GroupingDataSourceAdapter => ({
  option: (): undefined => undefined,
} as unknown as GroupingDataSourceAdapter);

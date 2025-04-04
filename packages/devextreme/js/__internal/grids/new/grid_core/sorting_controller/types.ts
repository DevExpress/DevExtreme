import type { Column } from '../columns_controller/types';

export interface SortOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: any;
  desc: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compare: (this: Column, value1: any, value2: any) => number | undefined;
}

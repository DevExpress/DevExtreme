import type { StoreChange } from '@js/data/store';

export interface BeforePushEvent {
  changes: StoreChange[];
}

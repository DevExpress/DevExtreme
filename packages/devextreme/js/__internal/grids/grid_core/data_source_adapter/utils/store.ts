import { ArrayStore, CustomStore } from '@js/common/data';
import type { Store } from '@js/data';

export function isLocalStore(store: Store): store is ArrayStore {
  return store instanceof ArrayStore;
}

export function isCustomStore(store: Store): store is CustomStore {
  return store instanceof CustomStore;
}

import type Store from '@ts/data/abstract_store';
import ArrayStore from '@ts/data/array_store';
import CustomStore from '@ts/data/custom_store';

export function isLocalStore(store: Store | undefined): store is ArrayStore {
  return store instanceof ArrayStore;
}

export function isCustomStore(store: Store): store is CustomStore {
  return store instanceof CustomStore;
}

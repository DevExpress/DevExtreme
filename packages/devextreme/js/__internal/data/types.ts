import type { ArrayStore as BaseArrayStore } from '@js/common/data';

export interface ArrayStore extends BaseArrayStore {
  _array: unknown[];
}

import { RefObject } from '@devextreme-generator/declarations';

export function createTestRef<T = HTMLDivElement>(current: unknown = {}): RefObject<T> {
  return { current } as RefObject<T>;
}

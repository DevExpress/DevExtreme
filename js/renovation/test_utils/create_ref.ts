import { RefObject } from 'devextreme-generator/component_declaration/common';

export function createTestRef<T = HTMLDivElement>(current: unknown = {}): RefObject<T> {
  return { current } as RefObject<T>;
}

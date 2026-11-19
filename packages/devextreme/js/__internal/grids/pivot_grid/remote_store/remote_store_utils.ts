import type { RemoteGroup } from './types';

const forEachGroup = function forEachGroup(
  data: (RemoteGroup | undefined)[] | undefined,
  callback: (group: RemoteGroup | undefined, level: number) => void,
  level = 0,
): void {
  const groups = data ?? [];

  for (const group of groups) {
    callback(group, level);
    if (group?.items?.length) {
      forEachGroup(group.items, callback, level + 1);
    }
  }
};

export default { forEachGroup };
export { forEachGroup };

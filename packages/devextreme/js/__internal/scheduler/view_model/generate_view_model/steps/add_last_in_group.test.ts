import { describe, expect, it } from '@jest/globals';

import { addLastInGroup } from './add_last_in_group';

const items = [
  { groupIndex: 0, startDateUTC: new Date(2020, 0, 10, 0) },
  { groupIndex: 0, startDateUTC: new Date(2020, 0, 10, 1) },
  { groupIndex: 0, startDateUTC: new Date(2020, 0, 11, 5) },
  { groupIndex: 1, startDateUTC: new Date(2020, 0, 10, 0) },
  { groupIndex: 1, startDateUTC: new Date(2020, 0, 10, 1) },
  { groupIndex: 1, startDateUTC: new Date(2020, 0, 11, 5) },
] as any[];

describe('addLastInGroup', () => {
  it('should add last in group', () => {
    expect(addLastInGroup(items)).toEqual([
      { ...items[0], isLastInGroup: false },
      { ...items[1], isLastInGroup: true },
      { ...items[2], isLastInGroup: true },
      { ...items[3], isLastInGroup: false },
      { ...items[4], isLastInGroup: true },
      { ...items[5], isLastInGroup: true },
    ]);
  });
});

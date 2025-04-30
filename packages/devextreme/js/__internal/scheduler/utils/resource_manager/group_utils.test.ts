import {
  describe, expect, it,
} from '@jest/globals';

import { getAllGroupValues, getGroupTexts, getLeafGroupValues } from './group_utils';

const groupsLeafs: any = [
  { groupIndex: 0, grouped: { assigneeId: 1, roomId: 3 } },
  { groupIndex: 1, grouped: { assigneeId: 3, roomId: 4 } },
  { groupIndex: 2, grouped: { roomId: 0 } },
  { groupIndex: 3, grouped: { assigneeId: 0, roomId: 0 } },
];
const resourceById: any = {
  assigneeId: {
    items: [{ id: 0, text: 'Samantha Bright' }, { id: 1, text: 'John Heart' }],
  },
  roomId: {
    items: [{ id: 0, text: 'Room 1' }, { id: 1, text: 'Room 2' }],
  },
};

describe('groups utils', () => {
  describe('getAllGroupValues', () => {
    it('should return all group values', () => {
      expect(getAllGroupValues(groupsLeafs)).toEqual([
        { assigneeId: 1, roomId: 3 },
        { assigneeId: 3, roomId: 4 },
        { roomId: 0 },
        { assigneeId: 0, roomId: 0 },
      ]);
    });
  });

  describe('getLeafGroupValues', () => {
    it('should return group values of passed index', () => {
      expect(getLeafGroupValues(groupsLeafs, 1)).toEqual({ assigneeId: 3, roomId: 4 });
    });
  });

  describe('getGroupTexts', () => {
    it('should return groups for single grouping', () => {
      expect(getGroupTexts(groupsLeafs, resourceById, 2)).toEqual(['Room 1']);
    });
    it('should return groups for multiple grouping', () => {
      expect(getGroupTexts(groupsLeafs, resourceById, 3)).toEqual(['Samantha Bright', 'Room 1']);
    });
  });
});

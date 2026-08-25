import { describe, expect, it } from '@jest/globals';
import { deepExtendArraySafe } from '@ts/core/utils/m_object';

describe('Object utils', () => {
  // the flag set below repeats the array_utils.update() call:
  // extendComplexObject, assignByReference, shouldCopyUndefined, useNewAssign
  describe('deepExtendArraySafe', () => {
    it('should keep the array reference when the target already holds this array (T1334039)', () => {
      const tasks = [{ ID: 11, Subject: 'Task 1' }];
      const target = { ID: 1, FirstName: 'John', Tasks: tasks };

      deepExtendArraySafe(target, { ID: 1, FirstName: 'Updated', Tasks: tasks }, true, false, true, true);

      expect(target.Tasks).toBe(tasks);
      expect(target.Tasks[0]).toBe(tasks[0]);
      expect(target.FirstName).toBe('Updated');
    });

    it('should deeply copy an array that belongs to another object', () => {
      const tasks = [{ ID: 11, Subject: 'Task 1' }];
      const target = { ID: 1, Tasks: [{ ID: 21, Subject: 'Task 2' }] };

      deepExtendArraySafe(target, { Tasks: tasks }, true, false, true, true);

      expect(target.Tasks).not.toBe(tasks);
      expect(target.Tasks[0]).not.toBe(tasks[0]);
      expect(target.Tasks).toEqual(tasks);
    });
  });
});

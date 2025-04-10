import {
  describe, expect, it, jest,
} from '@jest/globals';
import { MultipleKeyDownHandler } from '@ts/grids/new/grid_core/keyboard_navigation/multipleKeyDownHandler';

describe('KeyboardNavigation', () => {
  describe('MultipleKeyDownHandler', () => {
    it('should call callback on key down if all key pressed', () => {
      const handler = new MultipleKeyDownHandler(['A', 'B', 'C']);
      const callback = jest.fn();

      handler.onKeyDownHandler({ key: 'A' } as unknown as KeyboardEvent, callback);
      handler.onKeyDownHandler({ key: 'B' } as unknown as KeyboardEvent, callback);
      handler.onKeyDownHandler({ key: 'C' } as unknown as KeyboardEvent, callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should pass event to callback', () => {
      const handler = new MultipleKeyDownHandler(['A']);
      const callback = jest.fn();
      const event = { key: 'A' } as unknown as KeyboardEvent;

      handler.onKeyDownHandler(event, callback);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it('should compare key names case insensitive', () => {
      const handler = new MultipleKeyDownHandler(['AbC']);
      const callback = jest.fn();

      handler.onKeyDownHandler({ key: 'aBc' } as unknown as KeyboardEvent, callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback if not all key pressed', () => {
      const handler = new MultipleKeyDownHandler(['A', 'B', 'C']);
      const callback = jest.fn();

      handler.onKeyDownHandler({ key: 'A' } as unknown as KeyboardEvent, callback);
      handler.onKeyDownHandler({ key: 'B' } as unknown as KeyboardEvent, callback);

      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should not call callback if some key was released', () => {
      const handler = new MultipleKeyDownHandler(['A', 'B', 'C']);
      const callback = jest.fn();

      handler.onKeyDownHandler({ key: 'A' } as unknown as KeyboardEvent, callback);
      handler.onKeyDownHandler({ key: 'B' } as unknown as KeyboardEvent, callback);
      handler.onKeyUpHandler({ key: 'A' } as unknown as KeyboardEvent);
      handler.onKeyDownHandler({ key: 'C' } as unknown as KeyboardEvent, callback);

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });
});

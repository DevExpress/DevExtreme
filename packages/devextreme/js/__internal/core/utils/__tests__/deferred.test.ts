import {
  describe, expect, it, jest,
} from '@jest/globals';
import { Deferred, when } from '@ts/core/utils/deferred';

describe('Deferred', () => {
  describe('notify', () => {
    it('should call the progress handler on every notify', () => {
      const progress = jest.fn();
      const d = Deferred<number>();

      d.progress(progress);
      d.notify(1);
      d.notify(2);

      expect(progress).toHaveBeenCalledTimes(2);
      expect(d.state()).toBe('pending');
    });

    it('should keep the done handlers attached before notify', () => {
      const done = jest.fn();
      const d = Deferred<number>();

      d.done(done);
      d.notify();
      d.resolve(1);

      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(1);
    });

    it('should keep the fail handlers attached before notify', () => {
      const fail = jest.fn();
      const d = Deferred<unknown>();
      const error = new Error('failed');

      d.fail(fail);
      d.notify();
      d.reject(error);

      expect(fail).toHaveBeenCalledTimes(1);
      expect(fail).toHaveBeenCalledWith(error);
    });

    it('should keep the always handlers attached before notify', () => {
      const always = jest.fn();
      const d = Deferred<number>();

      d.always(always);
      d.notify();
      d.resolve(1);

      expect(always).toHaveBeenCalledTimes(1);
    });

    it('should keep the then handlers attached before notify', () => {
      const onFulfilled = jest.fn();
      const d = Deferred<number>();

      d.then(onFulfilled);
      d.notify();
      d.resolve(5);

      expect(onFulfilled).toHaveBeenCalledWith(5);
    });

    it('should resolve when() after one of its deferreds is notified', () => {
      const done = jest.fn();
      const first = Deferred<number>();
      const second = Deferred<number>();

      when(first, second).done(done);
      first.notify();
      first.resolve(1);
      second.resolve(2);

      expect(done).toHaveBeenCalledTimes(1);
    });
  });

  describe('resolve and reject', () => {
    it('should not call the progress handler after resolve', () => {
      const progress = jest.fn();
      const d = Deferred<number>();

      d.progress(progress);
      d.resolve(1);
      d.notify();

      expect(progress).not.toHaveBeenCalled();
    });

    it('should call the done handlers once', () => {
      const done = jest.fn();
      const d = Deferred<number>();

      d.done(done);
      d.resolve(1);
      d.resolve(2);

      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(1);
    });

    it('should call a done handler attached after resolve', () => {
      const done = jest.fn();
      const d = Deferred<number>();

      d.resolve(1);
      d.done(done);

      expect(done).toHaveBeenCalledWith(1);
    });
  });
});

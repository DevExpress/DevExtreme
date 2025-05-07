/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  describe, expect, it, jest,
} from '@jest/globals';

import dispatcher, { macroTaskIdSet } from './dispatcher';

jest.useFakeTimers();

describe('Scheduler', () => {
  describe('MacroTaskArray', () => {
    describe('Dispatcher', () => {
      describe('schedule', () => {
        it('should add timeout ids to timeout ids set', () => {
          dispatcher.schedule(jest.fn(), 0).finally(() => {});
          dispatcher.schedule(jest.fn(), 0).finally(() => {});

          expect(macroTaskIdSet.size).toBe(2);
        });

        it('should remove timeout id from timeout ids set after macro task execution', async () => {
          const p1 = dispatcher.schedule(jest.fn(), 0);
          const p2 = dispatcher.schedule(jest.fn(), 0);

          jest.advanceTimersByTime(0);

          await Promise.all([p1, p2]);

          expect(macroTaskIdSet.size).toBe(0);
        });

        it('should call callback as macro task', () => {
          const callbackMock = jest.fn();
          dispatcher.schedule(callbackMock, 0).finally(() => {});

          expect(callbackMock).toHaveBeenCalledTimes(0);

          jest.advanceTimersByTime(0);

          expect(callbackMock).toHaveBeenCalledTimes(1);
        });

        it('should use macroTaskTimeoutMs form macro task delay', () => {
          const callbackMock = jest.fn();
          const macroTaskDelayMs = 1000;
          dispatcher.schedule(callbackMock, macroTaskDelayMs).finally(() => {});

          expect(callbackMock).toHaveBeenCalledTimes(0);

          jest.advanceTimersByTime(macroTaskDelayMs / 2);

          expect(callbackMock).toHaveBeenCalledTimes(0);

          jest.advanceTimersByTime(macroTaskDelayMs / 2);

          expect(callbackMock).toHaveBeenCalledTimes(1);
        });
      });

      describe('dispose', () => {
        it('should clear scheduled macro tasks', () => {
          const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

          dispatcher.schedule(jest.fn(), 0).finally(() => {});
          dispatcher.schedule(jest.fn(), 0).finally(() => {});

          const [firstId, secondId] = Array.from(macroTaskIdSet);

          dispatcher.dispose();

          expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
          expect(clearTimeoutSpy.mock.calls).toEqual([
            [firstId],
            [secondId],
          ]);
        });

        it('should clear timeout ids set', () => {
          dispatcher.schedule(jest.fn(), 0).finally(() => {});
          dispatcher.schedule(jest.fn(), 0).finally(() => {});

          expect(macroTaskIdSet.size).toBe(2);

          dispatcher.dispose();

          expect(macroTaskIdSet.size).toBe(0);
        });
      });
    });
  });
});

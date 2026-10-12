/* eslint-disable spellcheck/spell-checker */
import {
  describe,
  expect,
  it,
} from '@jest/globals';

import * as ReactiveDev from './dev/reactive_primitives/index';
import type {
  ReadonlySignal,
  Signal,
} from './prod/reactive_primitives/index';
import * as Reactive from './prod/reactive_primitives/index';

describe('Reactive wrapper', () => {
  describe.each([
    ['Prod', Reactive],
    ['Dev', ReactiveDev],
  ])('%s version', (name, ReactiveModule) => {
    it('signal correctly wrapped', () => {
      const testSignal: Signal<number> = ReactiveModule.signal(42);
      expect(testSignal.value).toBe(42);

      if (name === 'Dev') {
        expect('stack' in testSignal).toBeTruthy();
      }
    });

    it('computed correctly wrapped', () => {
      const testSignal: Signal<number> = ReactiveModule.signal(42);
      expect(testSignal.value).toBe(42);
      // eslint-disable-next-line @stylistic/max-len
      const testComputed: ReadonlySignal<number> = ReactiveModule.computed(() => testSignal.value * 2);
      expect(testComputed.value).toBe(84);

      if (name === 'Dev') {
        expect('stack' in testComputed).toBeTruthy();
      }
    });

    it('batch correctly wrapped', () => {
      const testSignal: Signal<number> = ReactiveModule.signal(42);
      expect(testSignal.value).toBe(42);

      let batchRan = false;
      ReactiveModule.batch(() => {
        batchRan = true;
        testSignal.value = 50;
      });
      expect(batchRan).toBe(true);
    });

    it('effect and untracked correctly wrapped', () => {
      const untrackedSignal = ReactiveModule.signal('Jane');
      const trackedSignal = ReactiveModule.signal('tracked');

      let untrackedEffectRunCount = 0;

      const untrackedDispose = ReactiveModule.effect(() => {
        untrackedEffectRunCount += 1;
        ReactiveModule.untracked(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          untrackedSignal.value;
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        trackedSignal.value;
      });

      expect(untrackedEffectRunCount).toBe(1);

      untrackedSignal.value = 'Doe';
      expect(untrackedEffectRunCount).toBe(1);

      trackedSignal.value = 'updated';
      expect(untrackedEffectRunCount).toBe(2);

      untrackedDispose();
    });

    it('track subscribes the enclosing effect to its arguments', () => {
      const first = ReactiveModule.signal(1);
      const second = ReactiveModule.signal(1);

      let effectRunCount = 0;

      const dispose = ReactiveModule.effect(() => {
        ReactiveModule.track(first.value, second.value);
        effectRunCount += 1;
      });

      expect(effectRunCount).toBe(1);

      first.value = 2;
      expect(effectRunCount).toBe(2);

      second.value = 2;
      expect(effectRunCount).toBe(3);

      dispose();

      first.value = 3;
      expect(effectRunCount).toBe(3);
    });

    it('track subscribes the enclosing computed to its arguments', () => {
      const trackedSignal = ReactiveModule.signal(1);

      let computedRunCount = 0;

      const testComputed = ReactiveModule.computed(() => {
        ReactiveModule.track(trackedSignal.value);
        computedRunCount += 1;
        return 'result';
      });

      expect(testComputed.value).toBe('result');
      expect(computedRunCount).toBe(1);

      trackedSignal.value = 2;
      expect(testComputed.value).toBe('result');
      expect(computedRunCount).toBe(2);
    });
  });
});

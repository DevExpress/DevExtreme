/* eslint-disable spellcheck/spell-checker */
import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  computed, interruptableComputed, state, toSubscribable,
} from './utilities';

describe('state', () => {
  let myState = state('some value');

  beforeEach(() => {
    myState = state('some value');
  });

  describe('unreactive_get', () => {
    it('should return value', () => {
      expect(myState.unreactive_get()).toBe('some value');
    });

    it('should return current value if it was updated', () => {
      myState.update('new value');
      expect(myState.unreactive_get()).toBe('new value');
    });
  });

  describe('subscribe', () => {
    it('should call callback on initial set', () => {
      const callback = jest.fn();
      myState.subscribe(callback);

      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith('some value');
    });

    it('should call callback on update', () => {
      const callback = jest.fn();
      myState.subscribe(callback);

      myState.update('new value');

      expect(callback).toBeCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'some value');
      expect(callback).toHaveBeenNthCalledWith(2, 'new value');
    });

    it('should not trigger update if value is not changed', () => {
      const callback = jest.fn();
      myState.subscribe(callback);

      expect(callback).toBeCalledTimes(1);

      myState.update('some value');

      expect(callback).toBeCalledTimes(1);
    });
  });

  describe('dispose', () => {
    it('should prevent all updates', () => {
      const callback = jest.fn();
      myState.subscribe(callback);

      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith('some value');

      // @ts-expect-error
      myState.dispose();
      myState.update('new value');

      expect(callback).toBeCalledTimes(1);
    });
  });
});

describe('computed', () => {
  let myState1 = state('some value');
  let myState2 = state('other value');
  let myComputed = computed(
    (v1, v2) => `${v1} ${v2}`,
    [myState1, myState2],
  );

  beforeEach(() => {
    myState1 = state('some value');
    myState2 = state('other value');
    myComputed = computed(
      (v1, v2) => `${v1} ${v2}`,
      [myState1, myState2],
    );
  });

  describe('unreactive_get', () => {
    it('should calculate initial value', () => {
      expect(myComputed.unreactive_get()).toBe('some value other value');
    });

    it('should return current value if it dependency is updated', () => {
      myState1.update('new value');
      expect(myComputed.unreactive_get()).toBe('new value other value');
    });
  });

  describe('subscribe', () => {
    it('should call callback on initial set', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith('some value other value');
    });

    it('should call callback on update of dependency', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      myState1.update('new value');

      expect(callback).toBeCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'some value other value');
      expect(callback).toHaveBeenNthCalledWith(2, 'new value other value');
    });
  });
});

describe('interruptableComputed', () => {
  let myState1 = state('some value');
  let myState2 = state('other value');
  let myComputed = interruptableComputed(
    (v1, v2) => `${v1} ${v2}`,
    [myState1, myState2],
  );

  beforeEach(() => {
    myState1 = state('some value');
    myState2 = state('other value');
    myComputed = interruptableComputed(
      (v1, v2) => `${v1} ${v2}`,
      [myState1, myState2],
    );
  });

  describe('unreactive_get', () => {
    it('should calculate initial value', () => {
      expect(myComputed.unreactive_get()).toBe('some value other value');
    });

    it('should return current value if it was updated', () => {
      myComputed.update('new value');
      expect(myComputed.unreactive_get()).toBe('new value');
    });

    it('should return current value if it dependency is updated', () => {
      myState1.update('new value');
      expect(myComputed.unreactive_get()).toBe('new value other value');
    });
  });

  describe('subscribe', () => {
    it('should call callback on initial set', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith('some value other value');
    });

    it('should call callback on update', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      myComputed.update('new value');

      expect(callback).toBeCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'some value other value');
      expect(callback).toHaveBeenNthCalledWith(2, 'new value');
    });

    it('should call callback on update of dependency', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      myState1.update('new value');

      expect(callback).toBeCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'some value other value');
      expect(callback).toHaveBeenNthCalledWith(2, 'new value other value');
    });

    it('should not trigger update if value is not changed', () => {
      const callback = jest.fn();
      myComputed.subscribe(callback);

      expect(callback).toBeCalledTimes(1);

      myComputed.update('some value other value');

      expect(callback).toBeCalledTimes(1);
    });
  });
});

describe('toSubscribable', () => {
  it('should wrap value if it is not subscribable', () => {
    const callback = jest.fn();
    toSubscribable('some value').subscribe(callback);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith('some value');
  });

  it('should return value as is if subscribable', () => {
    const myState = state(1);
    expect(toSubscribable(myState)).toBe(myState);
  });
});

import {
  afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi,
} from 'vitest';

type AnyFn = (...args: any[]) => any;

const withDone = (fn?: AnyFn): AnyFn | undefined => {
  if (!fn || fn.length === 0) {
    return fn;
  }

  return () => new Promise<void>((resolve, reject) => {
    const done: any = () => resolve();
    done.fail = (error: unknown) => reject(error instanceof Error ? error : new Error(String(error)));
    fn(done);
  });
};

const decorateSpy = (spy: any, original?: AnyFn): any => {
  spy.and = {
    callThrough: () => spy.mockImplementation(function (this: unknown, ...args: unknown[]) {
      return original?.apply(this, args);
    }),
    callFake: (fake: AnyFn) => spy.mockImplementation(fake),
    returnValue: (value: unknown) => spy.mockReturnValue(value),
    stub: () => spy.mockImplementation(() => undefined),
  };
  spy.calls = {
    count: () => spy.mock.calls.length,
    any: () => spy.mock.calls.length > 0,
    reset: () => spy.mockClear(),
    allArgs: () => spy.mock.calls,
    argsFor: (index: number) => spy.mock.calls[index],
    first: () => ({ args: spy.mock.calls[0] }),
    mostRecent: () => ({ args: spy.mock.calls[spy.mock.calls.length - 1] }),
  };

  return spy;
};

const globals = globalThis as any;
const timersToFake = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] as const;
let testTimeout = 5000;
let isTestRunning = false;
const testScopedSpies: { mockRestore: () => void }[] = [];

beforeEach(() => {
  isTestRunning = true;
});

afterEach(() => {
  isTestRunning = false;
  testScopedSpies.splice(0).forEach((spy) => spy.mockRestore());
});

globals.spyOn = (target: any, method: string) => {
  const original = target[method];
  const spy = vi.spyOn(target, method).mockImplementation(() => undefined);

  if (isTestRunning) {
    testScopedSpies.push(spy);
  }

  return decorateSpy(spy, original);
};

globals.jasmine = {
  createSpy: (_name?: string, fn?: AnyFn) => decorateSpy(vi.fn(fn), fn),
  clock: () => ({
    install: () => vi.useFakeTimers({ toFake: [...timersToFake] }),
    uninstall: () => vi.useRealTimers(),
    tick: (ms: number) => vi.advanceTimersByTime(ms),
  }),
  get DEFAULT_TIMEOUT_INTERVAL() {
    return testTimeout;
  },
  set DEFAULT_TIMEOUT_INTERVAL(value: number) {
    testTimeout = value;
    vi.setConfig({ testTimeout: value, hookTimeout: value });
  },
};

globals.fail = (error?: unknown) => {
  throw error instanceof Error ? error : new Error(String(error ?? 'Failed'));
};

const wrappedIt: any = (name: string, fn?: AnyFn, timeout?: number) => it(name, withDone(fn), timeout);
wrappedIt.skip = it.skip;
wrappedIt.only = it.only;

globals.it = wrappedIt;
globals.xit = it.skip;
globals.xdescribe = describe.skip;
globals.beforeEach = (fn: AnyFn, timeout?: number) => beforeEach(withDone(fn), timeout);
globals.afterEach = (fn: AnyFn, timeout?: number) => afterEach(withDone(fn), timeout);
globals.beforeAll = (fn: AnyFn, timeout?: number) => beforeAll(withDone(fn), timeout);
globals.afterAll = (fn: AnyFn, timeout?: number) => afterAll(withDone(fn), timeout);

expect.extend({
  toBeTrue: (received: unknown) => ({ pass: received === true, message: () => `expected ${String(received)} to be true` }),
  toBeFalse: (received: unknown) => ({ pass: received === false, message: () => `expected ${String(received)} to be false` }),
});

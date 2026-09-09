let messages;
let root;
let rafCallbacks;
let observers;

function loadRuntime() {
  let runtime;
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    runtime = require('../../server/demo-render-signal.runtime');
  });
  return runtime;
}

function makeRoot(childCount) {
  return { children: { length: childCount } };
}

function flushFrames() {
  while (rafCallbacks.length > 0) {
    rafCallbacks.shift()();
  }
}

beforeEach(() => {
  jest.useFakeTimers();

  messages = [];
  root = null;
  rafCallbacks = [];
  observers = [];

  global.window = {
    parent: {
      postMessage: (data, targetOrigin) => messages.push({ data, targetOrigin }),
    },
  };
  global.document = { querySelector: () => root };
  global.requestAnimationFrame = (callback) => rafCallbacks.push(callback);
  global.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }

    observe() {}

    disconnect() {
      this.disconnected = true;
    }
  };
});

afterEach(() => {
  jest.useRealTimers();
  delete global.window;
  delete global.document;
  delete global.requestAnimationFrame;
  delete global.MutationObserver;
});

describe('signal', () => {
  test('posts the contract message to the parent', () => {
    const { signal, MESSAGE_TYPE } = loadRuntime();

    signal();

    expect(messages).toEqual([{ data: { type: MESSAGE_TYPE }, targetOrigin: '*' }]);
    expect(MESSAGE_TYPE).toBe('demo-rendered');
  });

  test('posts at most once', () => {
    const { signal } = loadRuntime();

    signal();
    signal();

    expect(messages).toHaveLength(1);
  });

  test('swallows a parent that rejects the message', () => {
    global.window.parent.postMessage = () => { throw new Error('cross-origin'); };
    const { signal } = loadRuntime();

    expect(() => signal()).not.toThrow();
  });
});

describe('signalWhenRendered', () => {
  test('signals after two frames when the root is already filled', () => {
    root = makeRoot(1);
    const { signalWhenRendered } = loadRuntime();

    signalWhenRendered();
    expect(messages).toHaveLength(0);

    flushFrames();
    expect(messages).toHaveLength(1);
  });

  test('signals when there is no root element to watch', () => {
    const { signalWhenRendered } = loadRuntime();

    signalWhenRendered();
    flushFrames();

    expect(messages).toHaveLength(1);
  });

  test('signals synchronously without requestAnimationFrame', () => {
    delete global.requestAnimationFrame;
    root = makeRoot(1);
    const { signalWhenRendered } = loadRuntime();

    signalWhenRendered();

    expect(messages).toHaveLength(1);
  });

  test('signals without MutationObserver support', () => {
    delete global.MutationObserver;
    root = makeRoot(0);
    const { signalWhenRendered } = loadRuntime();

    signalWhenRendered();
    flushFrames();

    expect(messages).toHaveLength(1);
  });

  test('waits for the root to be filled, then stops watching', () => {
    root = makeRoot(0);
    const { signalWhenRendered, RENDER_TIMEOUT_MS } = loadRuntime();

    signalWhenRendered();
    const [observer] = observers;

    observer.callback();
    flushFrames();
    expect(messages).toHaveLength(0);

    root.children.length = 1;
    observer.callback();
    flushFrames();

    expect(messages).toHaveLength(1);
    expect(observer.disconnected).toBe(true);

    jest.advanceTimersByTime(RENDER_TIMEOUT_MS);
    expect(messages).toHaveLength(1);
  });

  test('signals anyway when the root never fills', () => {
    root = makeRoot(0);
    const { signalWhenRendered, RENDER_TIMEOUT_MS } = loadRuntime();

    signalWhenRendered();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MS);

    expect(messages).toHaveLength(1);
    expect(observers[0].disconnected).toBe(true);
  });
});

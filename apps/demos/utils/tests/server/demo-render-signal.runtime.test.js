const OWN_ORIGIN = 'http://localhost:8080';
const ALLOWED_PARENT = 'https://js.devexpress.com';

let messages;
let root;
let rafCallbacks;
let observers;
let warnings;

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

function embedIn(origin) {
  global.window.location.ancestorOrigins = origin === null ? [] : [origin];
}

beforeEach(() => {
  jest.useFakeTimers();

  messages = [];
  root = null;
  rafCallbacks = [];
  observers = [];
  warnings = [];

  global.window = {
    parent: {
      postMessage: (data, targetOrigin) => messages.push({ data, targetOrigin }),
    },
    location: { origin: OWN_ORIGIN, ancestorOrigins: [ALLOWED_PARENT] },
  };
  global.document = { querySelector: () => root, referrer: '' };
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

  jest.spyOn(console, 'warn').mockImplementation((message) => warnings.push(message));
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete global.window;
  delete global.document;
  delete global.requestAnimationFrame;
  delete global.MutationObserver;
});

describe('signal', () => {
  test('posts the contract message to the embedding origin', () => {
    const { signal, MESSAGE_TYPE } = loadRuntime();

    signal();

    expect(messages).toEqual([{ data: { type: MESSAGE_TYPE }, targetOrigin: ALLOWED_PARENT }]);
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

  test('warns instead of posting to an origin that is not allowed', () => {
    embedIn('https://evil.example');
    const { signal } = loadRuntime();

    signal();

    expect(messages).toHaveLength(0);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('*.devexpress.com');
  });

  test('gives up for good after a dropped message', () => {
    embedIn('https://evil.example');
    const { signal } = loadRuntime();

    signal();
    embedIn(ALLOWED_PARENT);
    signal();

    expect(messages).toHaveLength(0);
  });
});

describe('resolveTargetOrigin', () => {
  test('takes the embedding origin from ancestorOrigins', () => {
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe(ALLOWED_PARENT);
  });

  test.each([
    'https://az-jsserver.corp.devexpress.com',
    'https://js-stage.devexpress.com',
    'https://js.devexpress.com',
    'https://js.devexpress.devx',
    'http://localhost:44332',
    'http://localhost:8080',
  ])('allows the %s sandbox', (origin) => {
    embedIn(origin);
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe(origin);
  });

  test('allows any scheme for an entry that omits one', () => {
    embedIn('http://js.devexpress.com');
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe('http://js.devexpress.com');
  });

  test.each([
    ['the apex domain, which no sandbox uses', 'https://devexpress.com'],
    ['a host that only ends with the wildcard suffix', 'https://evil-devexpress.com'],
    ['a host shorter than the wildcard suffix', 'https://dx.com'],
    ['a host that merely starts with an allowed one', 'https://localhost.evil.example'],
    ['an opaque origin', 'null'],
  ])('rejects %s', (_, origin) => {
    embedIn(origin);
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBeNull();
  });

  test('pins the scheme for an entry that specifies one', () => {
    embedIn('http://js.devexpress.com');
    const { setAllowedOrigins, resolveTargetOrigin } = loadRuntime();

    setAllowedOrigins(['https://js.devexpress.com']);

    expect(resolveTargetOrigin()).toBeNull();
  });

  test('pins the port for an entry that specifies one', () => {
    embedIn('http://localhost:9999');
    const { setAllowedOrigins, resolveTargetOrigin } = loadRuntime();

    setAllowedOrigins(['localhost:44332']);

    expect(resolveTargetOrigin()).toBeNull();
  });

  test('matches a pinned port', () => {
    embedIn('http://localhost:44332');
    const { setAllowedOrigins, resolveTargetOrigin } = loadRuntime();

    setAllowedOrigins(['http://localhost:44332']);

    expect(resolveTargetOrigin()).toBe('http://localhost:44332');
  });

  test('ignores an entry that is not a bare origin', () => {
    embedIn('https://js.devexpress.com');
    const { setAllowedOrigins, resolveTargetOrigin } = loadRuntime();

    setAllowedOrigins(['https://js.devexpress.com/Demos/']);

    expect(resolveTargetOrigin()).toBeNull();
  });

  test('allows an embedder on the demo own origin, allowlisted or not', () => {
    global.window.location.origin = 'https://unlisted.example';
    embedIn('https://unlisted.example');
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe('https://unlisted.example');
  });

  test('targets the own origin when the demo is not framed', () => {
    global.window.parent = global.window;
    embedIn(null);
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe(OWN_ORIGIN);
  });

  test('falls back to the referrer origin without ancestorOrigins', () => {
    delete global.window.location.ancestorOrigins;
    global.document.referrer = `${ALLOWED_PARENT}/Demos/DataGrid/Overview/React/Light/`;
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe(ALLOWED_PARENT);
  });

  test('falls back to the referrer origin with empty ancestorOrigins', () => {
    embedIn(null);
    global.document.referrer = `${ALLOWED_PARENT}/`;
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBe(ALLOWED_PARENT);
  });

  test('resolves nothing without ancestorOrigins or a referrer', () => {
    embedIn(null);
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBeNull();
  });

  test('resolves nothing from an unparsable referrer', () => {
    embedIn(null);
    global.document.referrer = 'not-a-url';
    const { resolveTargetOrigin } = loadRuntime();

    expect(resolveTargetOrigin()).toBeNull();
  });
});

describe('setAllowedOrigins', () => {
  test('replaces the default allowlist', () => {
    embedIn('https://sandbox.example');
    const { setAllowedOrigins, resolveTargetOrigin } = loadRuntime();

    setAllowedOrigins(['https://sandbox.example']);

    expect(resolveTargetOrigin()).toBe('https://sandbox.example');
  });

  test('keeps the default allowlist when the build injects nothing', () => {
    const { setAllowedOrigins, resolveTargetOrigin, DEFAULT_ALLOWED_ORIGINS } = loadRuntime();

    setAllowedOrigins(null);
    setAllowedOrigins([]);

    expect(resolveTargetOrigin()).toBe(ALLOWED_PARENT);
    expect(DEFAULT_ALLOWED_ORIGINS).toContain('*.devexpress.com');
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

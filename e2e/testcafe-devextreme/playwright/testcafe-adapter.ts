/* eslint-disable @stylistic/max-len, @stylistic/object-curly-newline */
/* eslint-disable max-classes-per-file, no-continue, no-nested-ternary */
/* eslint-disable no-promise-executor-return, no-restricted-syntax */
/* eslint-disable no-underscore-dangle, spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  expect,
  test as playwrightTest,
  type BrowserContext,
  type ElementHandle,
  type Page,
  type Route,
} from '@playwright/test';
import { glob } from 'glob';
import Module, { createRequire } from 'module';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join, relative, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

type TestCallback = (t: TestControllerAdapter) => Promise<void> | void;
type HookCallback = (t: TestControllerAdapter) => Promise<void> | void;
type ModuleLoader = (request: string, parent: unknown, isMain: boolean) => unknown;
type SelectorBase = string | SelectorReference | (() => Element | null);
type RequestMatcher = string | RegExp | ((request: RequestInfoAdapter) => boolean);

interface TestMeta {
  browserSize?: [number, number];
  runInTheme?: string;
  themes?: string[];
  unstable?: boolean;
}

interface FixtureState {
  ctx: Record<string, unknown>;
  name: string;
  pageUrl: string;
  skip: boolean;
}

interface TestState {
  afterHooks: HookCallback[];
  beforeHooks: HookCallback[];
  callback: TestCallback;
  clientScripts: (ClientScript | string)[];
  fixture: FixtureState;
  meta: TestMeta;
  name: string;
  testFilePath: string;
}

interface RequestInfoAdapter {
  body: Buffer;
  headers: Record<string, string>;
  method: string;
  url: string;
}

interface ClientScript {
  content?: string;
  module?: string;
  path?: string;
}

interface RequestMockRule {
  body: unknown;
  headers: Record<string, string>;
  matcher: RequestMatcher;
  statusCode: number;
}

interface ActionOptions {
  modifiers?: {
    alt?: boolean;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
  };
  offsetX?: number;
  offsetY?: number;
  replace?: boolean;
  speed?: number;
}

interface SelectorOperation {
  argument?: unknown;
  type: string;
}

interface SelectorDescriptor {
  base: {
    source?: string;
    type: 'css' | 'function';
    value?: string;
  };
  operations: SelectorOperation[];
}

interface SerializedDependency {
  __playwrightTestCafeAdapter: string;
  dependencies?: Record<string, unknown>;
  flags?: string;
  source?: string;
  value?: unknown;
}

interface SelectorCallable {
  (): SelectorSnapshot;
  [SELECTOR_IMPL]: SelectorAdapter;
  addCustomDOMProperties: (properties: Record<string, unknown>) => SelectorCallable;
  child: (selector?: string) => SelectorCallable;
  filter: (selector: string) => SelectorCallable;
  filterHidden: () => SelectorCallable;
  filterVisible: () => SelectorCallable;
  find: (selector: string) => SelectorCallable;
  getAttribute: (name: string) => SelectorValue;
  getBoundingClientRectProperty: (name: string) => SelectorValue;
  getStyleProperty: (name: string) => SelectorValue;
  hasAttribute: (name: string) => SelectorValue;
  hasClass: (className: string) => SelectorValue;
  nextSibling: (selector?: string) => SelectorCallable;
  nth: (index: number) => SelectorCallable;
  parent: (selectorOrIndex?: string | number) => SelectorCallable;
  prevSibling: (selector?: string) => SelectorCallable;
  sibling: (selector?: string) => SelectorCallable;
  with: () => SelectorCallable;
  withAttribute: (name: string, value?: string | RegExp) => SelectorCallable;
  withExactText: (text: string | RegExp) => SelectorCallable;
  withText: (text: string | RegExp) => SelectorCallable;
}

interface SelectorReference {
  [SELECTOR_IMPL]: SelectorAdapter;
}

const TEST_ROOT = resolve(__dirname, '..');
const DEFAULT_BROWSER_SIZE: [number, number] = [1200, 800];
const SELECTOR_IMPL = Symbol('playwrightTestCafeSelector');
const CLIENT_FUNCTION_META = Symbol('playwrightTestCafeClientFunction');
const nodeRequire = createRequire(__filename);

let adaptersInstalled = false;
let activeController: TestControllerAdapter | null = null;
let currentFixture: FixtureState | null = null;
let currentTestFilePath = '';
let registeredTestIndex = 0;
let registeredTitleIndex = 0;

function isSelectorReference(value: unknown): value is SelectorReference {
  return Boolean(
    value
      && (typeof value === 'function' || typeof value === 'object')
      && (value as any)[SELECTOR_IMPL],
  );
}

function getActiveController(): TestControllerAdapter {
  if (!activeController) {
    throw new Error('TestCafe compatibility API was called outside of a Playwright component test');
  }

  return activeController;
}

function getTheme(): string {
  return process.env.theme || process.env.THEME || 'fluent.blue.light';
}

function isAccessibilityFolder(): boolean {
  return (process.env.COMPONENT_FOLDER || '').includes('accessibility');
}

function isMaterialTheme(): boolean {
  return getTheme().startsWith('material');
}

function createSelector(base: SelectorBase | SelectorAdapter, operations: SelectorOperation[] = []): SelectorCallable {
  const adapter = base instanceof SelectorAdapter
    ? new SelectorAdapter(base, operations)
    : isSelectorReference(base)
      ? new SelectorAdapter(base[SELECTOR_IMPL], operations)
      : new SelectorAdapter(base, operations);
  const callable = (() => new SelectorSnapshot(adapter)) as SelectorCallable;

  Object.defineProperty(callable, SELECTOR_IMPL, { value: adapter });
  Object.defineProperty(callable, 'exists', { get: () => new SelectorValue(adapter, 'exists') });
  Object.defineProperty(callable, 'count', { get: () => new SelectorValue(adapter, 'count') });
  Object.defineProperty(callable, 'focused', { get: () => new SelectorValue(adapter, 'focused') });
  Object.defineProperty(callable, 'innerText', { get: () => new SelectorValue(adapter, 'innerText') });
  Object.defineProperty(callable, 'textContent', { get: () => new SelectorValue(adapter, 'textContent') });
  Object.defineProperty(callable, 'value', { get: () => new SelectorValue(adapter, 'value') });
  Object.defineProperty(callable, 'visible', { get: () => new SelectorValue(adapter, 'visible') });
  Object.defineProperty(callable, 'clientHeight', { get: () => new SelectorValue(adapter, 'clientHeight') });
  Object.defineProperty(callable, 'clientWidth', { get: () => new SelectorValue(adapter, 'clientWidth') });
  Object.defineProperty(callable, 'scrollHeight', { get: () => new SelectorValue(adapter, 'scrollHeight') });
  Object.defineProperty(callable, 'scrollLeft', { get: () => new SelectorValue(adapter, 'scrollLeft') });
  Object.defineProperty(callable, 'scrollTop', { get: () => new SelectorValue(adapter, 'scrollTop') });
  Object.defineProperty(callable, 'scrollWidth', { get: () => new SelectorValue(adapter, 'scrollWidth') });
  Object.defineProperty(callable, 'boundingClientRect', { get: () => new SelectorValue(adapter, 'boundingClientRect') });

  callable.nth = (index) => createSelector(adapter, [{ type: 'nth', argument: index }]);
  callable.find = (selector) => createSelector(adapter, [{ type: 'find', argument: selector }]);
  callable.child = (selector) => createSelector(adapter, [{ type: 'child', argument: selector }]);
  callable.parent = (selectorOrIndex) => createSelector(adapter, [{ type: 'parent', argument: selectorOrIndex }]);
  callable.sibling = (selector) => createSelector(adapter, [{ type: 'sibling', argument: selector }]);
  callable.prevSibling = (selector) => createSelector(adapter, [{ type: 'prevSibling', argument: selector }]);
  callable.nextSibling = (selector) => createSelector(adapter, [{ type: 'nextSibling', argument: selector }]);
  callable.filter = (selector) => createSelector(adapter, [{ type: 'filter', argument: selector }]);
  callable.filterVisible = () => createSelector(adapter, [{ type: 'filterVisible' }]);
  callable.filterHidden = () => createSelector(adapter, [{ type: 'filterHidden' }]);
  callable.withText = (text) => createSelector(adapter, [{ type: 'withText', argument: serializeDependency(text) }]);
  callable.withExactText = (text) => createSelector(adapter, [{ type: 'withExactText', argument: serializeDependency(text) }]);
  callable.withAttribute = (name, value) => createSelector(adapter, [{
    type: 'withAttribute',
    argument: { name, value: serializeDependency(value) },
  }]);
  callable.hasClass = (className) => new SelectorValue(adapter, 'hasClass', className);
  callable.hasAttribute = (name) => new SelectorValue(adapter, 'hasAttribute', name);
  callable.getAttribute = (name) => new SelectorValue(adapter, 'getAttribute', name);
  callable.getStyleProperty = (name) => new SelectorValue(adapter, 'getStyleProperty', name);
  callable.getBoundingClientRectProperty = (name) => new SelectorValue(adapter, 'getBoundingClientRectProperty', name);
  callable.addCustomDOMProperties = () => callable;
  callable.with = () => callable;

  return callable;
}

class SelectorAdapter {
  private readonly base: Exclude<SelectorBase, SelectorReference | SelectorAdapter>;

  private readonly operations: SelectorOperation[];

  constructor(base: SelectorBase | SelectorAdapter, operations: SelectorOperation[] = []) {
    if (base instanceof SelectorAdapter) {
      this.base = base.base;
      this.operations = [...base.operations, ...operations];
      return;
    }

    if (isSelectorReference(base)) {
      this.base = base[SELECTOR_IMPL].base;
      this.operations = [...base[SELECTOR_IMPL].operations, ...operations];
      return;
    }

    this.base = base;
    this.operations = operations;
  }

  toDescriptor(): SelectorDescriptor {
    return {
      base: typeof this.base === 'function'
        ? { type: 'function', source: this.base.toString() }
        : { type: 'css', value: this.base },
      operations: this.operations,
    };
  }

  async resolveForAction(page: Page): Promise<ElementHandle<Element>> {
    const handle = await page.evaluateHandle(
      ({ descriptor, evaluator }) => {
        // eslint-disable-next-line no-eval
        const evaluateSelector = eval(`(${evaluator})`);
        const elements = evaluateSelector(descriptor);
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          return style.visibility !== 'hidden'
            && style.display !== 'none'
            && element.getClientRects().length > 0;
        };
        return elements.find(isVisible) || elements[0] || null;
      },
      {
        descriptor: this.toDescriptor(),
        evaluator: selectorEvaluatorSource,
      },
    );
    const element = handle.asElement() as ElementHandle<Element> | null;

    if (!element) {
      throw new Error('Selector did not resolve to an element');
    }

    return element;
  }

  async evaluateProperty(page: Page, property: string, argument?: unknown): Promise<unknown> {
    return page.evaluate(
      ({ descriptor, evaluator, propertyName, propertyArgument }) => {
        // eslint-disable-next-line no-eval
        const evaluateSelector = eval(`(${evaluator})`);
        const elements = evaluateSelector(descriptor);
        const element = elements[0] as HTMLElement | undefined;
        const hydrate = (value) => {
          if (!value || typeof value !== 'object' || !value.__playwrightTestCafeAdapter) {
            return value;
          }

          if (value.__playwrightTestCafeAdapter === 'regexp') {
            return new RegExp(value.source, value.flags);
          }

          return value.value;
        };
        const arg = hydrate(propertyArgument);
        const isVisible = (target?: Element): boolean => {
          if (!target) {
            return false;
          }

          const style = window.getComputedStyle(target);
          return style.visibility !== 'hidden'
            && style.display !== 'none'
            && target.getClientRects().length > 0;
        };

        switch (propertyName) {
          case 'exists':
            return elements.length > 0;
          case 'count':
            return elements.length;
          case 'focused':
            return document.activeElement === element;
          case 'innerText':
            return element?.innerText;
          case 'textContent':
            return element?.textContent;
          case 'value':
            return (element as HTMLInputElement | undefined)?.value;
          case 'visible':
            return isVisible(element);
          case 'clientHeight':
          case 'clientWidth':
          case 'scrollHeight':
          case 'scrollLeft':
          case 'scrollTop':
          case 'scrollWidth':
            return element?.[propertyName] ?? 0;
          case 'boundingClientRect': {
            const rect = element?.getBoundingClientRect();
            return rect ? {
              bottom: rect.bottom,
              height: rect.height,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              width: rect.width,
              x: rect.x,
              y: rect.y,
            } : null;
          }
          case 'getBoundingClientRectProperty': {
            const rect = element?.getBoundingClientRect();
            return rect?.[arg];
          }
          case 'hasClass':
            return element?.classList.contains(String(arg)) ?? false;
          case 'hasAttribute':
            return element?.hasAttribute(String(arg)) ?? false;
          case 'getAttribute':
            return element?.getAttribute(String(arg));
          case 'getStyleProperty':
            return element ? window.getComputedStyle(element).getPropertyValue(String(arg)) : '';
          case 'snapshot': {
            const rect = element?.getBoundingClientRect();
            return {
              boundingClientRect: rect ? {
                bottom: rect.bottom,
                height: rect.height,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                width: rect.width,
                x: rect.x,
                y: rect.y,
              } : null,
              checked: (element as HTMLInputElement | undefined)?.checked,
              clientHeight: element?.clientHeight ?? 0,
              clientWidth: element?.clientWidth ?? 0,
              exists: elements.length > 0,
              focused: document.activeElement === element,
              innerText: element?.innerText,
              scrollHeight: element?.scrollHeight ?? 0,
              scrollLeft: element?.scrollLeft ?? 0,
              scrollTop: element?.scrollTop ?? 0,
              scrollWidth: element?.scrollWidth ?? 0,
              textContent: element?.textContent,
              value: (element as HTMLInputElement | undefined)?.value,
              visible: isVisible(element),
            };
          }
          default:
            return undefined;
        }
      },
      {
        descriptor: this.toDescriptor(),
        evaluator: selectorEvaluatorSource,
        propertyArgument: argument,
        propertyName: property,
      },
    );
  }

  async waitForA11yStatusText(page: Page): Promise<void> {
    await page.waitForFunction(
      ({ descriptor, evaluator }) => {
        // eslint-disable-next-line no-eval
        const evaluateSelector = eval(`(${evaluator})`);
        const element = evaluateSelector(descriptor)[0];

        return element?.getAttribute('e2e-a11y-general-status-container') !== 'true'
          || Boolean(element.textContent);
      },
      {
        descriptor: this.toDescriptor(),
        evaluator: selectorEvaluatorSource,
      },
      {
        polling: 50,
        timeout: 1_000,
      },
    ).catch(() => {});
  }
}

class SelectorValue implements PromiseLike<unknown> {
  constructor(
    private readonly selector: SelectorAdapter,
    private readonly property: string,
    private readonly argument?: unknown,
  ) {}

  async evaluate(page: Page): Promise<unknown> {
    if (this.property === 'textContent') {
      await this.selector.waitForA11yStatusText(page);
    }

    return this.selector.evaluateProperty(page, this.property, serializeDependency(this.argument));
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.evaluate(getActiveController().page).then(onfulfilled, onrejected);
  }
}

class LazyClientFunctionResult<T> implements PromiseLike<T> {
  readonly [Symbol.toStringTag] = 'Promise';

  constructor(
    private readonly getController: () => TestControllerAdapter | null,
    private readonly callback: (...args: unknown[]) => T,
    private readonly args: unknown[],
    private readonly dependencies: Record<string, unknown>,
  ) {}

  private run(): Promise<T> {
    const targetController = this.getController() || activeController;

    if (!targetController) {
      return Promise.reject(new Error('ClientFunction was called outside of a Playwright component test'));
    }

    return targetController.evaluateClientFunction(
      this.callback,
      this.args,
      this.dependencies,
    );
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.run().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): PromiseLike<T | TResult> {
    return this.run().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): PromiseLike<T> {
    return this.run().finally(onfinally || undefined);
  }
}

class SelectorSnapshot implements PromiseLike<unknown> {
  constructor(private readonly selector: SelectorAdapter) {
    Object.defineProperty(this, SELECTOR_IMPL, { value: selector });

    [
      'boundingClientRect',
      'checked',
      'clientHeight',
      'clientWidth',
      'exists',
      'focused',
      'innerText',
      'scrollHeight',
      'scrollLeft',
      'scrollTop',
      'scrollWidth',
      'textContent',
      'value',
      'visible',
    ].forEach((property) => {
      Object.defineProperty(this, property, {
        get: () => new SelectorValue(this.selector, property),
      });
    });
  }

  nth(index: number): SelectorCallable {
    return createSelector(this.selector, [{ type: 'nth', argument: index }]);
  }

  find(selector: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'find', argument: selector }]);
  }

  child(selector?: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'child', argument: selector }]);
  }

  parent(selectorOrIndex?: string | number): SelectorCallable {
    return createSelector(this.selector, [{ type: 'parent', argument: selectorOrIndex }]);
  }

  sibling(selector?: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'sibling', argument: selector }]);
  }

  prevSibling(selector?: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'prevSibling', argument: selector }]);
  }

  nextSibling(selector?: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'nextSibling', argument: selector }]);
  }

  filter(selector: string): SelectorCallable {
    return createSelector(this.selector, [{ type: 'filter', argument: selector }]);
  }

  filterVisible(): SelectorCallable {
    return createSelector(this.selector, [{ type: 'filterVisible' }]);
  }

  filterHidden(): SelectorCallable {
    return createSelector(this.selector, [{ type: 'filterHidden' }]);
  }

  withText(text: string | RegExp): SelectorCallable {
    return createSelector(this.selector, [{ type: 'withText', argument: serializeDependency(text) }]);
  }

  withExactText(text: string | RegExp): SelectorCallable {
    return createSelector(this.selector, [{ type: 'withExactText', argument: serializeDependency(text) }]);
  }

  withAttribute(name: string, value?: string | RegExp): SelectorCallable {
    return createSelector(this.selector, [{
      type: 'withAttribute',
      argument: { name, value: serializeDependency(value) },
    }]);
  }

  hasClass(className: string): SelectorValue {
    return new SelectorValue(this.selector, 'hasClass', className);
  }

  hasAttribute(name: string): SelectorValue {
    return new SelectorValue(this.selector, 'hasAttribute', name);
  }

  getAttribute(name: string): SelectorValue {
    return new SelectorValue(this.selector, 'getAttribute', name);
  }

  getStyleProperty(name: string): SelectorValue {
    return new SelectorValue(this.selector, 'getStyleProperty', name);
  }

  getBoundingClientRectProperty(name: string): SelectorValue {
    return new SelectorValue(this.selector, 'getBoundingClientRectProperty', name);
  }

  addCustomDOMProperties(): SelectorSnapshot {
    return this;
  }

  with(): SelectorSnapshot {
    return this;
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.selector.evaluateProperty(getActiveController().page, 'snapshot').then(onfulfilled, onrejected);
  }
}

class AssertionAdapter {
  constructor(
    private readonly controller: TestControllerAdapter,
    private readonly actual: unknown,
  ) {}

  ok(message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Boolean(await this.controller.resolveActual(this.actual)), message).toBe(true);
    });
  }

  notOk(message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Boolean(await this.controller.resolveActual(this.actual)), message).toBe(false);
    });
  }

  eql(expected: unknown, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(await this.controller.resolveActual(this.actual), message).toEqual(await this.controller.resolveActual(expected));
    });
  }

  notEql(expected: unknown, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(await this.controller.resolveActual(this.actual), message).not.toEqual(await this.controller.resolveActual(expected));
    });
  }

  contains(expected: unknown, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = await this.controller.resolveActual(this.actual);
      expect(actual as any, message).toContain(expected);
    });
  }

  notContains(expected: unknown, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = await this.controller.resolveActual(this.actual);
      expect(actual as any, message).not.toContain(expected);
    });
  }

  gt(expected: number, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Number(await this.controller.resolveActual(this.actual)), message).toBeGreaterThan(expected);
    });
  }

  gte(expected: number, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Number(await this.controller.resolveActual(this.actual)), message).toBeGreaterThanOrEqual(expected);
    });
  }

  lt(expected: number, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Number(await this.controller.resolveActual(this.actual)), message).toBeLessThan(expected);
    });
  }

  lte(expected: number, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(Number(await this.controller.resolveActual(this.actual)), message).toBeLessThanOrEqual(expected);
    });
  }

  within(start: number, finish: number, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = Number(await this.controller.resolveActual(this.actual));
      expect(actual, message).toBeGreaterThanOrEqual(start);
      expect(actual, message).toBeLessThanOrEqual(finish);
    });
  }

  match(expected: RegExp, message?: string): TestControllerAdapter {
    return this.controller.enqueue(async () => {
      expect(String(await this.controller.resolveActual(this.actual)), message).toMatch(expected);
    });
  }
}

class TestControllerAdapter implements PromiseLike<undefined> {
  readonly ctx: Record<string, unknown> = {};

  readonly fixtureCtx: Record<string, unknown>;

  readonly page: Page;

  readonly testRun: {
    opts: {
      'screenshots-comparer': Record<string, unknown>;
      disableScreenshots: boolean;
    };
    test: {
      name: string;
      testFile: {
        filename: string;
      };
    };
  };

  private chain: Promise<void> = Promise.resolve();

  private flushing = false;

  private readonly consoleMessages: Record<string, string[]> = {
    debug: [],
    error: [],
    info: [],
    log: [],
    warn: [],
  };

  private readonly requestHooks: unknown[] = [];

  private routeInstalled = false;

  constructor(
    page: Page,
    private readonly context: BrowserContext,
    testState: TestState,
  ) {
    this.page = page;
    this.fixtureCtx = testState.fixture.ctx;
    this.testRun = {
      opts: {
        'screenshots-comparer': {
          path: TEST_ROOT,
          ...(isMaterialTheme() ? { textMaskRadius: 2 } : {}),
        },
        disableScreenshots: process.env.PLAYWRIGHT_COMPONENT_DISABLE_SCREENSHOTS === 'true',
      },
      test: {
        name: testState.name,
        testFile: {
          filename: testState.testFilePath,
        },
      },
    };

    this.page.on('console', (message) => {
      const type = message.type();
      const bucket = this.consoleMessages[type] || this.consoleMessages.log;
      bucket.push(message.text());
    });
  }

  then<TResult1 = undefined, TResult2 = never>(
    onfulfilled?: ((value: undefined) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.flush().then(onfulfilled, onrejected);
  }

  enqueue(action: () => Promise<void>): TestControllerAdapter {
    this.chain = this.chain.then(action);
    return this;
  }

  async flush(): Promise<void> {
    if (this.flushing) {
      return;
    }

    this.flushing = true;
    try {
      await this.chain;
    } finally {
      this.flushing = false;
    }
  }

  async resolveActual(actual: unknown): Promise<unknown> {
    if (actual instanceof SelectorValue) {
      return actual.evaluate(this.page);
    }

    if (actual instanceof SelectorSnapshot) {
      return actual.then((snapshot) => snapshot);
    }

    if (actual && typeof (actual as PromiseLike<unknown>).then === 'function') {
      return actual;
    }

    return actual;
  }

  expect(actual: unknown): AssertionAdapter {
    return new AssertionAdapter(this, actual);
  }

  click(selector: SelectorBase, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.click({ ...toPlaywrightActionOptions(options), force: true });
      await waitForStableRendering(this.page);
    });
  }

  doubleClick(selector: SelectorBase, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.dblclick(toPlaywrightActionOptions(options));
    });
  }

  rightClick(selector: SelectorBase, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.click({ ...toPlaywrightActionOptions(options), button: 'right' });
    });
  }

  hover(selector: SelectorBase, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.hover(toPlaywrightActionOptions(options));
    });
  }

  typeText(selector: SelectorBase, text: string, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);

      if (options.replace) {
        await target.fill(text);
        await waitForStableRendering(this.page);
        return;
      }

      await target.click({ ...toPlaywrightActionOptions(options), force: true });
      await this.page.keyboard.type(text);
      await waitForStableRendering(this.page);
    });
  }

  pressKey(keys: string): TestControllerAdapter {
    return this.enqueue(async () => {
      for (const key of keys.split(/\s+/).filter(Boolean)) {
        await this.page.keyboard.press(toPlaywrightKey(key));
      }
    });
  }

  drag(selector: SelectorBase, dragOffsetX: number, dragOffsetY: number, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      const box = await target.boundingBox();

      if (!box) {
        throw new Error('Unable to drag an invisible element');
      }

      const startX = box.x + (options.offsetX ?? box.width / 2);
      const startY = box.y + (options.offsetY ?? box.height / 2);

      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await moveMouse(this.page, startX, startY, startX + dragOffsetX, startY + dragOffsetY, options.speed);
      await this.page.mouse.up();
    });
  }

  dragToElement(selector: SelectorBase, destination: SelectorBase, options: ActionOptions = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const source = await this.resolveForAction(selector);
      const target = await this.resolveForAction(destination);
      const sourceBox = await source.boundingBox();
      const targetBox = await target.boundingBox();

      if (!sourceBox || !targetBox) {
        throw new Error('Unable to drag an invisible element');
      }

      await this.page.mouse.move(
        sourceBox.x + (options.offsetX ?? sourceBox.width / 2),
        sourceBox.y + (options.offsetY ?? sourceBox.height / 2),
      );
      await this.page.mouse.down();
      await moveMouse(
        this.page,
        sourceBox.x + (options.offsetX ?? sourceBox.width / 2),
        sourceBox.y + (options.offsetY ?? sourceBox.height / 2),
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        options.speed,
      );
      await this.page.mouse.up();
    });
  }

  dispatchEvent(selector: SelectorBase, eventName: string, options: Record<string, unknown> = {}): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.dispatchEvent(eventName, options);
    });
  }

  scroll(selector: SelectorBase, x: number, y: number): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.evaluate((element, scroll) => {
        element.scrollLeft = scroll.x;
        element.scrollTop = scroll.y;
      }, { x, y });
    });
  }

  scrollIntoView(selector: SelectorBase): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.evaluate((element) => {
        element.scrollIntoView({ block: 'center', inline: 'nearest' });

        let parent = element.parentElement;
        while (parent) {
          const style = window.getComputedStyle(parent);
          const canScroll = /(auto|scroll)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`);

          if (canScroll) {
            parent.dispatchEvent(new Event('scroll', { bubbles: true }));
          }

          parent = parent.parentElement;
        }

        window.dispatchEvent(new Event('scroll'));
      });
      await waitForStableRendering(this.page);
    });
  }

  selectText(selector: SelectorBase): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.evaluate((element) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.select();
        }
      });
    });
  }

  resizeWindow(width: number, height: number): TestControllerAdapter {
    return this.enqueue(async () => {
      await this.page.setViewportSize({ width, height });
    });
  }

  maximizeWindow(): TestControllerAdapter {
    return this.resizeWindow(1920, 1080);
  }

  wait(timeout: number): TestControllerAdapter {
    return this.enqueue(async () => {
      await this.page.waitForTimeout(timeout);
    });
  }

  navigateTo(url: string): TestControllerAdapter {
    return this.enqueue(async () => {
      await this.page.goto(url);
    });
  }

  setFilesToUpload(selector: SelectorBase, files: string[]): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.setInputFiles(files);
    });
  }

  clearUpload(selector: SelectorBase): TestControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      await target.setInputFiles([]);
    });
  }

  eval<T>(callback: () => T | Promise<T>): Promise<T> {
    return this.page.evaluate(callback);
  }

  async getBrowserConsoleMessages(): Promise<Record<string, string[]>> {
    await this.flush();
    return this.consoleMessages;
  }

  addRequestHooks(...hooks: unknown[]): TestControllerAdapter {
    return this.enqueue(async () => {
      this.requestHooks.push(...hooks);

      if (!this.routeInstalled) {
        await this.context.route('**/*', (route) => this.handleRoute(route));
        this.routeInstalled = true;
      }
    });
  }

  removeRequestHooks(...hooks: unknown[]): TestControllerAdapter {
    return this.enqueue(async () => {
      for (const hook of hooks) {
        const index = this.requestHooks.indexOf(hook);
        if (index >= 0) {
          this.requestHooks.splice(index, 1);
        }
      }
    });
  }

  async takeScreenshot(filePath: string): Promise<void> {
    await this.flush();
    await waitForStableRendering(this.page);
    await this.page.screenshot({ fullPage: true, path: filePath });
  }

  async takeElementScreenshot(selector: SelectorBase, filePath: string): Promise<void> {
    await this.flush();
    await waitForStableRendering(this.page);
    const target = await this.resolveForAction(selector);
    const box = await target.boundingBox();

    if (!box) {
      throw new Error('Unable to screenshot an invisible element');
    }

    await this.page.screenshot({
      path: filePath,
      clip: {
        height: Math.max(1, Math.floor(box.height)),
        width: Math.max(1, Math.floor(box.width)),
        x: Math.floor(box.x),
        y: Math.floor(box.y),
      },
    });
  }

  async evaluateClientFunction<T>(
    callback: (...args: unknown[]) => T,
    args: unknown[],
    dependencies: Record<string, unknown>,
  ): Promise<T> {
    await this.flush();
    return this.page.evaluate(
      ({ dependencyValues, functionArgs, hydrator, source }) => {
        // eslint-disable-next-line no-eval
        const hydrateDependency = eval(`(${hydrator})`);
        const hydratedDependencies = hydrateDependency(dependencyValues);
        const hydratedArgs = hydrateDependency(functionArgs);
        const names = Object.keys(hydratedDependencies);
        const values = Object.values(hydratedDependencies);
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const factory = new Function(
          ...names,
          'functionArgs',
          `return (${source})(...functionArgs);`,
        );

        return factory(...values, hydratedArgs);
      },
      {
        dependencyValues: serializeDependency(dependencies),
        functionArgs: serializeDependency(args),
        hydrator: dependencyHydratorSource,
        source: callback.toString(),
      },
    ) as Promise<T>;
  }

  private async resolveForAction(selector: SelectorBase): Promise<ElementHandle<Element>> {
    if (typeof selector === 'string') {
      return this.page.locator(selector).first().elementHandle() as Promise<ElementHandle<Element>>;
    }

    if (isSelectorReference(selector)) {
      return selector[SELECTOR_IMPL].resolveForAction(this.page);
    }

    return createSelector(selector)[SELECTOR_IMPL].resolveForAction(this.page);
  }

  private async handleRoute(route: Route): Promise<void> {
    const request = route.request();
    const body = request.postDataBuffer() || Buffer.from('');
    const requestInfo: RequestInfoAdapter = {
      body,
      headers: request.headers(),
      method: request.method().toLowerCase(),
      url: request.url(),
    };

    for (const hook of this.requestHooks) {
      if (hook instanceof RequestLoggerAdapter) {
        hook.log(requestInfo);
      }
    }

    for (const hook of this.requestHooks) {
      if (!(hook instanceof RequestMockAdapter)) {
        continue;
      }

      const rule = hook.findRule(requestInfo);
      if (!rule) {
        continue;
      }

      const headers = { ...rule.headers };
      const isStringBody = typeof rule.body === 'string' || rule.body === undefined;
      const responseBody = isStringBody ? rule.body as string | undefined : JSON.stringify(rule.body);

      if (!isStringBody && !Object.keys(headers).some((name) => name.toLowerCase() === 'content-type')) {
        headers['content-type'] = 'application/json';
      }

      await route.fulfill({
        body: responseBody,
        headers,
        status: rule.statusCode,
      });
      return;
    }

    await route.continue();
  }
}

class RequestMockAdapter {
  private readonly rules: RequestMockRule[] = [];

  private currentMatcher: RequestMatcher | null = null;

  onRequestTo(matcher: RequestMatcher): RequestMockAdapter {
    this.currentMatcher = matcher;
    return this;
  }

  respond(
    body: unknown,
    statusCode = 200,
    headers: Record<string, string> = {},
  ): RequestMockAdapter {
    if (!this.currentMatcher) {
      throw new Error('RequestMock.respond() was called before onRequestTo()');
    }

    this.rules.push({
      body,
      headers,
      matcher: this.currentMatcher,
      statusCode,
    });
    this.currentMatcher = null;
    return this;
  }

  findRule(request: RequestInfoAdapter): RequestMockRule | null {
    return this.rules.find((rule) => matchRequest(rule.matcher, request)) || null;
  }
}

class RequestLoggerAdapter {
  readonly requests: RequestInfoAdapter[] = [];

  constructor(private readonly matcher: RequestMatcher) {}

  log(request: RequestInfoAdapter): void {
    if (matchRequest(this.matcher, request)) {
      this.requests.push(request);
    }
  }

  clear(): void {
    this.requests.length = 0;
  }

  count(predicate: (request: RequestInfoAdapter) => boolean): Promise<number> {
    return Promise.resolve(this.requests.filter(predicate).length);
  }
}

function matchRequest(matcher: RequestMatcher, request: RequestInfoAdapter): boolean {
  if (typeof matcher === 'string') {
    return request.url === matcher || request.url.includes(matcher);
  }

  if (matcher instanceof RegExp) {
    return matcher.test(request.url);
  }

  return matcher(request);
}

function toPlaywrightActionOptions(options: ActionOptions): {
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
  position?: { x: number; y: number };
} {
  const modifiers: ('Alt' | 'Control' | 'Meta' | 'Shift')[] = [];

  if (options.modifiers?.alt) modifiers.push('Alt');
  if (options.modifiers?.ctrl) modifiers.push('Control');
  if (options.modifiers?.meta) modifiers.push('Meta');
  if (options.modifiers?.shift) modifiers.push('Shift');

  return {
    ...(modifiers.length ? { modifiers } : {}),
    ...(options.offsetX !== undefined || options.offsetY !== undefined
      ? { position: { x: Math.max(0, options.offsetX || 0), y: Math.max(0, options.offsetY || 0) } }
      : {}),
  };
}

function toPlaywrightKey(testCafeKey: string): string {
  return testCafeKey
    .split('+')
    .map((part) => {
      const normalized = part.toLowerCase();

      switch (normalized) {
        case 'ctrl':
          return 'Control';
        case 'alt':
          return 'Alt';
        case 'shift':
          return 'Shift';
        case 'meta':
          return 'Meta';
        case 'esc':
          return 'Escape';
        case 'right':
          return 'ArrowRight';
        case 'left':
          return 'ArrowLeft';
        case 'up':
          return 'ArrowUp';
        case 'down':
          return 'ArrowDown';
        case 'tab':
          return 'Tab';
        case 'enter':
          return 'Enter';
        default:
          return part;
      }
    })
    .join('+');
}

async function moveMouse(
  page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  speed = 1,
): Promise<void> {
  const distance = Math.hypot(endX - startX, endY - startY);
  const normalizedSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
  const steps = Math.max(12, Math.ceil(distance / (normalizedSpeed < 1 ? 10 : 20)));
  const delay = normalizedSpeed < 1 ? Math.ceil(16 / Math.sqrt(normalizedSpeed)) : 0;

  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(
      startX + ((endX - startX) * step) / steps,
      startY + ((endY - startY) * step) / steps,
    );

    if (delay) {
      await page.waitForTimeout(delay);
    }
  }
}

function serializeDependency(value: unknown): unknown {
  if (value === undefined || value === null) {
    return value;
  }

  if (value instanceof Date) {
    return { __playwrightTestCafeAdapter: 'date', value: value.toISOString() } as SerializedDependency;
  }

  if (value instanceof RegExp) {
    return {
      __playwrightTestCafeAdapter: 'regexp',
      flags: value.flags,
      source: value.source,
    } as SerializedDependency;
  }

  if (isSelectorReference(value)) {
    return {
      __playwrightTestCafeAdapter: 'selector',
      value: value[SELECTOR_IMPL].toDescriptor(),
    } as SerializedDependency;
  }

  if (typeof value === 'function') {
    const clientFunctionMeta = (value as any)[CLIENT_FUNCTION_META];

    if (clientFunctionMeta) {
      return {
        __playwrightTestCafeAdapter: 'clientFunction',
        dependencies: serializeDependency(clientFunctionMeta.dependencies) as Record<string, unknown>,
        source: clientFunctionMeta.source,
      } as SerializedDependency;
    }

    return {
      __playwrightTestCafeAdapter: 'function',
      source: value.toString(),
    } as SerializedDependency;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDependency(item));
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    Object.keys(value as Record<string, unknown>).forEach((key) => {
      result[key] = serializeDependency((value as Record<string, unknown>)[key]);
    });
    return result;
  }

  return value;
}

function clientFunction<T extends (...args: any[]) => any>(
  callback: T,
  options: { dependencies?: Record<string, unknown> } = {},
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
  with: (context: { boundTestRun?: TestControllerAdapter }) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
} {
  const run = (controller: TestControllerAdapter | null, args: Parameters<T>) => (
    new LazyClientFunctionResult(
      () => controller,
      callback,
      args,
      options.dependencies || {},
    ) as unknown as Promise<ReturnType<T>>
  );
  const callable = ((...args: Parameters<T>) => run(null, args)) as any;
  callable.with = (context: { boundTestRun?: TestControllerAdapter }) => (
    ...args: Parameters<T>
  ) => run(context.boundTestRun || null, args);
  callable[CLIENT_FUNCTION_META] = {
    dependencies: options.dependencies || {},
    source: callback.toString(),
  };

  return callable;
}

function createFixture(name: string, skip = false): FixtureState {
  const fixtureState: FixtureState = {
    ctx: {},
    name,
    pageUrl: '',
    skip,
  };
  currentFixture = fixtureState;
  return fixtureState;
}

function createFixtureChain(fixtureState: FixtureState): any {
  const chain: any = {
    after: () => chain,
    afterEach: () => chain,
    before: () => chain,
    beforeEach: () => chain,
    meta: () => chain,
    page: (pageUrl: string) => {
      fixtureState.pageUrl = pageUrl;
      return chain;
    },
  };

  chain.disablePageReloads = chain;
  return chain;
}

function createFixtureTag(skip = false): any {
  const tag = (strings: TemplateStringsArray | string, ...values: unknown[]) => {
    const name = typeof strings === 'string'
      ? strings
      : String.raw({ raw: strings }, ...values);
    const fixtureState = createFixture(name, skip);
    const chain = createFixtureChain(fixtureState);
    return chain;
  };

  tag.disablePageReloads = tag;
  tag.skip = skip ? tag : createFixtureTag(true);
  return tag;
}

function createTestChain(testState: TestState): any {
  const chain = {
    after: (callback: HookCallback) => {
      testState.afterHooks.push(callback);
      return chain;
    },
    before: (callback: HookCallback) => {
      testState.beforeHooks.push(callback);
      return chain;
    },
    meta: (meta: TestMeta) => {
      testState.meta = {
        ...testState.meta,
        ...meta,
      };
      return chain;
    },
  };

  return chain;
}

function createTestApi(): any {
  const register = (
    name: string,
    callback: TestCallback,
    meta: TestMeta = {},
    mode: 'default' | 'only' | 'skip' = 'default',
    clientScripts: (ClientScript | string)[] = [],
  ) => {
    const fixtureState = currentFixture || createFixture('Component tests');
    const testState: TestState = {
      afterHooks: [],
      beforeHooks: [],
      callback,
      clientScripts,
      fixture: fixtureState,
      meta,
      name,
      testFilePath: currentTestFilePath,
    };
    const chain = createTestChain(testState);

    const registerMode = testState.fixture.skip ? 'skip' : mode;

    if (!shouldRegisterTest(testState, registerMode)) {
      return chain;
    }

    registeredTitleIndex += 1;
    const registerFn = registerMode === 'only'
      ? playwrightTest.only
      : registerMode === 'skip'
        ? playwrightTest.skip
        : playwrightTest;
    const relativePath = relative(TEST_ROOT, currentTestFilePath);
    registerFn(`${relativePath} | ${fixtureState.name} | ${name} #${registeredTitleIndex}`, async ({ page, context }) => {
      const controller = new TestControllerAdapter(page, context, testState);
      activeController = controller;

      try {
        await prepareTestPage(page, testState);

        for (const beforeHook of testState.beforeHooks) {
          await beforeHook(controller);
          await controller.flush();
        }

        await testState.callback(controller);
        await controller.flush();

        for (const afterHook of testState.afterHooks) {
          await afterHook(controller);
          await controller.flush();
        }
      } finally {
        await clearTestPage(page).catch(() => {});
        activeController = null;
      }
    });

    return chain;
  };

  const testApi = (name: string, callback: TestCallback) => register(name, callback);
  testApi.only = (name: string, callback: TestCallback) => register(name, callback, {}, 'only');
  testApi.skip = (name: string, callback: TestCallback) => register(name, callback, {}, 'skip');
  testApi.clientScripts = (clientScripts: (ClientScript | string)[]) => (
    name: string,
    callback: TestCallback,
  ) => register(name, callback, {}, 'default', clientScripts);
  testApi.meta = (meta: TestMeta) => {
    const metaRegister = (name: string, callback: TestCallback) => register(name, callback, meta);
    metaRegister.only = (name: string, callback: TestCallback) => register(name, callback, meta, 'only');
    metaRegister.skip = (name: string, callback: TestCallback) => register(name, callback, meta, 'skip');
    return metaRegister;
  };

  return testApi;
}

function shouldRegisterTest(testState: TestState, mode: 'default' | 'only' | 'skip'): boolean {
  if (mode === 'skip') {
    return true;
  }

  registeredTestIndex += 1;

  const indices = process.env.PLAYWRIGHT_COMPONENT_INDICES || '';
  if (indices) {
    const [current, total] = indices.split(/_|of|\\|\//ig).map((x) => +x);
    const testChunk = ((registeredTestIndex - 1) % total) + 1;
    if (testChunk !== current) {
      return false;
    }
  }

  const testName = (process.env.PLAYWRIGHT_COMPONENT_TEST || '').trim();
  if (testName && testState.name !== testName) {
    return false;
  }

  if (process.env.PLAYWRIGHT_COMPONENT_SKIP_UNSTABLE !== 'false' && testState.meta.unstable) {
    return false;
  }

  if (testState.meta.runInTheme) {
    return testState.meta.runInTheme === getTheme();
  }

  const componentFolder = process.env.COMPONENT_FOLDER || '';
  if (!componentFolder && process.env.THEME) {
    return Array.isArray(testState.meta.themes) && testState.meta.themes.includes(getTheme());
  }

  return true;
}

async function prepareTestPage(page: Page, testState: TestState): Promise<void> {
  const pageUrl = normalizePageUrl(testState.fixture.pageUrl || pathToFileURL(join(TEST_ROOT, 'tests/container.html')).href);
  await addClientScripts(page, testState.clientScripts);
  await page.goto(pageUrl);
  await installEventShims(page);

  if (process.env.SHADOW_DOM === 'true' || process.env.shadowDom === 'true') {
    await loadShadowDomExtension(page);
    await addShadowRootTree(page);
  }

  if (isAccessibilityFolder()) {
    await loadAxeCore(page);
  } else {
    await page.evaluate(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }

      window.getSelection()?.removeAllRanges();
    });
    await page.locator('html').hover({ position: { x: 1, y: 1 } }).catch(() => {});
    const [width, height] = testState.meta.browserSize ?? DEFAULT_BROWSER_SIZE;
    await page.setViewportSize({ width, height });
  }

  await changeTheme(page, getTheme());
}

function normalizePageUrl(pageUrl: string): string {
  if (!pageUrl.startsWith('file://')) {
    return pageUrl;
  }

  const pagePath = fileURLToPath(pageUrl);
  if (existsSync(pagePath) || !pagePath.endsWith('container.html')) {
    return pageUrl;
  }

  return pathToFileURL(join(TEST_ROOT, 'tests/container.html')).href;
}

async function addClientScripts(page: Page, scripts: (ClientScript | string)[]): Promise<void> {
  for (const script of scripts) {
    if (typeof script === 'string') {
      await page.addInitScript({ path: script });
    } else if (script.module) {
      await page.addInitScript({ path: nodeRequire.resolve(script.module, { paths: [TEST_ROOT] }) });
    } else if (script.path) {
      await page.addInitScript({ path: script.path });
    } else if (script.content) {
      await page.addInitScript(script.content);
    }
  }
}

async function installEventShims(page: Page): Promise<void> {
  await page.evaluate(() => {
    const $ = (window as any).jQuery;

    if (!$ || $.fn.__playwrightTestCafeEventShimInstalled) {
      return;
    }

    class AutomationMouseAction {
      // eslint-disable-next-line class-methods-use-this
      _mouseup(): Promise<void> {
        return Promise.resolve();
      }
    }

    (window as any)['%testCafeAutomation%'] ??= {
      DragToElement: AutomationMouseAction,
      DragToOffset: AutomationMouseAction,
    };

    const nativePointerEvents = {
      dxpointerdown: ['pointerdown', 'mousedown'],
      dxpointermove: ['pointermove', 'mousemove'],
      dxpointerup: ['pointerup', 'mouseup'],
    };
    const originalTrigger = $.fn.trigger;

    $.fn.trigger = function triggerWithNativePointer(event, ...args) {
      const result = originalTrigger.call(this, event, ...args);
      const eventType = typeof event === 'string' ? event : event?.type;
      const nativeTypes = nativePointerEvents[eventType];

      if (!nativeTypes) {
        return result;
      }

      this.each((_, element) => {
        const target = event?.target || element;

        nativeTypes.forEach((nativeType) => {
          const isPointerEvent = nativeType.startsWith('pointer') && typeof PointerEvent !== 'undefined';
          const EventCtor = isPointerEvent ? PointerEvent : MouseEvent;
          const nativeEventInit = {
            bubbles: true,
            button: 0,
            buttons: eventType === 'dxpointerup' ? 0 : 1,
            cancelable: true,
            clientX: event?.clientX ?? event?.pageX ?? 0,
            clientY: event?.clientY ?? event?.pageY ?? 0,
            pointerId: event?.pointers?.[0]?.pointerId ?? event?.pointerId ?? 1,
            pointerType: event?.pointerType ?? 'mouse',
            screenX: event?.screenX ?? event?.pageX ?? 0,
            screenY: event?.screenY ?? event?.pageY ?? 0,
          };
          const nativeEvent = new EventCtor(nativeType, nativeEventInit);

          target.dispatchEvent(nativeEvent);
        });

        const $widget = $(target).closest('.dx-widget');
        const widgetData = $widget.data();
        const widgetNames = widgetData?.dxComponents || [];
        const hasActiveState = widgetNames.some((name) => widgetData[name]?.option?.('activeStateEnabled'));

        if (hasActiveState) {
          $widget.toggleClass('dx-state-active', eventType === 'dxpointerdown');
        }
      });

      return result;
    };

    $.fn.__playwrightTestCafeEventShimInstalled = true;
  });
}

async function changeTheme(page: Page, themeName: string): Promise<void> {
  await page.evaluate((currentTheme) => new Promise<void>((resolve) => {
    const themes = (window as any).DevExpress?.ui?.themes;
    if (!themes) {
      resolve();
      return;
    }

    themes.ready(resolve);
    themes.current(currentTheme);
  }), themeName);
}

async function waitForStableRendering(page: Page): Promise<void> {
  await page.evaluate(() => (document as any).fonts?.ready || Promise.resolve()).catch(() => {});
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve());
  })));
}

async function clearTestPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const widgetSelector = '.dx-widget';
    const $elements = $(widgetSelector)
      .filter((_, element) => $(element).parents(widgetSelector).length === 0);
    $elements.each((_, element) => {
      const $widgetElement = $(element);
      const widgetNames = $widgetElement.data().dxComponents;
      widgetNames?.forEach((name) => {
        if ($widgetElement.hasClass('dx-widget')) {
          ($widgetElement as any)[name]?.('dispose');
        }
      });
      $widgetElement.empty();
    });

    document.getElementById('focusable-start')?.remove();

    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = '';
      body.className = 'dx-surface';
      body.insertAdjacentHTML('afterbegin', `
        <div id="parentContainer" role="main">
          <h1 style="position: fixed; left: 0; top: 0; clip: rect(1px, 1px, 1px, 1px);">Test header</h1>
          <div id="container"></div>
          <div id="otherContainer"></div>
        </div>
      `);
    }

    document.querySelector('#stylesheetRules')?.remove();
  });
}

async function loadAxeCore(page: Page): Promise<void> {
  if (await page.evaluate(() => Boolean((window as any).axe))) {
    return;
  }

  const axePath = require.resolve('axe-core/axe.min.js', { paths: [TEST_ROOT] });
  await page.addScriptTag({ content: readFileSync(axePath, 'utf8') });
}

async function loadShadowDomExtension(page: Page): Promise<void> {
  const scriptPath = join(TEST_ROOT, 'helpers/shadowDom/shadowDomExtension.js');
  await page.addScriptTag({ content: readFileSync(scriptPath, 'utf8') });
}

async function addShadowRootTree(page: Page): Promise<void> {
  await page.evaluate(() => {
    const root = document.querySelector('#parentContainer') as HTMLElement;
    const { childNodes } = root;

    if (!root.shadowRoot) {
      root.attachShadow({ mode: 'open' });
    }

    const shadowContainer = document.createElement('div');
    shadowContainer.append(...Array.from(childNodes));
    root.shadowRoot!.appendChild(shadowContainer);
  });
}

async function axeCheck(
  t: TestControllerAdapter,
  selector?: unknown,
  options: Record<string, unknown> = {},
): Promise<{ error: Error | null; results: { violations: unknown[] } }> {
  await t.flush();
  await loadAxeCore(t.page);

  try {
    const results = await t.page.evaluate(
      ({ axeOptions, context }) => (window as any).axe.run(context || document, axeOptions),
      { axeOptions: options, context: selector || '#container' },
    );

    return { error: null, results };
  } catch (error) {
    return {
      error: error as Error,
      results: { violations: [] },
    };
  }
}

function createAxeReport(violations: unknown[]): string {
  return violations.map((violation) => JSON.stringify(violation)).join('\n');
}

function getComponentTestFiles(): string[] {
  const componentFolderArg = (process.env.COMPONENT_FOLDER || '').trim();
  const componentFolder = componentFolderArg ? `${componentFolderArg}/**` : '**';
  const file = (process.env.PLAYWRIGHT_COMPONENT_FILE || '*').trim();

  return glob.sync(`tests/${componentFolder}/${file}.ts`, {
    absolute: true,
    cwd: TEST_ROOT,
  }).sort();
}

export function installComponentTestAdapters(): void {
  if (adaptersInstalled) {
    return;
  }

  adaptersInstalled = true;
  process.env.theme = getTheme();
  process.env.shadowDom = process.env.shadowDom || process.env.SHADOW_DOM || 'false';

  (globalThis as any).fixture = createFixtureTag();
  (globalThis as any).test = createTestApi();

  const loadableModule = Module as typeof Module & { _load: ModuleLoader };
  const originalLoad = loadableModule._load;
  loadableModule._load = function load(request: string, parent: unknown, isMain: boolean) {
    if (request === 'testcafe') {
      return {
        ClientFunction: clientFunction,
        RequestLogger: (matcher: RequestMatcher) => new RequestLoggerAdapter(matcher),
        RequestMock: () => new RequestMockAdapter(),
        Role: () => ({}),
        Selector: (selector: SelectorBase) => createSelector(selector),
      };
    }

    if (request === '@testcafe-community/axe') {
      return {
        axeCheck,
        createReport: createAxeReport,
      };
    }

    return originalLoad.apply(this, [request, parent, isMain]);
  };
}

export function loadComponentTests(): void {
  const screenshotsPath = join(TEST_ROOT, 'screenshots');
  if (existsSync(screenshotsPath)) {
    rmSync(screenshotsPath, { recursive: true });
  }

  registeredTestIndex = 0;
  registeredTitleIndex = 0;

  for (const testFilePath of getComponentTestFiles()) {
    currentFixture = null;
    currentTestFilePath = resolve(testFilePath);
    nodeRequire(currentTestFilePath);
  }

  currentTestFilePath = '';
}

const selectorEvaluatorSource = String.raw`function evaluateSelector(descriptor) {
  const hydrate = (value) => {
    if (value && typeof value === 'object' && value.__playwrightTestCafeAdapter === 'regexp') {
      return new RegExp(value.source, value.flags);
    }
    return value;
  };
  const matchesText = (element, expected, exact) => {
    const text = element.textContent || '';
    if (expected instanceof RegExp) {
      return expected.test(text);
    }
    return exact ? text === String(expected) : text.includes(String(expected));
  };
  const isVisible = (element) => {
    const style = window.getComputedStyle(element);
    return style.visibility !== 'hidden' && style.display !== 'none' && element.getClientRects().length > 0;
  };
  const unique = (items) => Array.from(new Set(items)).filter(Boolean);
  let elements = [];

  if (descriptor.base.type === 'function') {
    // eslint-disable-next-line no-eval
    const selectorFunction = eval('(' + descriptor.base.source + ')');
    const value = selectorFunction();
    elements = value ? [value] : [];
  } else {
    elements = Array.from(document.querySelectorAll(descriptor.base.value));
  }

  for (const operation of descriptor.operations) {
    const argument = hydrate(operation.argument);
    switch (operation.type) {
      case 'find':
        elements = elements.flatMap((element) => Array.from(element.querySelectorAll(argument)));
        break;
      case 'child':
        elements = elements.flatMap((element) => Array.from(element.children)
          .filter((child) => !argument || child.matches(argument)));
        break;
      case 'filter':
        elements = elements.filter((element) => element.matches(argument));
        break;
      case 'filterVisible':
        elements = elements.filter((element) => isVisible(element));
        break;
      case 'filterHidden':
        elements = elements.filter((element) => !isVisible(element));
        break;
      case 'nth':
        elements = [argument === -1 ? elements[elements.length - 1] : elements[argument]].filter(Boolean);
        break;
      case 'parent':
        elements = unique(elements.map((element) => {
          if (typeof argument === 'number') {
            let parent = element.parentElement;
            for (let index = 0; index < argument && parent; index += 1) {
              parent = parent.parentElement;
            }
            return parent;
          }
          if (typeof argument === 'string') {
            return element.closest(argument);
          }
          return element.parentElement;
        }));
        break;
      case 'sibling':
        elements = unique(elements.flatMap((element) => Array.from(element.parentElement?.children || [])
          .filter((sibling) => sibling !== element && (!argument || sibling.matches(argument)))));
        break;
      case 'prevSibling':
        elements = unique(elements.map((element) => {
          let sibling = element.previousElementSibling;
          while (sibling && argument && !sibling.matches(argument)) {
            sibling = sibling.previousElementSibling;
          }
          return sibling;
        }));
        break;
      case 'nextSibling':
        elements = unique(elements.map((element) => {
          let sibling = element.nextElementSibling;
          while (sibling && argument && !sibling.matches(argument)) {
            sibling = sibling.nextElementSibling;
          }
          return sibling;
        }));
        break;
      case 'withText':
        elements = elements.filter((element) => matchesText(element, argument, false));
        break;
      case 'withExactText':
        elements = elements.filter((element) => matchesText(element, argument, true));
        break;
      case 'withAttribute': {
        const value = hydrate(argument.value);
        elements = elements.filter((element) => {
          if (!element.hasAttribute(argument.name)) {
            return false;
          }
          if (value === undefined) {
            return true;
          }
          const attr = element.getAttribute(argument.name) || '';
          return value instanceof RegExp ? value.test(attr) : attr === String(value);
        });
        break;
      }
      default:
        break;
    }
  }

  return elements;
}`;

const dependencyHydratorSource = String.raw`function hydrateDependency(value) {
  const selectorEvaluator = ${selectorEvaluatorSource};
  const reviveFunction = (source) => {
    try {
      // eslint-disable-next-line no-eval
      return eval('(' + source + ')');
    } catch (e) {
      // Object method shorthand serializes as "name(args) { ... }".
      // eslint-disable-next-line no-eval
      return eval('(function ' + source + ')');
    }
  };
  const hydrate = (item) => {
    if (Array.isArray(item)) {
      return item.map((value) => hydrate(value));
    }
    if (!item || typeof item !== 'object') {
      return item;
    }
    if (item.__playwrightTestCafeAdapter === 'date') {
      return new Date(item.value);
    }
    if (item.__playwrightTestCafeAdapter === 'regexp') {
      return new RegExp(item.source, item.flags);
    }
    if (item.__playwrightTestCafeAdapter === 'function') {
      return reviveFunction(item.source);
    }
    if (item.__playwrightTestCafeAdapter === 'selector') {
      const descriptor = item.value;
      return function selectorDependency() {
        return selectorEvaluator(descriptor)[0] || null;
      };
    }
    if (item.__playwrightTestCafeAdapter === 'clientFunction') {
      const dependencies = hydrate(item.dependencies || {});
      return function clientFunctionDependency(...args) {
        const names = Object.keys(dependencies);
        const values = Object.values(dependencies);
        // eslint-disable-next-line no-new-func
        const factory = new Function(...names, 'functionArgs', 'return (' + item.source + ')(...functionArgs);');
        return factory(...values, args);
      };
    }

    const result = {};
    Object.keys(item).forEach((key) => {
      result[key] = hydrate(item[key]);
    });
    return result;
  };

  return hydrate(value);
}`;

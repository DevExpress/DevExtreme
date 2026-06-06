import { expect, test as playwrightTest } from '@playwright/test';
import type { ElementHandle, Locator, Page } from '@playwright/test';
import { glob } from 'glob';
import Module, { createRequire } from 'module';
import { join, resolve } from 'path';

import {
  addClientScripts,
  DEMOS_ROOT,
  execCode,
  resetPageState,
  waitForAngularLoading,
  waitForStableRendering,
} from './common-screenshots-utils';
import {
  changeTheme,
  createMatrixTestSettings,
  FRAMEWORKS,
  globalReadFrom,
  injectStyle,
  shouldRunTestAtIndex,
  shouldRunTestExplicitly,
  THEME,
  updateMatrixTestSettings,
} from '../matrix-test-helper-core';
import { gitHubIgnored } from '../github-ignored-list';

type FrameworkKey = keyof typeof FRAMEWORKS;
type FixtureContext = { initialWindowSize?: [number, number] };
type FixtureState = { name: string; ctx: FixtureContext };
type TestCallback = (t: TestCafeControllerAdapter) => Promise<void> | void;
type PlaywrightTestRegister = (
  title: string,
  callback: (args: { page: Page }) => Promise<void>,
) => void;
type ModuleLoader = (request: string, parent: unknown, isMain: boolean) => unknown;
type TestRegistration = ((name: string, callback: TestCallback) => void) & {
  only: (name: string, callback: TestCallback) => void;
  skip: (name: string, callback: TestCallback) => void;
};

interface ClientScript {
  module?: string;
  path?: string;
  content?: string;
}

interface ActionOptions {
  offsetX?: number;
  offsetY?: number;
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  replace?: boolean;
}

const nodeRequire = createRequire(__filename);

type SelectorBase = string | (() => Element | null) | TestCafeSelector;

type SelectorOperation =
  | { type: 'nth'; index: number }
  | { type: 'find'; selector: string }
  | { type: 'child'; selector?: string }
  | { type: 'withText'; text: string }
  | { type: 'withExactText'; text: string }
  | { type: 'withAttribute'; name: string; value?: string };

class SelectorValue {
  constructor(
    private readonly selector: TestCafeSelector,
    private readonly property: 'exists' | 'count' | 'textContent' | 'hasClass',
    private readonly expectedClass?: string,
  ) {}

  async evaluate(page: Page): Promise<unknown> {
    const locator = this.selector.toLocator(page);

    switch (this.property) {
      case 'exists':
        return (await locator.count()) > 0;
      case 'count':
        return locator.count();
      case 'textContent':
        return locator.textContent();
      case 'hasClass':
        return locator.evaluate(
          (element, className) => element.classList.contains(className),
          this.expectedClass || '',
        );
      default:
        return undefined;
    }
  }
}

class TestCafeSelector {
  private readonly base: Exclude<SelectorBase, TestCafeSelector>;

  private readonly operations: SelectorOperation[];

  constructor(base: SelectorBase, operations: SelectorOperation[] = []) {
    if (base instanceof TestCafeSelector) {
      this.base = base.base;
      this.operations = [...base.operations, ...operations];
      return;
    }

    this.base = base;
    this.operations = operations;
  }

  nth(index: number): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'nth', index }]);
  }

  find(selector: string): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'find', selector }]);
  }

  child(selector?: string): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'child', selector }]);
  }

  withText(text: string): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'withText', text }]);
  }

  withExactText(text: string): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'withExactText', text }]);
  }

  withAttribute(name: string, value?: string): TestCafeSelector {
    return new TestCafeSelector(this, [{ type: 'withAttribute', name, value }]);
  }

  hasClass(className: string): SelectorValue {
    return new SelectorValue(this, 'hasClass', className);
  }

  get exists(): SelectorValue {
    return new SelectorValue(this, 'exists');
  }

  get count(): SelectorValue {
    return new SelectorValue(this, 'count');
  }

  get textContent(): SelectorValue {
    return new SelectorValue(this, 'textContent');
  }

  toLocator(page: Page): Locator {
    if (typeof this.base === 'function') {
      throw new Error('Function selectors cannot be converted to a Playwright locator');
    }

    let cssSelector = this.base;
    let locator = page.locator(cssSelector);

    for (const operation of this.operations) {
      switch (operation.type) {
        case 'find':
          cssSelector = `${cssSelector} ${operation.selector}`;
          locator = page.locator(cssSelector);
          break;
        case 'child':
          cssSelector = `${cssSelector} > ${operation.selector || '*'}`;
          locator = page.locator(cssSelector);
          break;
        case 'withAttribute':
          cssSelector = `${cssSelector}[${operation.name}${operation.value === undefined ? '' : `="${operation.value}"`}]`;
          locator = page.locator(cssSelector);
          break;
        case 'nth':
          locator = operation.index === -1
            ? locator.last()
            : locator.nth(operation.index);
          break;
        case 'withText':
          locator = locator.filter({ hasText: operation.text });
          break;
        case 'withExactText':
          locator = locator.filter({ hasText: RegExp(`^${escapeRegExp(operation.text)}$`) });
          break;
        default:
          break;
      }
    }

    return locator;
  }

  async resolveForAction(page: Page): Promise<Locator | ElementHandle<Element>> {
    if (typeof this.base !== 'function') {
      // TestCafe actions always operate on the first matching element when
      // multiple elements match a selector (non-strict by default). Use
      // .first() so the Playwright adapter replicates that behaviour instead
      // of failing with a strict-mode violation.
      return this.toLocator(page).first();
    }

    if (this.operations.length) {
      throw new Error('Function selectors do not support chained selector operations');
    }

    const handle = await page.evaluateHandle(this.base);
    const element = handle.asElement();

    if (!element) {
      throw new Error('Function selector did not resolve to an element');
    }

    return element;
  }
}

class AssertionAdapter {
  constructor(
    private readonly controller: TestCafeControllerAdapter,
    private readonly actual: unknown,
  ) {}

  ok(message?: string): TestCafeControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = await this.controller.resolveActual(this.actual);

      if (actual === undefined) {
        return;
      }

      expect(Boolean(actual), message).toBe(true);
    });
  }

  notOk(message?: string): TestCafeControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = await this.controller.resolveActual(this.actual);
      expect(Boolean(actual), message).toBe(false);
    });
  }

  eql(expected: unknown, message?: string): TestCafeControllerAdapter {
    return this.controller.enqueue(async () => {
      const actual = await this.controller.resolveActual(this.actual);
      expect(actual, message).toEqual(expected);
    });
  }
}

class TestCafeControllerAdapter implements PromiseLike<undefined> {
  readonly fixtureCtx: FixtureContext;

  readonly testRun: {
    opts: {
      'screenshots-comparer': Record<string, unknown>;
      disableScreenshots: boolean;
    };
    test: {
      testFile: {
        filename: string;
      };
    };
  };

  private chain: Promise<void> = Promise.resolve();

  constructor(
    private readonly page: Page,
    testFilePath: string,
    fixtureContext: FixtureContext,
  ) {
    this.fixtureCtx = fixtureContext;
    this.testRun = {
      opts: {
        'screenshots-comparer': {
          path: join(DEMOS_ROOT, 'testing'),
          screenshotsRelativePath: '/screenshots',
          destinationRelativePath: '/artifacts/compared-screenshots',
          ...(isMaterialTheme() ? { textMaskRadius: 2 } : {}),
        },
        disableScreenshots: false,
      },
      test: {
        testFile: {
          filename: testFilePath,
        },
      },
    };
  }

  then<TResult1 = undefined, TResult2 = never>(
    onfulfilled?: ((value: undefined) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.flush().then(onfulfilled, onrejected);
  }

  enqueue(action: () => Promise<void>): TestCafeControllerAdapter {
    this.chain = this.chain.then(action);
    return this;
  }

  async flush(): Promise<void> {
    await this.chain;
  }

  resolveActual(actual: unknown): Promise<unknown> {
    if (actual instanceof SelectorValue) {
      return actual.evaluate(this.page);
    }

    return actual instanceof Promise
      ? actual
      : Promise.resolve(actual);
  }

  expect(actual: unknown): AssertionAdapter {
    return new AssertionAdapter(this, actual);
  }

  click(selector: SelectorBase, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      const actionOptions = toPlaywrightActionOptions(options);

      if ('click' in target) {
        // TestCafe does not check for overlay elements intercepting the click.
        // force:true replicates that: Playwright still checks visibility but
        // skips the overlay/actionability check, matching TestCafe behaviour.
        await target.click({ ...actionOptions, force: true });
      }
    });
  }

  doubleClick(selector: SelectorBase, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);
      const actionOptions = toPlaywrightActionOptions(options);

      if ('dblclick' in target) {
        await target.dblclick(actionOptions);
      }
    });
  }

  rightClick(selector: SelectorBase, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);

      if ('click' in target) {
        await target.click({
          ...toPlaywrightActionOptions(options),
          button: 'right',
        });
      }
    });
  }

  hover(selector: SelectorBase, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const target = await this.resolveForAction(selector);

      if ('hover' in target) {
        await target.hover(toPlaywrightActionOptions(options));
      }
    });
  }

  typeText(selector: SelectorBase, text: string, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const locator = toLocator(await this.resolveForAction(selector));

      if (options.replace) {
        await locator.fill(text);
        return;
      }

      await locator.pressSequentially(text);
    });
  }

  pressKey(keys: string): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      for (const key of keys.split(/\s+/).filter(Boolean)) {
        await this.page.keyboard.press(toPlaywrightKey(key));
      }
    });
  }

  drag(selector: SelectorBase, dragOffsetX: number, dragOffsetY: number, options: ActionOptions = {}): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const locator = toLocator(await this.resolveForAction(selector));
      const box = await locator.boundingBox();

      if (!box) {
        throw new Error('Unable to drag an invisible element');
      }

      const startX = box.x + (options.offsetX ?? box.width / 2);
      const startY = box.y + (options.offsetY ?? box.height / 2);

      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(startX + dragOffsetX, startY + dragOffsetY, { steps: 12 });
      await this.page.mouse.up();
    });
  }

  dragToElement(selector: SelectorBase, destination: SelectorBase): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const sourceLocator = toLocator(await this.resolveForAction(selector));
      const destinationLocator = toLocator(await this.resolveForAction(destination));
      const sourceBox = await sourceLocator.boundingBox();
      const destinationBox = await destinationLocator.boundingBox();

      if (!sourceBox || !destinationBox) {
        throw new Error('Unable to drag an invisible element');
      }

      await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(
        destinationBox.x + destinationBox.width / 2,
        destinationBox.y + destinationBox.height / 2,
        { steps: 12 },
      );
      await this.page.mouse.up();
    });
  }

  scrollBy(selector: SelectorBase, x: number, y: number): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      const locator = toLocator(await this.resolveForAction(selector));
      await locator.evaluate((element, scroll) => {
        element.scrollBy(scroll.x, scroll.y);
      }, { x, y });
    });
  }

  resizeWindow(width: number, height: number): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      await this.page.setViewportSize({ width, height });
    });
  }

  wait(timeout: number): TestCafeControllerAdapter {
    return this.enqueue(async () => {
      await this.page.waitForTimeout(timeout);
    });
  }

  eval<T>(callback: () => T | Promise<T>): Promise<T> {
    return this.page.evaluate(callback);
  }

  async takeScreenshot(filePath: string): Promise<void> {
    await this.flush();
    await waitForStableRendering(this.page);
    await this.page.screenshot({
      path: filePath,
      fullPage: false,
    });
  }

  async takeElementScreenshot(selector: SelectorBase, filePath: string): Promise<void> {
    await this.flush();
    await waitForStableRendering(this.page);
    const target = await this.resolveForAction(selector);

    await target.screenshot({ path: filePath });
  }

  async evaluateClientFunction<T>(
    callback: (...args: unknown[]) => T,
    args: unknown[],
    dependencies: Record<string, unknown>,
  ): Promise<T> {
    await this.flush();
    return this.page.evaluate(
      ({ source, dependencyValues, functionArgs }) => {
        const names = Object.keys(dependencyValues);
        const values = Object.values(dependencyValues);
        // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
        const factory = new Function(
          ...names,
          'functionArgs',
          `return (${source})(...functionArgs);`,
        );

        return factory(...values, functionArgs);
      },
      {
        source: callback.toString(),
        dependencyValues: dependencies,
        functionArgs: args,
      },
    ) as Promise<T>;
  }

  private resolveForAction(selector: SelectorBase): Promise<Locator | ElementHandle<Element>> {
    if (selector instanceof TestCafeSelector) {
      return selector.resolveForAction(this.page);
    }

    if (typeof selector === 'string') {
      return Promise.resolve(this.page.locator(selector));
    }

    return new TestCafeSelector(selector).resolveForAction(this.page);
  }
}

const settings = createMatrixTestSettings({ includeManualTests: true });
const DEFAULT_WINDOW_SIZE: [number, number] = [900, 600];
const SKIPPED_TESTS: Record<string, Record<string, string[]>> = {
  jQuery: { DataGrid: ['RemoteGrouping'] },
  Angular: { DataGrid: ['RemoteGrouping'] },
  Vue: { DataGrid: ['RemoteGrouping'] },
  React: { DataGrid: ['RemoteGrouping'] },
};

let manualTestIndex = 0;
let adaptersInstalled = false;
let currentFixture: FixtureState | null = null;
let currentTestFilePath = '';
let activeController: TestCafeControllerAdapter | null = null;

function isMaterialTheme(theme = process.env.THEME || ''): boolean {
  return theme.startsWith('material');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

function toLocator(target: Locator | ElementHandle<Element>): Locator {
  if ('locator' in target) {
    return target;
  }

  throw new Error('This action requires a locator-backed selector');
}

function toPlaywrightActionOptions(options: ActionOptions): {
  position?: { x: number; y: number };
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
} {
  const modifiers: ('Alt' | 'Control' | 'Meta' | 'Shift')[] = [];

  if (options.modifiers?.alt) modifiers.push('Alt');
  if (options.modifiers?.ctrl) modifiers.push('Control');
  if (options.modifiers?.meta) modifiers.push('Meta');
  if (options.modifiers?.shift) modifiers.push('Shift');

  return {
    ...(options.offsetX !== undefined || options.offsetY !== undefined
      ? { position: { x: Math.max(0, options.offsetX || 0), y: Math.max(0, options.offsetY || 0) } }
      : {}),
    ...(modifiers.length ? { modifiers } : {}),
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

function createFixture(name: string): {
  before: (callback: (ctx: FixtureContext) => void | Promise<void>) => unknown;
} {
  const fixtureState: FixtureState = { name, ctx: {} };
  currentFixture = fixtureState;

  return {
    before: (callback) => {
      callback(fixtureState.ctx);
      return fixtureState;
    },
  };
}

function getDemosBaseUrl(): string {
  return (process.env.PLAYWRIGHT_DEMOS_BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
}

function getManualTestStyles(demoName: string): string {
  switch (demoName) {
    case 'EditorAppearanceVariants':
      return '.dx-toast-wrapper { display: none !important; }';
    case 'VirtualScrolling':
    case 'StatePersistence':
    case 'EditStateManagement':
    case 'BatchUpdateRequest':
      return '.dx-scrollable-scroll { visibility: visible !important; }';
    default:
      return '';
  }
}

function shouldSkipManualDemo(framework: string, widget: string, demo: string): boolean {
  return SKIPPED_TESTS[framework]?.[widget]?.includes(demo) || false;
}

function getManualTestUrl(
  widget: string,
  demo: string,
  approach: string,
  options: { updateTheme?: boolean } = {},
): string | null {
  const baseUrl = getDemosBaseUrl();

  if (process.env.ISGITHUBDEMOS) {
    if (widget !== 'DataGrid' || gitHubIgnored.includes(demo)) {
      return null;
    }

    const theme = (process.env.THEME || THEME.generic).replace('generic.', '');
    return `${baseUrl}/${widget}/${demo}/${approach}/?theme=dx.${theme}`;
  }

  if (options.updateTheme) {
    changeTheme(DEMOS_ROOT, `Demos/${widget}/${demo}/${approach}/index.html`, process.env.THEME);
  }

  return `${baseUrl}/apps/demos/Demos/${widget}/${demo}/${approach}/`;
}

async function prepareManualTestPage(
  page: Page,
  widget: string,
  demo: string,
  approach: string,
  fixtureContext: FixtureContext,
): Promise<string | null> {
  const pageUrl = getManualTestUrl(widget, demo, approach, { updateTheme: true });
  if (!pageUrl) {
    return null;
  }

  const [width, height] = fixtureContext.initialWindowSize || DEFAULT_WINDOW_SIZE;
  const clientScriptSource = globalReadFrom(
    DEMOS_ROOT,
    `Demos/${widget}/${demo}/client-script.js`,
    (source) => [{ content: source }],
  ) || [];
  const testCodeSource = globalReadFrom(
    DEMOS_ROOT,
    `Demos/${widget}/${demo}/test-code.js`,
    (source) => source,
  ) || '';
  const testStyles = getManualTestStyles(demo);
  const globalTestStyles = globalReadFrom(
    DEMOS_ROOT,
    'utils/visual-tests/inject/test-styles.css',
    (source) => source,
  ) || '';

  const clientScripts: (ClientScript | string)[] = [
    { module: 'mockdate' },
    join(DEMOS_ROOT, 'utils/visual-tests/inject/test-utils.js'),
    { content: injectStyle(globalTestStyles) },
    ...(testStyles ? [{ content: injectStyle(testStyles) }] : []),
    ...(clientScriptSource as ClientScript[]),
  ];

  await page.setViewportSize({ width, height });
  await addClientScripts(page, clientScripts);
  await page.goto(pageUrl);
  await resetPageState(page);

  if (testCodeSource) {
    await execCode(page, testCodeSource);
  }

  if (approach === FRAMEWORKS.angular) {
    await waitForAngularLoading(page);
  }

  return pageUrl;
}

function registerManualTest(
  register: PlaywrightTestRegister,
  title: string,
  callback: TestCallback,
  widget: string,
  demo: string,
  approach: string,
  fixtureContext: FixtureContext,
  testFilePath: string,
): void {
  register(title, async ({ page }) => {
    const pageUrl = await prepareManualTestPage(page, widget, demo, approach, fixtureContext);
    if (!pageUrl) {
      return;
    }

    const controller = new TestCafeControllerAdapter(page, testFilePath, fixtureContext);
    activeController = controller;

    try {
      await callback(controller);
      await controller.flush();
    } finally {
      activeController = null;
    }
  });
}

function createTestRegistration(
  widget: string,
  demo: string,
  approach: string,
  fixtureContext: FixtureContext,
  testFilePath: string,
): TestRegistration {
  const register = (name: string, callback: TestCallback): void => registerManualTest(
    playwrightTest,
    name,
    callback,
    widget,
    demo,
    approach,
    fixtureContext,
    testFilePath,
  );

  register.only = (name: string, callback: TestCallback): void => registerManualTest(
    playwrightTest.only as PlaywrightTestRegister,
    name,
    callback,
    widget,
    demo,
    approach,
    fixtureContext,
    testFilePath,
  );
  register.skip = (name: string, callback: TestCallback): void => registerManualTest(
    playwrightTest.skip as PlaywrightTestRegister,
    name,
    callback,
    widget,
    demo,
    approach,
    fixtureContext,
    testFilePath,
  );

  return register;
}

function runManualTest(widget: string, demo: string, callback: (test: TestRegistration) => void): void {
  if (process.env.STRATEGY === 'accessibility') {
    return;
  }

  const frameworkKey = (settings.targetFramework || 'jquery').toLowerCase() as FrameworkKey;
  const approach = FRAMEWORKS[frameworkKey];

  if (!approach || shouldSkipManualDemo(approach, widget, demo)) {
    return;
  }

  manualTestIndex += 1;
  if (!shouldRunTestAtIndex(settings, manualTestIndex)) {
    return;
  }

  const pageUrl = getManualTestUrl(widget, demo, approach);
  if (!pageUrl || !shouldRunTestExplicitly(settings, pageUrl)) {
    return;
  }

  const fixtureContext = currentFixture?.ctx || {};
  const fixtureName = currentFixture?.name || `${widget}.${demo}`;
  const testFilePath = currentTestFilePath;

  playwrightTest.describe(`${approach} ${fixtureName}`, () => {
    callback(createTestRegistration(
      widget,
      demo,
      approach,
      fixtureContext,
      testFilePath,
    ));
  });
}

function clientFunction<T extends (...args: any[]) => any>(
  callback: T,
  options: { dependencies?: Record<string, unknown> } = {},
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>) => {
    if (!activeController) {
      return Promise.reject(new Error('ClientFunction was called outside of a Playwright manual test'));
    }

    return activeController.evaluateClientFunction(
      callback,
      args,
      options.dependencies || {},
    ) as Promise<ReturnType<T>>;
  };
}

const testCafeShim = {
  Selector: (selector: SelectorBase): TestCafeSelector => new TestCafeSelector(selector),
  ClientFunction: clientFunction,
};

const matrixHelperShim = {
  runManualTest,
  FRAMEWORKS,
};

export function installManualTestAdapters(): void {
  if (adaptersInstalled) {
    return;
  }

  updateMatrixTestSettings(settings);
  manualTestIndex = settings.current ? settings.current - 1 : 0;
  adaptersInstalled = true;

  // eslint-disable-next-line no-undef
  (globalThis as typeof globalThis & { fixture?: typeof createFixture }).fixture = createFixture;

  const loadableModule = Module as typeof Module & { _load: ModuleLoader };
  const originalLoad = loadableModule._load;
  loadableModule._load = function load(request: string, parent: unknown, isMain: boolean) {
    if (request === 'testcafe') {
      return testCafeShim;
    }

    if (request.includes('utils/visual-tests/matrix-test-helper')) {
      return matrixHelperShim;
    }

    return originalLoad.apply(this, [request, parent, isMain]);
  };
}

export function loadWidgetTests(): void {
  const widgetTestFiles = glob.sync('testing/widgets/**/*.test.ts', {
    cwd: DEMOS_ROOT,
    absolute: true,
  }).sort();

  for (const testFile of widgetTestFiles) {
    currentTestFilePath = resolve(testFile);
    nodeRequire(currentTestFilePath);
  }

  currentTestFilePath = '';
}

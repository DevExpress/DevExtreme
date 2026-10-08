import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import { computeStyleSheetsHash, getShadowElementsFromPoint } from '@ts/core/utils/m_shadow_dom';

const createSheet = (rules: string[] | 'cross-origin'): CSSStyleSheet => ({
  get cssRules() {
    if (rules === 'cross-origin') {
      throw new Error('cross-origin');
    }

    return rules.map((cssText) => ({ cssText }));
  },
}) as unknown as CSSStyleSheet;

describe('Shadow DOM utils', () => {
  describe('computeStyleSheetsHash', () => {
    it('should return the offset basis for no style sheets', () => {
      expect(computeStyleSheetsHash([])).toBe(2166136261);
    });

    it('should compute the hash of the rule texts', () => {
      expect(computeStyleSheetsHash([createSheet(['.a{color:red}'])])).toBe(2242418873);
      expect(computeStyleSheetsHash([createSheet(['x'.repeat(5000), 'ÿ€😀'])])).toBe(939802646);
    });

    it('should return a different hash for different rules', () => {
      const hash = computeStyleSheetsHash([createSheet(['.a{color:red}'])]);

      expect(computeStyleSheetsHash([createSheet(['.a{color:blue}'])])).not.toBe(hash);
      expect(computeStyleSheetsHash([createSheet(['.a{color:red}', '.b{}'])])).not.toBe(hash);
    });

    it('should return the same hash for the style sheets with the same rules', () => {
      expect(computeStyleSheetsHash([createSheet(['.same{}'])]))
        .toBe(computeStyleSheetsHash([createSheet(['.same{}'])]));
    });

    it('should not depend on the order of the style sheets', () => {
      const first = createSheet(['.a{}']);
      const second = createSheet(['.b{}']);
      const third = createSheet(['.c{}', '.d{}']);

      expect(computeStyleSheetsHash([first, second, third])).toBe(4210407800);
      expect(computeStyleSheetsHash([third, second, first])).toBe(4210407800);
    });

    it('should neutralize a style sheet that is passed twice', () => {
      const sheet = createSheet(['.a{}']);

      expect(computeStyleSheetsHash([sheet, sheet])).toBe(2166136261);
    });

    it('should return 0 for a style sheet without rules', () => {
      expect(computeStyleSheetsHash([createSheet([])])).toBe(0);
    });

    it('should ignore a style sheet whose rules are not accessible', () => {
      expect(computeStyleSheetsHash([createSheet('cross-origin')])).toBe(0);
      expect(computeStyleSheetsHash([
        createSheet('cross-origin'),
        createSheet(['.a{color:red}']),
      ])).toBe(78906748);
    });

    it('should read the rules of a style sheet only once', () => {
      let reads = 0;
      const countedSheet = {
        get cssRules() {
          reads += 1;

          return [{ cssText: '.counted{}' }];
        },
      } as unknown as CSSStyleSheet;

      const other = createSheet(['.other{}']);
      const first = computeStyleSheetsHash([countedSheet, other]);
      const second = computeStyleSheetsHash([other, countedSheet]);

      expect(second).toBe(first);
      expect(reads).toBe(1);
    });

    it('should accept any iterable of style sheets', () => {
      const sheet = createSheet(['.set{}']);

      expect(computeStyleSheetsHash(new Set([sheet]))).toBe(computeStyleSheetsHash([sheet]));
    });
  });

  describe('getShadowElementsFromPoint', () => {
    const roots: HTMLElement[] = [];

    interface Rect {
      left: number;
      top: number;
      right: number;
      bottom: number;
    }

    const createElement = (
      tag: string,
      id: string,
      rect?: Rect,
      pointerEvents?: string,
    ): HTMLElement => {
      const element = document.createElement(tag);

      element.id = id;

      if (rect) {
        element.getBoundingClientRect = (): DOMRect => rect as DOMRect;
      }
      if (pointerEvents) {
        element.style.pointerEvents = pointerEvents;
      }

      return element;
    };

    const rectangle = (
      left: number,
      top: number,
      width: number,
      height: number,
    ): Rect => ({
      left, top, right: left + width, bottom: top + height,
    });

    const createRoot = (): HTMLElement => {
      const root = document.createElement('div');

      document.body.appendChild(root);
      roots.push(root);

      return root;
    };

    const getIds = (x: number, y: number, root: Node): string[] => (
      getShadowElementsFromPoint(x, y, root).map((element) => (element as HTMLElement).id)
    );

    afterEach(() => {
      roots.splice(0).forEach((root) => root.remove());
    });

    it('should return the elements under the point from the deepest one to the topmost one', () => {
      const root = createRoot();
      const first = createElement('div', 'first', rectangle(0, 0, 100, 100));
      const second = createElement('div', 'second', rectangle(10, 10, 50, 50));
      const third = createElement('span', 'third', rectangle(20, 20, 10, 10));
      const other = createElement('div', 'other', rectangle(200, 200, 10, 10));

      root.appendChild(first);
      first.appendChild(second);
      second.appendChild(third);
      root.appendChild(other);

      expect(getIds(25, 25, root)).toEqual(['third', 'second', 'first']);
      expect(getIds(5, 5, root)).toEqual(['first']);
      expect(getIds(205, 205, root)).toEqual(['other']);
      expect(getIds(500, 500, root)).toEqual([]);
    });

    it('should include the top and left edges of an element and exclude the bottom and right ones', () => {
      const root = createRoot();

      root.appendChild(createElement('div', 'element', rectangle(0, 0, 100, 100)));

      expect(getIds(0, 0, root)).toEqual(['element']);
      expect(getIds(99.9, 99.9, root)).toEqual(['element']);
      expect(getIds(100, 50, root)).toEqual([]);
      expect(getIds(50, 100, root)).toEqual([]);
    });

    it('should list the elements breadth first and reverse the order', () => {
      const root = createRoot();
      const area = rectangle(0, 0, 100, 100);
      const elements = ['l1a', 'l1b', 'l2a', 'l2b', 'l3'].map((id) => createElement('div', id, area));
      const [l1a, l1b, l2a, l2b, l3] = elements;

      root.appendChild(l1a);
      root.appendChild(l1b);
      l1a.appendChild(l2a);
      l1b.appendChild(l2b);
      l2a.appendChild(l3);

      expect(getIds(5, 5, root)).toEqual(['l3', 'l2b', 'l2a', 'l1b', 'l1a']);
    });

    it('should skip the elements that do not catch the pointer together with their children', () => {
      const root = createRoot();
      const element = createElement('div', 'element', rectangle(0, 0, 100, 100), 'none');

      element.appendChild(createElement('div', 'child', rectangle(0, 0, 100, 100)));
      root.appendChild(element);

      expect(getIds(10, 10, root)).toEqual([]);
    });

    it('should skip the nodes that are not elements and the elements without a rectangle', () => {
      const root = createRoot();
      const withoutRectangle = createElement('div', 'without-rectangle');

      (withoutRectangle as { getBoundingClientRect?: unknown }).getBoundingClientRect = undefined;
      root.appendChild(document.createTextNode('text'));
      root.appendChild(document.createComment('comment'));
      root.appendChild(withoutRectangle);
      root.appendChild(createElement('div', 'element', rectangle(0, 0, 10, 10)));

      expect(getIds(1, 1, root)).toEqual(['element']);
    });

    it('should return an empty array for a root without children', () => {
      expect(getShadowElementsFromPoint(0, 0, createRoot())).toEqual([]);
    });
  });

  describe('addShadowDomStyles', () => {
    class FakeStyleSheet {
      cssRules: { cssText: string }[] = [];

      insertRule(cssText: string, index: number): number {
        this.cssRules.splice(index, 0, { cssText });

        return index;
      }
    }

    const originalStyleSheet = window.CSSStyleSheet;

    const setStyleSheetConstructor = (value: unknown): void => {
      Object.defineProperty(window, 'CSSStyleSheet', { value, configurable: true, writable: true });
    };

    const createRules = (rules: object[]): { cssText: string }[] => rules.map((rule, index) => ({
      cssText: `rule-${index}`,
      ...rule,
    }));

    const createStyleSheetOf = (rules: object[] | 'cross-origin'): CSSStyleSheet => ({
      get cssRules() {
        if (rules === 'cross-origin') {
          throw new Error('cross-origin');
        }

        return createRules(rules);
      },
    }) as unknown as CSSStyleSheet;

    interface FakeRoot {
      host?: object;
      styleSheets: CSSStyleSheet[];
      adoptedStyleSheets?: FakeStyleSheet[];
    }

    const createWrapper = (
      root: unknown,
      documentSheets: CSSStyleSheet[] = [],
    ): dxElementWrapper => {
      const element = {
        getRootNode: (): unknown => root,
        ownerDocument: { styleSheets: documentSheets },
      };

      return { get: () => element } as unknown as dxElementWrapper;
    };

    const createRoot = (sheets: CSSStyleSheet[]): FakeRoot => ({ host: {}, styleSheets: sheets });

    type ShadowDomModule = typeof import('@ts/core/utils/m_shadow_dom');

    const load = (): ShadowDomModule => {
      jest.resetModules();

      return jest.requireActual<ShadowDomModule>('@ts/core/utils/m_shadow_dom');
    };

    const getTexts = (sheet: FakeStyleSheet): string[] => (
      sheet.cssRules.map((rule) => rule.cssText)
    );

    beforeEach(() => {
      setStyleSheetConstructor(FakeStyleSheet);
    });

    afterEach(() => {
      setStyleSheetConstructor(originalStyleSheet);
    });

    it('should do nothing when copying styles to the shadow DOM is disabled', () => {
      const { addShadowDomStyles } = load();
      const config = jest.requireActual<typeof import('@js/core/config')>('@js/core/config').default;
      const root = createRoot([]);

      config({ copyStylesToShadowDom: false });
      addShadowDomStyles(createWrapper(root));

      expect(root.adoptedStyleSheets).toBeUndefined();
    });

    it('should do nothing for an element that is not in a shadow root', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([]);

      delete root.host;

      addShadowDomStyles(createWrapper(root));
      addShadowDomStyles(createWrapper(undefined));

      expect(root.adoptedStyleSheets).toBeUndefined();
    });

    it('should adopt the document style sheet and the style sheet of the shadow root', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([]);

      addShadowDomStyles(createWrapper(root));

      expect(root.adoptedStyleSheets).toHaveLength(2);
      expect(root.adoptedStyleSheets?.[0]).toBeInstanceOf(FakeStyleSheet);
      expect(root.adoptedStyleSheets?.[1]).toBeInstanceOf(FakeStyleSheet);
      expect(root.adoptedStyleSheets?.[0]).not.toBe(root.adoptedStyleSheets?.[1]);
    });

    it('should copy only the DevExtreme rules of the document style sheets', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([]);
      const documentSheet = createStyleSheetOf([
        { selectorText: '.dx-button' },
        { selectorText: '.other' },
        { cssRules: [{ selectorText: '.dx-in-media' }] },
        { cssRules: [{ selectorText: '.other-in-media' }] },
        { name: 'dx-keyframes' },
        { name: 'other-keyframes' },
        { style: { fontFamily: 'DXIcons' } },
        { style: { fontFamily: 'Arial' } },
        {},
      ]);

      addShadowDomStyles(createWrapper(root, [documentSheet]));

      expect(getTexts((root.adoptedStyleSheets as FakeStyleSheet[])[0])).toEqual([
        'rule-0', 'rule-2', 'rule-4', 'rule-6',
      ]);
    });

    it('should copy all the rules of the shadow root style sheets', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([
        createStyleSheetOf([{ selectorText: '.local' }, { selectorText: '.dx-local' }]),
        createStyleSheetOf([{}]),
      ]);

      addShadowDomStyles(createWrapper(root));

      expect(getTexts((root.adoptedStyleSheets as FakeStyleSheet[])[1])).toEqual([
        'rule-0', 'rule-1', 'rule-0',
      ]);
    });

    it('should skip the style sheets with not accessible rules', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([createStyleSheetOf('cross-origin'), createStyleSheetOf([{}])]);
      const documentSheets = [
        createStyleSheetOf('cross-origin'),
        createStyleSheetOf([{ selectorText: '.dx-button' }]),
      ];

      addShadowDomStyles(createWrapper(root, documentSheets));

      expect(getTexts((root.adoptedStyleSheets as FakeStyleSheet[])[0])).toEqual(['rule-0']);
      expect(getTexts((root.adoptedStyleSheets as FakeStyleSheet[])[1])).toEqual(['rule-0']);
    });

    it('should not process the shadow root again while its style sheets are not changed', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([createStyleSheetOf([{}])]);
      const wrapper = createWrapper(root);

      addShadowDomStyles(wrapper);
      const adopted = root.adoptedStyleSheets;
      addShadowDomStyles(wrapper);

      expect(root.adoptedStyleSheets).toBe(adopted);
    });

    it('should process the shadow root again when its style sheets are changed', () => {
      const { addShadowDomStyles } = load();
      const root = createRoot([createStyleSheetOf([{}])]);
      const wrapper = createWrapper(root);

      addShadowDomStyles(wrapper);
      const adopted = root.adoptedStyleSheets as FakeStyleSheet[];
      root.styleSheets.push(createStyleSheetOf([{}, {}]));
      addShadowDomStyles(wrapper);

      expect(root.adoptedStyleSheets).not.toBe(adopted);
      expect(root.adoptedStyleSheets?.[0]).toBe(adopted[0]);
      expect(root.adoptedStyleSheets?.[1]).not.toBe(adopted[1]);
      expect(getTexts((root.adoptedStyleSheets as FakeStyleSheet[])[1])).toEqual([
        'rule-0', 'rule-0', 'rule-1',
      ]);
    });

    it('should build the document style sheet only once for all the shadow roots', () => {
      const { addShadowDomStyles } = load();
      const first = createRoot([]);
      const second = createRoot([createStyleSheetOf([{}])]);
      const documentSheets = [createStyleSheetOf([{ selectorText: '.dx-button' }])];

      addShadowDomStyles(createWrapper(first, documentSheets));
      addShadowDomStyles(createWrapper(second, []));

      expect(second.adoptedStyleSheets?.[0]).toBe(first.adoptedStyleSheets?.[0]);
      expect(getTexts((second.adoptedStyleSheets as FakeStyleSheet[])[0])).toEqual(['rule-0']);
    });

    it('should create a style element when the constructed style sheets are not supported', () => {
      setStyleSheetConstructor(() => {
        throw new Error('not supported');
      });

      const { addShadowDomStyles } = load();
      const sheets: FakeStyleSheet[] = [];
      const appended: unknown[] = [];
      const root = {
        host: {},
        styleSheets: [] as CSSStyleSheet[],
        adoptedStyleSheets: undefined as unknown,
        ownerDocument: {
          createElement: (tag: string): { tag: string; sheet: FakeStyleSheet } => {
            const sheet = new FakeStyleSheet();

            sheets.push(sheet);

            return { tag, sheet };
          },
        },
        appendChild: (node: unknown): number => appended.push(node),
      };

      addShadowDomStyles(createWrapper(root));

      expect(appended).toHaveLength(2);
      expect(appended).toEqual([
        { tag: 'style', sheet: sheets[0] },
        { tag: 'style', sheet: sheets[1] },
      ]);
      expect(root.adoptedStyleSheets).toEqual(sheets);
    });
  });
});

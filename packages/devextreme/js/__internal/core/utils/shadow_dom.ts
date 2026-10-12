import config from '@js/core/config';
import type { dxElementWrapper } from '@js/core/renderer';

const DX_RULE_PREFIX = 'dx-';

type RuleLike = CSSRule
  & Partial<Pick<CSSStyleRule, 'selectorText' | 'style'>>
  & { name?: string; cssRules?: ArrayLike<RuleLike> };

interface Queue<T> {
  push: (this: Queue<T>, item: T) => Queue<T>;
  shift: () => T;
  readonly length: number;
  readonly items: T[];
}

let ownerDocumentStyleSheet: CSSStyleSheet | null = null;

function createConstructedStyleSheet(rootNode: ShadowRoot): CSSStyleSheet | null {
  try {
    return new CSSStyleSheet();
  } catch (err) {
    const styleElement = rootNode.ownerDocument.createElement('style');

    rootNode.appendChild(styleElement);

    return styleElement.sheet;
  }
}

const isShadowRoot = (node: Node | undefined): node is ShadowRoot => node !== undefined
  && 'host' in node
  && Boolean(node.host);

const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;

function insertRule(
  targetStyleSheet: CSSStyleSheet,
  rule: RuleLike,
  needApplyAllStyles: boolean,
): void {
  const isDxRule = needApplyAllStyles
                     || rule.selectorText?.includes(DX_RULE_PREFIX)
                     || rule.cssRules?.[0]?.selectorText?.includes(DX_RULE_PREFIX)
                     || rule.name?.startsWith(DX_RULE_PREFIX)
                     || rule.style?.fontFamily === 'DXIcons';

  if (isDxRule) {
    targetStyleSheet.insertRule(
      rule.cssText,
      targetStyleSheet.cssRules.length,
    );
  }
}

function processRules(
  targetStyleSheet: CSSStyleSheet,
  styleSheets: Iterable<CSSStyleSheet>,
  needApplyAllStyles: boolean,
): void {
  for (const sheet of styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        insertRule(targetStyleSheet, rule, needApplyAllStyles);
      }
    } catch (err) {
      // NOTE: need try/catch block for not-supported cross-domain css
    }
  }
}

const FNV_OFFSET_BASIS = 2166136261;
const sheetHashes = new WeakMap<CSSStyleSheet, number>();
export function computeStyleSheetsHash(styleSheets: Iterable<CSSStyleSheet>): number {
  let hash = FNV_OFFSET_BASIS;

  for (const sheet of styleSheets) {
    const cachedHash = sheetHashes.get(sheet);
    if (cachedHash !== undefined) {
      // eslint-disable-next-line no-bitwise -- FNV hash
      hash ^= cachedHash;
      // eslint-disable-next-line no-continue -- the cached sheet is done
      continue;
    }

    let localHash = FNV_OFFSET_BASIS;
    try {
      for (const rule of sheet.cssRules) {
        const text = rule.cssText;
        // eslint-disable-next-line max-depth -- the loop over the characters of a rule
        for (let i = 0; i < text.length; i += 1) {
          // eslint-disable-next-line no-bitwise -- FNV hash
          localHash ^= text.charCodeAt(i);
          // eslint-disable-next-line no-bitwise -- FNV hash
          localHash += (localHash << 1) + (localHash << 4) + (localHash << 7) + (localHash << 8)
            // eslint-disable-next-line no-bitwise -- FNV hash
            + (localHash << 24);
        }
      }
    } catch (_) {
      // ignore
    }

    // eslint-disable-next-line no-bitwise -- FNV hash
    localHash >>>= 0;
    sheetHashes.set(sheet, localHash);
    // eslint-disable-next-line no-bitwise -- FNV hash
    hash ^= localHash;
  }

  // eslint-disable-next-line no-bitwise -- FNV hash
  return hash >>> 0;
}

const styleSheetHashes = new WeakMap<ShadowRoot, number>();

export function addShadowDomStyles($element: dxElementWrapper): void {
  if (!config().copyStylesToShadowDom) {
    return;
  }

  const el = $element.get(0);
  const root = el.getRootNode?.();
  if (!isShadowRoot(root)) return;

  if (!ownerDocumentStyleSheet) {
    ownerDocumentStyleSheet = createConstructedStyleSheet(root);
    if (ownerDocumentStyleSheet) {
      processRules(ownerDocumentStyleSheet, el.ownerDocument.styleSheets, false);
    }
  }

  const localHash = computeStyleSheetsHash(root.styleSheets);
  if (styleSheetHashes.get(root) === localHash) return;

  styleSheetHashes.set(root, localHash);

  const currentShadowDomStyleSheet = createConstructedStyleSheet(root);
  if (!ownerDocumentStyleSheet || !currentShadowDomStyleSheet) return;

  processRules(currentShadowDomStyleSheet, root.styleSheets, true);

  root.adoptedStyleSheets = [ownerDocumentStyleSheet, currentShadowDomStyleSheet];
}

function isPositionInElementRectangle(element: Element, x: number, y: number): boolean {
  const rect = element.getBoundingClientRect?.();

  return rect && x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}

function createQueue<T>(): Queue<T> {
  let shiftIndex = 0;
  const items: T[] = [];

  return {
    push(this: Queue<T>, item: T): Queue<T> {
      items.push(item);
      return this;
    },

    shift(): T {
      shiftIndex += 1;
      return items[shiftIndex - 1];
    },

    get length(): number {
      return items.length - shiftIndex;
    },

    get items(): T[] {
      return items;
    },
  };
}

export function getShadowElementsFromPoint(x: number, y: number, root: Node): Node[] {
  const elementQueue = createQueue<Node>().push(root);

  while (elementQueue.length) {
    const el = elementQueue.shift();

    for (const childNode of el.childNodes) {
      if (isElement(childNode)
               && isPositionInElementRectangle(childNode, x, y)

               && getComputedStyle(childNode).pointerEvents !== 'none'
      ) {
        elementQueue.push(childNode);
      }
    }
  }

  const result = elementQueue.items.reverse();

  result.pop();

  return result;
}

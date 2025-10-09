const DX_RULE_PREFIX = 'dx-';

let ownerDocumentStyleSheet = null;

function createConstructedStyleSheet(rootNode) {
  try {
    return new CSSStyleSheet();
  } catch (err) {
    const styleElement = rootNode.ownerDocument.createElement('style');

    rootNode.appendChild(styleElement);

    return styleElement.sheet;
  }
}

function processRules(targetStyleSheet, styleSheets, needApplyAllStyles) {
  for (let i = 0; i < styleSheets.length; i++) {
    const sheet = styleSheets[i];
    try {
      for (let j = 0; j < sheet.cssRules.length; j++) {
        insertRule(targetStyleSheet, sheet.cssRules[j], needApplyAllStyles);
      }
    } catch (err) {
      // NOTE: need try/catch block for not-supported cross-domain css
    }
  }
}

function insertRule(targetStyleSheet, rule, needApplyAllStyles) {
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

const sheetHashes = new WeakMap();
export function computeStyleSheetsHash(styleSheets) {
  let hash = 2166136261;

  for (const sheet of styleSheets) {
    if (sheetHashes.has(sheet)) {
      hash ^= sheetHashes.get(sheet);
      continue;
    }

    let localHash = 2166136261;
    try {
      for (const rule of sheet.cssRules) {
        const text = rule.cssText;
        for (let i = 0; i < text.length; i++) {
          localHash ^= text.charCodeAt(i);
          localHash += (localHash << 1) + (localHash << 4) + (localHash << 7) + (localHash << 8) + (localHash << 24);
        }
      }
    } catch (_) {
      // ignore
    }

    localHash >>>= 0;
    sheetHashes.set(sheet, localHash);
    hash ^= localHash;
  }

  return hash >>> 0;
}

const injectedRootStates = new WeakMap();

export function addShadowDomStyles($element) {
  const el = $element.get(0);
  const root = el.getRootNode?.();
  if (!root?.host) return;

  let state = injectedRootStates.get(root);
  if (!state) {
    state = {
      injectedGlobal: false,
      lastLocalHash: null,
    };
    injectedRootStates.set(root, state);
  }

  if (!ownerDocumentStyleSheet && !state.injectedGlobal) {
    ownerDocumentStyleSheet = createConstructedStyleSheet(root);
    processRules(ownerDocumentStyleSheet, el.ownerDocument.styleSheets, false);
    state.injectedGlobal = true;
  }

  const localHash = computeStyleSheetsHash(root.styleSheets);
  if (state.lastLocalHash === localHash) return;

  state.lastLocalHash = localHash;

  const currentShadowDomStyleSheet = createConstructedStyleSheet(root);
  processRules(currentShadowDomStyleSheet, root.styleSheets, true);

  root.adoptedStyleSheets = [ownerDocumentStyleSheet, currentShadowDomStyleSheet];
}

function isPositionInElementRectangle(element, x, y) {
  const rect = element.getBoundingClientRect?.();

  return rect && x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}

function createQueue() {
  let shiftIndex = 0;
  const items: any[] = [];

  return {
    push(item) {
      items.push(item);
      return this;
    },

    shift() {
      shiftIndex++;
      return items[shiftIndex - 1];
    },

    get length() {
      return items.length - shiftIndex;
    },

    get items() {
      return items;
    },
  };
}

export function getShadowElementsFromPoint(x, y, root) {
  const elementQueue = createQueue().push(root);

  while (elementQueue.length) {
    const el = elementQueue.shift();

    for (let i = 0; i < el.childNodes.length; i++) {
      const childNode = el.childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE
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

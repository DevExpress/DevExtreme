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

const injectedHashes = new WeakMap();

function computeStyleSheetsHash(...styleSheetLists) {
  const hashes: string[] = [];

  for (const list of styleSheetLists) {
    for (const sheet of list) {
      try {
        const rules = Array.from(sheet.cssRules).map((r: any) => r.cssText).join(';');
        hashes.push(rules);
      } catch (_) {
        continue;
      }
    }
  }

  return hashes.join('|').length;
}

export function addShadowDomStyles($element) {
  const el = $element.get(0);
  const root = el.getRootNode?.();

  if (!root?.host) return;

  const allRulesHash = computeStyleSheetsHash(el.ownerDocument.styleSheets, root.styleSheets);
  const prevHash = injectedHashes.get(root);
  if (prevHash === allRulesHash) return;

  injectedHashes.set(root, allRulesHash);

  if (!ownerDocumentStyleSheet) {
    ownerDocumentStyleSheet = createConstructedStyleSheet(root);

    processRules(ownerDocumentStyleSheet, el.ownerDocument.styleSheets, false);
  }

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

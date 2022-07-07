const DX_RULE_PREFIX = 'dx-';

let constructedStyleSheet = null;

function createConstructedStyleSheet(rootNode) {
    try {
        // eslint-disable-next-line no-undef
        return new CSSStyleSheet();
    } catch(err) {
        const styleElement = rootNode.ownerDocument.createElement('style');

        rootNode.appendChild(styleElement);

        return styleElement.sheet;
    }
}

function processRules(styleSheets, needApplyAllStyles) {
    for(let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        try {
            for(let j = 0; j < sheet.cssRules.length; j++) {
                insertRule(sheet.cssRules[j], needApplyAllStyles);
            }
        } catch(err) {
            // NOTE: need try/catch block for not-supported cross-domain css
        }
    }
}

function insertRule(rule, needApplyAllStyles) {
    const isDxRule = needApplyAllStyles ||
                     rule.selectorText?.includes(DX_RULE_PREFIX) ||
                     rule.cssRules?.[0]?.selectorText?.includes(DX_RULE_PREFIX) ||
                     rule.name?.startsWith(DX_RULE_PREFIX) ||
                     rule.style?.fontFamily === 'DXIcons';

    if(isDxRule) {
        constructedStyleSheet.insertRule(
            rule.cssText,
            constructedStyleSheet.cssRules.length
        );
    }
}

export function addShadowDomStyles($element) {
    const el = $element.get(0);
    const root = el.getRootNode();

    if(!root.host) {
        return;
    }

    if(!constructedStyleSheet) {
        constructedStyleSheet = createConstructedStyleSheet(root);

        processRules(el.ownerDocument.styleSheets, false);
        processRules(root.styleSheets, true);
    }

    root.adoptedStyleSheets = [constructedStyleSheet];
}

function getShadowDomElementsInViewPort(x, y, el) {
    let result = [];

    const rect = el.getBoundingClientRect();

    if(rect) {
        if(x >= rect.left && x <= rect.right - 1 && y <= rect.bottom - 1 && y >= rect.top) {
            result = [el];

            for(let i = 0; i < el.children.length; i++) {
                result.unshift(...getShadowDomElementsInViewPort(x, y, el.children[i]));
            }
        }
    }

    return result;
}

export function getShadowElementsFromPoint(x, y, root) {
    const result = [];
    // eslint-disable-next-line no-undef
    const childNodes = [...root.childNodes].filter(node => node.nodeType === Node.ELEMENT_NODE);

    for(let i = 0; i < childNodes.length; i++) {
        result.push(...getShadowDomElementsInViewPort(x, y, childNodes[i]));
    }

    return result;
}

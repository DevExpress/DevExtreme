let constructedStyleSheet = null;

function createConstructedStyleSheet(rootNode) {
    try {
        // eslint-disable-next-line no-undef
        return new CSSStyleSheet();
    } catch(err) {
        const styleEl = rootNode.ownerDocument.createElement('style');

        rootNode.appendChild(styleEl);

        return styleEl.sheet;
    }
}

function processRules(styleSheets) {
    [...styleSheets].forEach(sheet => {
        // NOTE: need try/catch block for not-supported cross-domain css
        try {
            for(let j = 0; j < sheet.cssRules.length; j++) {
                insertRule(sheet.cssRules[j]);
            }
        } catch(err) {
        }
    });
}

function insertRule(rule) {
    const isDxRule = rule.selectorText?.includes('.dx-') ||
                     rule.cssRules?.[0]?.selectorText?.includes('.dx-') ||
                     rule.name?.startsWith('dx-') ||
                     rule.style?.fontFamily === 'DXIcons';

    if(isDxRule) {
        constructedStyleSheet.insertRule(
            rule.cssText,
            constructedStyleSheet.cssRules.length
        );
    }
}

export function addShadowDOMStyles($element) {
    const el = $element.get(0);
    const root = el.getRootNode();
    const doc = el.ownerDocument;

    if(!root.host) {
        return;
    }

    if(!constructedStyleSheet) {
        constructedStyleSheet = createConstructedStyleSheet(root);

        processRules(doc.styleSheets);
    }

    root.adoptedStyleSheets = [constructedStyleSheet];
}

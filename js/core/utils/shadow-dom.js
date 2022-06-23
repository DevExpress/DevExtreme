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

function isDxSheet(sheet) {
    // NOTE: need try/catch block for cross-domain css
    // NOTE: need some rule here to detect if it's a DX sheet
    try {
        for(let i = 0; i < sheet.cssRules.length; i++) {
            if(sheet.cssRules[i].constructor.name === 'CSSStyleRule') {
                return sheet.cssRules[i].selectorText?.startsWith('.dx-');
            }
        }
    } catch(err) {
    }

    return false;
}

function processRules(styleSheets) {
    const sheets = [...styleSheets].filter(isDxSheet);

    sheets.forEach(sheet => {
        for(let j = 0; j < sheet.cssRules.length; j++) {
            insertRule(sheet.cssRules[j]);
        }
    });
}

function insertRule(rule) {
    constructedStyleSheet.insertRule(
        rule.cssText,
        constructedStyleSheet.cssRules.length
    );
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

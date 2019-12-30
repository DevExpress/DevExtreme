import domAdapter from 'core/dom_adapter';
import windowUtils from 'core/utils/window';
import serverSideDOMAdapter from './serverSideDOMAdapterPatch.js';

(function emulateNoContains() {
    const originalContains = Element.prototype.contains;
    Element.prototype.contains = function(element) {
        if(!element) {
            throw new Error('element should be defined');
        }

        return originalContains.apply(this, arguments);
    };
})();

(function emulateNoXMLNSAttr() {
    // NOTE: Will be allowed soon https://github.com/fgnass/domino/commit/b16cb1923f83db096b7cd0638734474e54b3308d#diff-52cea43ae897a1705ec51162aed25f63
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if(name.toLowerCase().substring(0, 5) === 'xmlns') {
            throw new Error('the operation is not allowed by Namespaces in XML');
        }

        return originalSetAttribute.apply(this, arguments);
    };
})();

(function emulateNoElementSizes() {
    const originalCreateElement = document.createElement;

    document.createElement = function() {
        const result = originalCreateElement.apply(this, arguments);

        ['offsetWidth', 'offsetHeight', 'getBoundingClientRect'].forEach(function(field) {
            Object.defineProperty(result, field, {
                get: function() {
                    return undefined;
                },
                set: function() {}
            });
        });

        return result;
    };

    Element.prototype.getClientRects = undefined;
})();

(function emulateStyleProps() {
    const originalCreateElement = document.createElement;
    const serverStyles = [
        'background',
        'backgroundAttachment',
        'backgroundColor',
        'backgroundImage',
        'backgroundPosition',
        'backgroundRepeat',
        'border',
        'borderBottom',
        'borderBottomColor',
        'borderBottomStyle',
        'borderBottomWidth',
        'borderCollapse',
        'borderColor',
        'borderLeft',
        'borderLeftColor',
        'borderLeftStyle',
        'borderLeftWidth',
        'borderRight',
        'borderRightColor',
        'borderRightStyle',
        'borderRightWidth',
        'borderSpacing',
        'borderStyle',
        'borderTop',
        'borderTopColor',
        'borderTopStyle',
        'borderTopWidth',
        'borderWidth',
        'bottom',
        'captionSide',
        'clear',
        'clip',
        'color',
        'content',
        'counterIncrement',
        'counterReset',
        'cssFloat',
        'cursor',
        'direction',
        'display',
        'emptyCells',
        'font',
        'fontFamily',
        'fontSize',
        'fontSizeAdjust',
        'fontStretch',
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'height',
        'left',
        'letterSpacing',
        'lineHeight',
        'listStyle',
        'listStyleImage',
        'listStylePosition',
        'listStyleType',
        'margin',
        'marginBottom',
        'marginLeft',
        'marginRight',
        'marginTop',
        'markerOffset',
        'marks',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'opacity',
        'orphans',
        'outline',
        'outlineColor',
        'outlineStyle',
        'outlineWidth',
        'overflow',
        'padding',
        'paddingBottom',
        'paddingLeft',
        'paddingRight',
        'paddingTop',
        'page',
        'pageBreakAfter',
        'pageBreakBefore',
        'pageBreakInside',
        'position',
        'quotes',
        'right',
        'size',
        'tableLayout',
        'textAlign',
        'textDecoration',
        'textIndent',
        'textShadow',
        'textTransform',
        'top',
        'unicodeBidi',
        'verticalAlign',
        'visibility',
        'whiteSpace',
        'widows',
        'width',
        'wordSpacing',
        'zIndex'
    ];

    const styleObj = {};

    serverStyles.forEach(function(style) {
        styleObj[style] = '';
    });

    document.createElement = function(tagName) {
        return tagName === 'dx' ? { style: styleObj } : originalCreateElement.apply(this, arguments);
    };
})();

(function emulateIncorrectMatches() {
    // https://github.com/fgnass/domino/issues/121
    const originalMatches = Element.prototype.matches;
    Element.prototype.matches = function(selector) {
        const selectorParts = selector.split(/\s|>/);
        let lastSelectorPart = selectorParts[selectorParts.length - 1];
        if(/^\.[\w|-]+$/.test(lastSelectorPart)) {
            lastSelectorPart = lastSelectorPart.substr(1);
            const index = this.className.indexOf(lastSelectorPart);
            const l = this.className[index + lastSelectorPart.length];
            if(index > -1 && l && l !== ' ') {
                return false;
            }
        }

        return originalMatches.apply(this, arguments);
    };
})();

const domAdapterBackup = {};
const makeDOMAdapterEmpty = function() {
    for(const field in domAdapter) {
        domAdapterBackup[field] = domAdapter[field];
        delete domAdapter[field];
    }
};
const restoreOriginalDomAdapter = function() {
    for(const field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

const windowMock = {
    isWindowMock: true
};

const errorFunc = function() {
    throw new Error('Window fields using is prevented');
};

const windowGetter = function() {
    return windowMock;
};

for(const field in window) {
    Object.defineProperty(windowMock, field, {
        get: field === 'window' ? windowGetter : errorFunc,
        set: errorFunc
    });
}

const makeWindowEmpty = function() {
    windowUtils.hasWindow = function() {
        return false;
    };
    windowUtils.getWindow = function() {
        return windowMock;
    };
};

// Ensure domAdapter is not used on scripts loading stage (until the integration is not injected)
makeDOMAdapterEmpty();
// Emulate SSR where window is not exists
makeWindowEmpty();

QUnit.begin(function() {
    // Now domAdapter is allowed to use
    restoreOriginalDomAdapter();
    // Emulate DOMAdapter integration
    serverSideDOMAdapter.set();
});

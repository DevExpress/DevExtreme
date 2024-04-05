/* eslint-disable no-undef */
function getRoot() {
    return document.querySelector('#parentContainer').shadowRoot;
}

function get(selector) {
    return typeof selector === 'string' && selector ? getRoot()?.querySelectorAll(selector) : selector;
}

window.addShadowRootTree = () => {
    const root = document.querySelector('#parentContainer');
    const childNodes = root.childNodes;

    if(root.shadowRoot) {
        return;
    }

    root.attachShadow({ mode: 'open' });

    const shadowContainer = document.createElement('div');
    shadowContainer.append.apply(shadowContainer, Array.from(childNodes));

    root.shadowRoot.appendChild(shadowContainer);
};

$(function() {
    const jQueryInit = jQuery.fn.init;

    jQuery.fn.init = function(selector, context, root) {
        const result = new jQueryInit(selector, context, root);
        const resultElement = result.get(0);

        if(!resultElement) {
            return new jQueryInit(get(selector), context, root);
        }

        if(resultElement === getRoot()?.host) {
            return new jQueryInit(get(':scope div')[0], context, root);
        }

        return result;
    };

    window.addShadowRootTree();
});
